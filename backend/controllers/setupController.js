
import User from "../models/User.js";

// POST /api/auth/setup
// Creates the first Superadmin account.
// Setup is blocked once a Superadmin already exists.
export const createInitialSuperadmin = async (req, res, next) => {
  try {
    const existingSuperadmin = await User.exists({
      role: "superadmin",
    });

    if (existingSuperadmin) {
      return res.status(403).json({
        success: false,
        message: "Initial setup has already been completed.",
      });
    }

    const name = process.env.SUPERADMIN_NAME?.trim();
    const email = process.env.SUPERADMIN_EMAIL?.trim().toLowerCase();
    const password = process.env.SUPERADMIN_PASSWORD;

    if (!name || !email || !password) {
      return res.status(500).json({
        success: false,
        message: "Superadmin environment variables are not configured.",
      });
    }

    if (password.length < 10) {
      return res.status(400).json({
        success: false,
        message: "Superadmin password must contain at least 10 characters.",
      });
    }

    const existingEmail = await User.findOne({ email });

    if (existingEmail) {
      return res.status(409).json({
        success: false,
        message: "This email is already registered. Check the existing account.",
      });
    }

    const superadmin = await User.create({
      name,
      email,
      password,
      role: "superadmin",
      isActive: true,
    });

    return res.status(201).json({
      success: true,
      message: "Initial Superadmin account created successfully.",
      user: {
        id: superadmin._id.toString(),
        name: superadmin.name,
        email: superadmin.email,
        role: superadmin.role,
      },
    });
  } catch (error) {
    next(error);
  }
};
