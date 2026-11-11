
import express from "express";

import {
  login,
  getMe,
  createStaff,
  getStaff,
} from "../controllers/authController.js";

import authMiddleware from "../middleware/authMiddleware.js";
import authorizeRoles from "../middleware/roleMiddleware.js";
import { loginLimiter } from "../middleware/rateLimitMiddleware.js";

const router = express.Router();

// Public login with stricter rate limiting.
router.post("/login", loginLimiter, login);

// Authenticated user's profile.
router.get("/me", authMiddleware, getMe);

// Superadmin-only staff management.
router.post(
  "/staff",
  authMiddleware,
  authorizeRoles("superadmin"),
  createStaff
);

router.get(
  "/staff",
  authMiddleware,
  authorizeRoles("superadmin"),
  getStaff
);

export default router;
