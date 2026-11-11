import mongoose from "mongoose";

export const LEAD_STAGES = ["New", "Contacted", "Meeting scheduled", "Proposal sent", "Won", "Lost", "Unqualified"];
export const OPEN_STAGES = LEAD_STAGES.slice(0, 4);
export const LEAD_SOURCES = ["Manual add", "CSV import", "Website form", "Meta Lead Ads", "Click-to-WhatsApp", "Google Ads form", "Calendly booking"];

const leadSchema = new mongoose.Schema({
  leadNumber: { type: Number, required: true, unique: true, immutable: true },
  leadId: { type: String, required: true, unique: true, immutable: true },
  name: { type: String, required: true, trim: true },
  company: { type: String, trim: true, default: "" },
  designation: { type: String, trim: true, default: "" },
  phone: { type: String, trim: true, default: "" },
  phoneNormalized: { type: String, default: "", index: true },
  emailNormalized: { type: String, default: "", index: true },
  instagramNormalized: { type: String, default: "", index: true },
  linkedinNormalized: { type: String, default: "", index: true },
  email: { type: String, trim: true, lowercase: true, default: "" },
  instagramUsername: { type: String, trim: true, lowercase: true, default: "" },
  linkedinUsername: { type: String, trim: true, lowercase: true, default: "" },
  whatsappNumber: { type: String, trim: true, default: "" },
  website: { type: String, trim: true, default: "" },
  city: { type: String, trim: true, default: "" },
  state: { type: String, trim: true, default: "" },
  source: { type: String, enum: LEAD_SOURCES, default: "Manual add" },
  subSource: { type: String, trim: true, default: "" },
  sourceEvents: [{ source: String, occurredAt: Date, details: mongoose.Schema.Types.Mixed }],
  services: [{ type: String, trim: true }],
  requirementSummary: { type: String, trim: true, default: "" },
  industry: { type: String, trim: true, default: "" },
  companySize: { type: String, trim: true, default: "" },
  timeline: { type: String, trim: true, default: "" },
  stage: { type: String, enum: LEAD_STAGES, default: "New" },
  stageEnteredAt: { type: Date, default: Date.now },
  priority: { type: String, enum: ["Low", "Medium", "High", "Super High"], default: "Medium" },
  winConfidence: { type: Number, enum: [25, 50, 75, 95, null], default: null },
  winConfidenceHistory: [{ value: Number, changedAt: Date, changedBy: String }],
  expectedDealValue: { type: Number, min: 0, default: null },
  expectedCloseDate: { type: Date, default: null },
  finalDealValue: { type: Number, min: 0, default: null },
  lostReason: { type: String, trim: true, default: "" },
  lostNote: { type: String, trim: true, default: "" },
  competitor: { type: String, trim: true, default: "" },
  unqualifiedReason: { type: String, trim: true, default: "" },
  ownerId: { type: mongoose.Schema.Types.ObjectId, ref: "Staff", default: null },
  ownerName: { type: String, trim: true, default: "" },
  assignedAt: { type: Date, default: null },
  assignedBy: { type: String, default: "" },
  firstResponseDueAt: { type: Date, required: true },
  firstResponseAt: { type: Date, default: null },
  firstResponseMinutes: { type: Number, default: null },
  lastActivityAt: { type: Date, default: Date.now },
  lastInboundAt: { type: Date, default: null },
  lastOutboundAt: { type: Date, default: null },
  nextStepText: { type: String, trim: true, default: "Assign owner" },
  nextStepDueAt: { type: Date, required: true },
  followupCount: { type: Number, default: 0 },
  closedAt: { type: Date, default: null },
  reopenedAt: { type: Date, default: null },
  reopenedCount: { type: Number, default: 0 },
  duplicateOf: { type: mongoose.Schema.Types.ObjectId, ref: "Lead", default: null },
  tags: [{ type: String, trim: true }],
  attachments: [{ name: String, url: String, mimeType: String, uploadedAt: Date }],
  notes: { type: String, default: "" },
  createdBy: { type: String, default: "System" },
  updatedBy: { type: String, default: "System" },
}, { timestamps: true });

leadSchema.index({ phone: 1 });
leadSchema.index({ email: 1 });
leadSchema.index({ instagramUsername: 1 });
leadSchema.index({ linkedinUsername: 1 });
leadSchema.index({ stage: 1, createdAt: -1 });

export default mongoose.model("Lead", leadSchema);
