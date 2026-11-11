
import { Router } from "express";
import mongoose from "mongoose";

import Activity from "../models/Activity.js";
import Lead from "../models/Lead.js";
import { asyncHandler } from "../middleware/asyncHandler.js";

const router = Router();

const getActorName = (req) =>
  req.user?.name || req.user?.email || "System";

// GET /api/activities?leadId=CS-LD-00001
// Retrieve activities, optionally filtered by lead.
router.get(
  "/",
  asyncHandler(async (req, res) => {
    const { leadId, status, type } = req.query;
    const filter = {};

    if (leadId) {
      const lead = await Lead.findOne({ leadId }).select("_id");

      if (!lead) {
        return res.status(404).json({
          success: false,
          message: "Lead not found.",
        });
      }

      filter.lead = lead._id;
    }

    if (status) filter.status = status;
    if (type) filter.type = type;

    const activities = await Activity.find(filter)
      .sort({ createdAt: -1 })
      .limit(200);

    return res.status(200).json({
      success: true,
      count: activities.length,
      data: activities,
    });
  })
);

// POST /api/activities
// Create an activity for an existing lead.
router.post(
  "/",
  asyncHandler(async (req, res) => {
    const {
      leadId,
      type,
      title,
      description = "",
      dueAt = null,
      priority = "Medium",
      status = "To do",
      metadata = {},
      pinned = false,
    } = req.body;

    if (!leadId || !type || !title?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Lead ID, activity type and title are required.",
      });
    }

    const validTypes = [
      "task",
      "note",
      "call",
      "outbound",
      "meeting",
      "stage",
      "assignment",
      "system",
    ];

    if (!validTypes.includes(type)) {
      return res.status(400).json({
        success: false,
        message: "Invalid activity type.",
      });
    }

    const lead = await Lead.findOne({ leadId });

    if (!lead) {
      return res.status(404).json({
        success: false,
        message: "Lead not found.",
      });
    }

    if (dueAt && Number.isNaN(Date.parse(dueAt))) {
      return res.status(400).json({
        success: false,
        message: "Invalid activity due date.",
      });
    }

    if (dueAt && new Date(dueAt) < new Date()) {
      return res.status(422).json({
        success: false,
        message: "Activity due date cannot be in the past.",
      });
    }

    if (type === "outbound") {
      const validChannels = ["call", "whatsapp", "instagram", "email"];

      if (!validChannels.includes(metadata.channel)) {
        return res.status(400).json({
          success: false,
          message: "Specify a valid outbound channel.",
        });
      }
    }

    const activity = await Activity.create({
      lead: lead._id,
      type,
      title: title.trim(),
      description,
      dueAt,
      priority,
      status,
      metadata,
      pinned,
      createdBy: getActorName(req),
    });

    lead.lastActivityAt = new Date();

    // Only a real outbound action stops the first-response SLA.
    if (
      type === "outbound" ||
      (type === "call" && metadata.direction === "outbound")
    ) {
      const now = new Date();

      lead.lastOutboundAt = now;

      if (!lead.firstResponseAt) {
        lead.firstResponseAt = now;
        lead.firstResponseMinutes = Math.max(
          0,
          Math.round((now.getTime() - lead.createdAt.getTime()) / 60000)
        );
      }
    }

    await lead.save();

    return res.status(201).json({
      success: true,
      message: "Activity created successfully.",
      data: activity,
    });
  })
);

// PATCH /api/activities/:activityId
// Update an activity.
router.patch(
  "/:activityId",
  asyncHandler(async (req, res) => {
    const { activityId } = req.params;

    if (!mongoose.isValidObjectId(activityId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid activity ID.",
      });
    }

    const activity = await Activity.findById(activityId);

    if (!activity) {
      return res.status(404).json({
        success: false,
        message: "Activity not found.",
      });
    }

    const { title, description, dueAt, priority, status, outcomeNote, pinned } =
      req.body;

    if (status && !["To do", "Done", "Cancelled"].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid activity status.",
      });
    }

    if (dueAt && Number.isNaN(Date.parse(dueAt))) {
      return res.status(400).json({
        success: false,
        message: "Invalid activity due date.",
      });
    }

    if (dueAt !== undefined && dueAt && new Date(dueAt) < new Date()) {
      return res.status(422).json({
        success: false,
        message: "Activity due date cannot be in the past.",
      });
    }

    if (title !== undefined) activity.title = title.trim();
    if (description !== undefined) activity.description = description;
    if (dueAt !== undefined) activity.dueAt = dueAt || null;
    if (priority !== undefined) activity.priority = priority;
    if (outcomeNote !== undefined) activity.outcomeNote = outcomeNote;
    if (pinned !== undefined) activity.pinned = pinned;

    if (status !== undefined) {
      activity.status = status;
      activity.completedAt =
        status === "Done" ? new Date() : null;
    }

    await activity.save();

    return res.status(200).json({
      success: true,
      message: "Activity updated successfully.",
      data: activity,
    });
  })
);

export default router;
