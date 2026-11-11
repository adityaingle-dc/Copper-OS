import mongoose from "mongoose";

const activitySchema = new mongoose.Schema({
  lead: { type: mongoose.Schema.Types.ObjectId, ref: "Lead", required: true, index: true },
  type: { type: String, enum: ["task", "note", "call", "outbound", "meeting", "stage", "assignment", "system"], required: true },
  title: { type: String, required: true, trim: true },
  description: { type: String, trim: true, default: "" },
  assigneeId: { type: mongoose.Schema.Types.ObjectId, ref: "Staff", default: null },
  assigneeName: { type: String, default: "" },
  dueAt: { type: Date, default: null },
  priority: { type: String, enum: ["Low", "Medium", "High", "Super High"], default: "Medium" },
  status: { type: String, enum: ["To do", "Done", "Cancelled"], default: "To do" },
  outcomeNote: { type: String, default: "" },
  pinned: { type: Boolean, default: false },
  metadata: { type: mongoose.Schema.Types.Mixed, default: {} },
  createdBy: { type: String, default: "System" },
  completedAt: { type: Date, default: null },
}, { timestamps: true });

activitySchema.index({ lead: 1, createdAt: -1 });
export default mongoose.model("Activity", activitySchema);
