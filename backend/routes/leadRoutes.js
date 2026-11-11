
import { Router } from "express";

import {
  addActivity,
  addLead,
  assignLead,
  changeStage,
  getLead,
  listLeads,
  updateActivity,
  updateLead,
} from "../controllers/leadController.js";

import { asyncHandler } from "../middleware/asyncHandler.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = Router();

// All Leads API endpoints require authentication.
router.use(authMiddleware);

// List leads.
router.get("/", listLeads);

// Create a lead.
router.post("/", addLead);

// Get lead details.
router.get("/:leadId", getLead);

// Update lead information.
router.patch("/:leadId", updateLead);

// Change pipeline stage.
router.patch("/:leadId/stage", changeStage);

// Assign or reassign a lead.
router.patch("/:leadId/assignment", assignLead);

// Create an activity for a lead.
router.post("/:leadId/activities", addActivity);

// Update an activity.
router.patch("/activities/:activityId", updateActivity);

// Duplicate preview endpoint.
// It checks matching records without creating or modifying anything.
router.post(
  "/duplicate-check",
  asyncHandler(async (req, res) => {
    const { findDuplicateKeys } = await import(
      "../services/leadService.js"
    );

    const duplicate = await findDuplicateKeys(req.body || {});

    if (!duplicate) {
      return res.json({
        success: true,
        duplicate: false,
      });
    }

    return res.json({
      success: true,
      duplicate: true,
      data: {
        leadId: duplicate.leadId,
        name: duplicate.name,
        company: duplicate.company,
        stage: duplicate.stage,
      },
    });
  })
);

export default router;
