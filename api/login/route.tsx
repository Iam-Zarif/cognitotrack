import { Request, Response } from "express";
import User from "../../models/User";
import bcrypt from "bcrypt";
import { SignJWT } from "jose";

const JWT_SECRET: string = process.env.JWT_SECRET || "supersecretkey";

export const loginHandler = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { usernameOrEmail, password } = req.body;

    if (!usernameOrEmail || !password) {
      return res.status(400).json({
        success: false,
        message: "Username/Email and password are required."
      });
    }

    const user = await User.findOne({
      $or: [{ email: usernameOrEmail }, { username: usernameOrEmail }]
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found."
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Incorrect password."
      });
    }

  const token = await new SignJWT({ id: user._id })
      .setProtectedHeader({ alg: "HS256" })
      .setExpirationTime("7d")
      .sign(new TextEncoder().encode(JWT_SECRET));
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 7 * 24 * 60 * 60 * 1000,
      sameSite: "strict"
    });

    return res.status(200).json({
      success: true,
      message: "Login successful.",
      user: {
        id: user._id,
        fullname: user.fullname,
        username: user.username,
        email: user.email
      }
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error."
    });
  }
};
