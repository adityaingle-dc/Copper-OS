import Lead, { OPEN_STAGES } from "../models/Lead.js";
import Activity from "../models/Activity.js";
import Counter from "../models/Counter.js";
import { calculateFirstResponseDue, normalizeEmail, normalizePhone, normalizeSocial } from "../utils/leadHelpers.js";

export async function nextLeadId() {
  const counter = await Counter.findOneAndUpdate(
    { _id: "lead" }, { $inc: { sequence: 1 } }, { new: true, upsert: true, setDefaultsOnInsert: true }
  );
  return { leadNumber: counter.sequence, leadId: `CS-LD-${String(counter.sequence).padStart(5, "0")}` };
}

export async function findDuplicateKeys(input) {
  const phone = normalizePhone(input.phone || input.whatsappNumber);
  const email = normalizeEmail(input.email);
  const instagram = normalizeSocial(input.instagramUsername);
  const linkedin = normalizeSocial(input.linkedinUsername);
  const conditions = [];
  if (phone) conditions.push({ phoneNormalized: phone });
  if (email) conditions.push({ emailNormalized: email });
  if (instagram) conditions.push({ instagramNormalized: instagram });
  if (linkedin) conditions.push({ linkedinNormalized: linkedin });
  if (!conditions.length) return null;
  return Lead.findOne({ $or: conditions }).sort({ createdAt: -1 });
}

export async function createLead(payload, actor = "System", actorRole = "Sales rep") {
  const duplicate = await findDuplicateKeys(payload);
  if (duplicate) {
    const isManual = (payload.source || "Manual add") === "Manual add";
    const isSuperadminOverride = payload.createAnyway === true && payload.overrideReason?.trim() && actorRole === "Superadmin";
    if (isManual && !isSuperadminOverride) {
      const error = new Error("A matching lead already exists. Open the existing lead or ask a Superadmin to create anyway.");
      error.status = 409;
      error.details = { duplicateLeadId: duplicate.leadId, duplicateLeadMongoId: duplicate._id };
      throw error;
    }
    if (!isManual && !["Lost", "Unqualified"].includes(duplicate.stage)) {
      await Lead.updateOne({ _id: duplicate._id }, { $push: { sourceEvents: { source: payload.source, occurredAt: new Date(), details: payload.sourceDetails || {} } }, $set: { lastActivityAt: new Date() } });
      await Activity.create({ lead: duplicate._id, type: "system", title: `Re-enquired via ${payload.source || "another source"}`, createdBy: actor });
      return { lead: duplicate, duplicate: true, reEnquiry: true };
    }
    if (isSuperadminOverride) {
      await Activity.create({ lead: duplicate._id, type: "system", title: "Duplicate override recorded", description: payload.overrideReason, createdBy: actor });
    }
    if (duplicate.stage === "Won") payload.tags = [...(payload.tags || []), "Existing client"];
    payload.duplicateOf = duplicate._id;
  }

  const now = new Date();
  const ids = await nextLeadId();
  const due = calculateFirstResponseDue(now);
  const lead = await Lead.create({
    ...payload, ...ids, phoneNormalized: normalizePhone(payload.phone || payload.whatsappNumber), emailNormalized: normalizeEmail(payload.email), instagramNormalized: normalizeSocial(payload.instagramUsername), linkedinNormalized: normalizeSocial(payload.linkedinUsername), source: payload.source || "Manual add", stage: "New", priority: payload.priority || "Medium",
    firstResponseDueAt: due, nextStepText: "Assign owner", nextStepDueAt: new Date(now.getTime() + 30 * 60_000),
    createdBy: actor, updatedBy: actor, lastActivityAt: now,
  });
  await Activity.create({ lead: lead._id, type: "task", title: "Assign owner", description: "Initial assignment task", dueAt: new Date(now.getTime() + 30 * 60_000), createdBy: actor });
  await Activity.create({ lead: lead._id, type: "system", title: "Lead created", description: `Captured via ${lead.source}`, createdBy: actor });
  return { lead, duplicate: false, reEnquiry: false };
}

export async function validateStageTransition(lead, targetStage, body = {}) {
  const ActivityModel = Activity;
  const fromIndex = OPEN_STAGES.indexOf(lead.stage);
  const toIndex = OPEN_STAGES.indexOf(targetStage);
  if (targetStage === lead.stage) return;
  if (OPEN_STAGES.includes(targetStage) && (!body.nextStepText?.trim() || !body.nextStepDueAt)) {
    throw Object.assign(new Error("Every open lead must have a new next step and due date after a stage change."), { status: 422, details: { missing: ["nextStepText", "nextStepDueAt"] } });
  }
  if (body.nextStepDueAt && new Date(body.nextStepDueAt) < new Date()) {
    throw Object.assign(new Error("Next-step due date cannot be in the past."), { status: 422 });
  }
  if (OPEN_STAGES.includes(targetStage) && OPEN_STAGES.includes(lead.stage)) {
    if (toIndex > fromIndex + 1) throw Object.assign(new Error("Move forward one stage at a time."), { status: 422 });
    if (toIndex < fromIndex && !body.reason?.trim()) throw Object.assign(new Error("A note explaining the backward move is required."), { status: 422 });
    if (targetStage === "Contacted") {
      const outbound = await ActivityModel.exists({ lead: lead._id, type: "outbound" });
      const placedCall = await ActivityModel.exists({ lead: lead._id, type: "call", "metadata.direction": "outbound" });
      if (!outbound && !placedCall) throw Object.assign(new Error("Log a real outbound action before moving to Contacted."), { status: 422 });
    }
    if (targetStage === "Meeting scheduled") {
      const meeting = await ActivityModel.exists({ lead: lead._id, type: "meeting", status: { $ne: "Cancelled" } });
      if (!meeting || !lead.services?.length) throw Object.assign(new Error("Add at least one service line and create a meeting before moving to Meeting scheduled."), { status: 422 });
    }
    if (targetStage === "Proposal sent") {
      const missing = [];
      if (!lead.services?.length) missing.push("service line");
      if (!(body.expectedDealValue ?? lead.expectedDealValue) && (body.expectedDealValue ?? lead.expectedDealValue) !== 0) missing.push("expected deal value");
      if (!body.expectedCloseDate && !lead.expectedCloseDate) missing.push("expected close date");
      if (!(body.winConfidence ?? lead.winConfidence)) missing.push("win confidence");
      if (!body.proposalShared) missing.push("proposal shared/linked");
      if (missing.length) throw Object.assign(new Error(`Cannot move to Proposal sent. Missing: ${missing.join(", ")}.`), { status: 422, details: { missing } });
    }
  }
  if (targetStage === "Won" && !["Meeting scheduled", "Proposal sent"].includes(lead.stage)) throw Object.assign(new Error("Won is allowed from Meeting scheduled or Proposal sent."), { status: 422 });
  if (targetStage === "Won" && body.finalDealValue == null) throw Object.assign(new Error("Final deal value is required to mark a lead Won."), { status: 422 });
  if (targetStage === "Lost" && (!body.lostReason?.trim() || !body.lostNote?.trim())) throw Object.assign(new Error("Lost reason and note are required."), { status: 422 });
  if (targetStage === "Unqualified" && !body.unqualifiedReason?.trim()) throw Object.assign(new Error("Unqualified reason is required."), { status: 422 });
  if (targetStage === "Contacted" && lead.stage === "Lost" || targetStage === "Contacted" && lead.stage === "Unqualified") {
    if (!body.reason?.trim()) throw Object.assign(new Error("A reason is required to reopen this lead."), { status: 422 });
  }
  if (["Won", "Lost", "Unqualified"].includes(targetStage) && !OPEN_STAGES.includes(lead.stage) && !(lead.stage === "Won" && body.reopen)) {
    throw Object.assign(new Error("This stage transition is not allowed."), { status: 422 });
  }
}

export async function updateLeadActivityTimestamp(leadId, update = {}) {
  await Lead.findByIdAndUpdate(leadId, { $set: { lastActivityAt: new Date(), ...update } });
}
