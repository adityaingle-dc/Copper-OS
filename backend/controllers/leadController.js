import mongoose from "mongoose";
import Lead, { LEAD_STAGES } from "../models/Lead.js";
import Activity from "../models/Activity.js";
import { asyncHandler } from "../middleware/asyncHandler.js";
import { createLead, validateStageTransition, updateLeadActivityTimestamp } from "../services/leadService.js";
import { getSlaStatus } from "../utils/leadHelpers.js";

const actorName = (req) => req.user?.name || req.user?.email || "System";
const decorateLead = (lead) => {
  const value = lead.toObject ? lead.toObject() : lead;
  return { ...value, slaStatus: getSlaStatus(value), isUnassigned: !value.ownerId && !value.ownerName };
};

export const listLeads = asyncHandler(async (req, res) => {
  const { search = "", stage, source, priority, owner, page = 1, limit = 50 } = req.query;
  const filter = {};
  if (stage && LEAD_STAGES.includes(stage)) filter.stage = stage;
  if (source) filter.source = source;
  if (priority) filter.priority = priority;
  if (owner === "unassigned") filter.ownerId = null;
  if (search.trim()) {
    const escaped = search.trim().replace(/[.*+?^${}()|[\\]\\]/g, "\\$&");
    filter.$or = [{ leadId: new RegExp(escaped, "i") }, { name: new RegExp(escaped, "i") }, { company: new RegExp(escaped, "i") }];
  }
  const pageNumber = Math.max(1, Number(page));
  const pageSize = Math.min(100, Math.max(1, Number(limit)));
  const [leads, total] = await Promise.all([
    Lead.find(filter).sort({ createdAt: -1 }).skip((pageNumber - 1) * pageSize).limit(pageSize),
    Lead.countDocuments(filter),
  ]);
  res.json({ success: true, data: leads.map(decorateLead), pagination: { page: pageNumber, limit: pageSize, total, pages: Math.ceil(total / pageSize) } });
});

export const getLead = asyncHandler(async (req, res) => {
  const lead = await Lead.findOne({ leadId: req.params.leadId });
  if (!lead) return res.status(404).json({ success: false, message: "Lead not found" });
  const activities = await Activity.find({ lead: lead._id }).sort({ createdAt: -1 });
  res.json({ success: true, data: { ...decorateLead(lead), activities } });
});

export const addLead = asyncHandler(async (req, res) => {
  const result = await createLead(req.body, actorName(req), req.user?.role || "Sales rep");
  if (result.duplicate && result.reEnquiry) return res.status(200).json({ success: true, reEnquiry: true, data: decorateLead(result.lead), message: "Existing open lead updated with a new source event." });
  res.status(201).json({ success: true, data: decorateLead(result.lead) });
});

export const updateLead = asyncHandler(async (req, res) => {
  const allowed = ["name", "company", "designation", "phone", "email", "instagramUsername", "linkedinUsername", "whatsappNumber", "website", "city", "state", "subSource", "services", "requirementSummary", "industry", "companySize", "timeline", "priority", "winConfidence", "expectedDealValue", "expectedCloseDate", "notes", "tags"];
  const updates = {};
  for (const key of allowed) if (req.body[key] !== undefined) updates[key] = req.body[key];
  if (updates.priority === "Super High" && req.user?.role !== "Superadmin" && req.body.priority !== "Super High") return res.status(403).json({ success: false, message: "Not permitted" });
  if (updates.winConfidence !== undefined && ![25, 50, 75, 95, null].includes(updates.winConfidence)) return res.status(400).json({ success: false, message: "Win confidence must be 25, 50, 75, 95 or blank." });
  updates.updatedBy = actorName(req);
  const lead = await Lead.findOneAndUpdate({ leadId: req.params.leadId }, { $set: updates }, { new: true, runValidators: true });
  if (!lead) return res.status(404).json({ success: false, message: "Lead not found" });
  if (updates.winConfidence !== undefined) {
    lead.winConfidenceHistory.push({ value: updates.winConfidence, changedAt: new Date(), changedBy: actorName(req) });
    await lead.save();
  }
  await updateLeadActivityTimestamp(lead._id);
  res.json({ success: true, data: decorateLead(lead) });
});

export const changeStage = asyncHandler(async (req, res) => {
  const { stage, ...details } = req.body;
  if (!LEAD_STAGES.includes(stage)) return res.status(400).json({ success: false, message: "Invalid lead stage." });
  const lead = await Lead.findOne({ leadId: req.params.leadId });
  if (!lead) return res.status(404).json({ success: false, message: "Lead not found" });
  await validateStageTransition(lead, stage, details);
  const previous = lead.stage;
  const now = new Date();
  if (stage === "Proposal sent") {
    lead.priority = "Super High";
    lead.expectedDealValue = details.expectedDealValue ?? lead.expectedDealValue;
    lead.expectedCloseDate = details.expectedCloseDate ?? lead.expectedCloseDate;
    lead.winConfidence = details.winConfidence ?? lead.winConfidence;
    lead.winConfidenceHistory.push({ value: lead.winConfidence, changedAt: now, changedBy: actorName(req) });
  }
  if (stage === "Won") lead.finalDealValue = details.finalDealValue;
  if (stage === "Lost") { lead.lostReason = details.lostReason; lead.lostNote = details.lostNote; lead.competitor = details.competitor || ""; }
  if (stage === "Unqualified") lead.unqualifiedReason = details.unqualifiedReason;
  if (["Won", "Lost", "Unqualified"].includes(stage)) lead.closedAt = now;
  else lead.closedAt = null;
  if (["Lost", "Unqualified"].includes(previous) && stage === "Contacted") {
    lead.reopenedAt = now;
    lead.reopenedCount += 1;
  }
  lead.stage = stage;
  lead.stageEnteredAt = now;
  lead.updatedBy = actorName(req);
  if (details.nextStepText && !["Won", "Lost", "Unqualified"].includes(stage)) lead.nextStepText = details.nextStepText;
  if (details.nextStepDueAt && !["Won", "Lost", "Unqualified"].includes(stage)) lead.nextStepDueAt = new Date(details.nextStepDueAt);
  await lead.save();
  await Activity.create({ lead: lead._id, type: "stage", title: `Stage changed: ${previous} → ${stage}`, description: details.reason || "", createdBy: actorName(req), metadata: { from: previous, to: stage } });
  res.json({ success: true, data: decorateLead(lead) });
});

export const assignLead = asyncHandler(async (req, res) => {
  const { ownerId = null, ownerName = "", reason = "" } = req.body;
  const lead = await Lead.findOne({ leadId: req.params.leadId });
  if (!lead) return res.status(404).json({ success: false, message: "Lead not found" });
  if (lead.ownerId && !reason.trim()) return res.status(422).json({ success: false, message: "A reason is required for reassignment." });
  const previousOwner = lead.ownerName || "Unassigned";
  lead.ownerId = ownerId && mongoose.isValidObjectId(ownerId) ? ownerId : null;
  lead.ownerName = ownerName;
  lead.assignedAt = ownerId || ownerName ? new Date() : null;
  lead.assignedBy = actorName(req);
  lead.nextStepText = ownerId || ownerName ? "Make first contact" : "Assign owner";
  lead.nextStepDueAt = ownerId || ownerName ? lead.firstResponseDueAt : new Date(Date.now() + 30 * 60_000);
  lead.updatedBy = actorName(req);
  await lead.save();
  await Activity.updateMany({ lead: lead._id, type: "task", title: "Assign owner", status: "To do" }, { $set: { status: "Cancelled", completedAt: new Date() } });
  await Activity.create({ lead: lead._id, type: "assignment", title: `Assigned to ${lead.ownerName || "Unassigned"}`, description: `${previousOwner} → ${lead.ownerName || "Unassigned"}${reason ? ` · ${reason}` : ""}`, createdBy: actorName(req) });
  if (lead.ownerName) await Activity.create({ lead: lead._id, type: "task", title: "Make first contact", dueAt: lead.firstResponseDueAt, assigneeId: lead.ownerId, assigneeName: lead.ownerName, createdBy: actorName(req) });
  res.json({ success: true, data: decorateLead(lead) });
});

export const addActivity = asyncHandler(async (req, res) => {
  const lead = await Lead.findOne({ leadId: req.params.leadId });
  if (!lead) return res.status(404).json({ success: false, message: "Lead not found" });
  const { type, title, description = "", dueAt = null, status = "To do", metadata = {}, pinned = false } = req.body;
  if (!type || !title?.trim()) return res.status(400).json({ success: false, message: "Activity type and title are required." });
  if (type === "outbound" && !["call", "whatsapp", "instagram", "email"].includes(metadata.channel)) return res.status(400).json({ success: false, message: "Outbound activity must specify call, whatsapp, instagram or email." });
  if (dueAt && new Date(dueAt) < new Date()) return res.status(422).json({ success: false, message: "Activity due date cannot be in the past." });
  const activity = await Activity.create({ lead: lead._id, type, title, description, dueAt, status, metadata, pinned, createdBy: actorName(req) });
  const update = { lastActivityAt: new Date() };
  if (type === "outbound" || (type === "call" && metadata.direction === "outbound")) {
    update.lastOutboundAt = new Date();
    if (!lead.firstResponseAt) {
      update.firstResponseAt = new Date();
      update.firstResponseMinutes = Math.max(0, Math.round((Date.now() - lead.createdAt.getTime()) / 60_000));
    }
  }
  await Lead.findByIdAndUpdate(lead._id, { $set: update });
  res.status(201).json({ success: true, data: activity });
});

export const updateActivity = asyncHandler(async (req, res) => {
  const activity = await Activity.findById(req.params.activityId);
  if (!activity) return res.status(404).json({ success: false, message: "Activity not found" });
  const { status, outcomeNote, title, dueAt, pinned } = req.body;
  if (status && !["To do", "Done", "Cancelled"].includes(status)) return res.status(400).json({ success: false, message: "Invalid activity status." });
  if (status) { activity.status = status; activity.completedAt = status === "Done" ? new Date() : null; }
  if (outcomeNote !== undefined) activity.outcomeNote = outcomeNote;
  if (title !== undefined) activity.title = title;
  if (dueAt !== undefined) activity.dueAt = dueAt;
  if (pinned !== undefined) activity.pinned = pinned;
  await activity.save();
  res.json({ success: true, data: activity });
});
