
import dotenv from "dotenv";
import mongoose from "mongoose";

import connectDB from "../config/db.js";
import User from "../models/User.js";

dotenv.config();

const createSuperadmin = async () => {
  try {
    const name = process.env.SUPERADMIN_NAME?.trim();
    const email = process.env.SUPERADMIN_EMAIL?.trim().toLowerCase();
    const password = process.env.SUPERADMIN_PASSWORD;

    // Validate environment configuration.
    if (!name || !email || !password) {
      throw new Error(
        "SUPERADMIN_NAME, SUPERADMIN_EMAIL and SUPERADMIN_PASSWORD must be configured in .env."
      );
    }

    if (password.length < 10) {
      throw new Error(
        "Superadmin password must contain at least 10 characters."
      );
    }

    // Connect to MongoDB.
    await connectDB();

    // Prevent creation of another Superadmin.
    const existingSuperadmin = await User.exists({
      role: "superadmin",
    });

    if (existingSuperadmin) {
      console.log("A Superadmin account already exists. Setup skipped.");
      return;
    }

    // Prevent email conflicts with existing staff.
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      throw new Error(
        "This email already belongs to another account. Use a different SUPERADMIN_EMAIL."
      );
    }

    // Create the initial Superadmin.
    const superadmin = await User.create({
      name,
      email,
      password,
      role: "superadmin",
      isActive: true,
    });

    console.log("\nSuperadmin created successfully.");
    console.log("--------------------------------");
    console.log(`Name: ${superadmin.name}`);
    console.log(`Email: ${superadmin.email}`);
    console.log(`Role: ${superadmin.role}`);
    console.log("--------------------------------");
    console.log("You can now log in through the Copper OS frontend.");
  } catch (error) {
    console.error("\nSuperadmin setup failed:", error.message);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
};

createSuperadmin();
