import type { Request, Response } from "express";
import User from "../../models/User.js";

export const checkUsernameHandler = async (req: Request, res: Response) => {
  try {
    const { username } = req.body;

    if (!username || typeof username !== "string") {
      return res.status(400).json({
        success: false,
        message: "Username is required.",
      });
    }

    const formattedUsername = username.toLowerCase().trim();
    const exists = await User.findOne({ username: formattedUsername }).lean();

    if (exists) {
      return res.status(200).json({
        success: true,
        available: false,
        message: "Username is already taken.",
      });
    }

    return res.status(200).json({
      success: true,
      available: true,
      message: "Username is available.",
    });
  } catch (error) {
    console.error("Username check error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error. Please try again later.",
    });
  }
};

