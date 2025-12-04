import { Request, Response } from "express";
import bcrypt from "bcrypt";
import { SignJWT } from "jose";
import User from "../../models/User";

const JWT_SECRET: string = process.env.JWT_SECRET || "supersecretkey";
const JWT_EXPIRES: string = process.env.JWT_EXPIRES || "7d";

export const registerHandler = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { fullname, username, email, password } = req.body;

    if (!fullname || !username || !email || !password) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required." });
    }

    const usernameExists = await User.findOne({ username }).lean();
    if (usernameExists) {
      return res
        .status(409)
        .json({ success: false, message: "Username is already taken." });
    }

    const emailExists = await User.findOne({ email }).lean();
    if (emailExists) {
      return res
        .status(409)
        .json({ success: false, message: "Email is already registered." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      fullname,
      username,
      email,
      password: hashedPassword,
    });

    const token = await new SignJWT({ id: user._id })
      .setProtectedHeader({ alg: "HS256" })
      .setExpirationTime("7d")
      .sign(new TextEncoder().encode(JWT_SECRET));
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 7 * 24 * 60 * 60 * 1000,
      sameSite: "strict",
    });

    return res.status(201).json({
      success: true,
      message: "Account created successfully and logged in.",
      user: {
        id: user._id,
        fullname: user.fullname,
        username: user.username,
        email: user.email,
      },
    });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Internal server error." });
  }
};
