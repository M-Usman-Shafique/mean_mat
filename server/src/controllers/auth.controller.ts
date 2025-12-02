import jwt from "jsonwebtoken";
import { ACCESS_TOKEN_SECRET, REFRESH_TOKEN_SECRET } from "../configs/config";
import { User } from "../models/User.model";
import { ROLES, cookieOptions } from "../configs/constants";
import { generateTokens } from "../utils/generateTokens";
import { unlinkHandler } from "../utils/unlinkHandler";
import { uploadHandler } from "../utils/uploadHandler";
import { ApiResponse } from "../utils/ApiResponse";
import { ApiError } from "../utils/ApiError";
import { respondWithAuth } from "../utils/respondWithAuth";
import type { NextFunction, Request, Response } from "express";

export const signupUser = async (req: Request, res: Response, next: NextFunction) => {
    const filePath = req.file?.path;
    try {
        const { username, email, password, role } = req.body;

        if ([username, email, password].some((field) => !field?.trim())) {
            throw new ApiError(400, "Username, email, and password are required.");
        }

        if (role && !ROLES.includes(role?.trim())) {
            throw new ApiError(400, "Invalid role assignment.");
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            throw new ApiError(409, "User with this email already exists.");
        }

        let avatarUrl = null;
        if (filePath) {
            avatarUrl = await uploadHandler(filePath);
        }

        const newUser = await User.create({
            username,
            email,
            password,
            role,
            avatar: avatarUrl,
        });

        if (!newUser) throw new ApiError(500, "Failed to create user.");

        await respondWithAuth(res, newUser._id, "User registered and logged in successfully.");
    } catch (error) {
        if (filePath) await unlinkHandler(filePath);
        return next(error);
    }
};

export const loginUser = async (req: Request, res: Response) => {
    const { email, password } = req.body;

    if (!email) {
        throw new ApiError(400, "Email is required");
    }

    const user = await User.findOne({ email });

    if (!user) {
        throw new ApiError(404, "User does not exist");
    }

    const isPasswordValid = await user.isPasswordValid(password);

    if (!isPasswordValid) {
        throw new ApiError(401, "Invalid user credentials");
    }

    await respondWithAuth(res, user._id.toString(), "User logged in successfully");
};

export const logoutUser = async (req: Request, res: Response) => {
    const userId = req.user?._id;

    if (!userId) {
        throw new ApiError(401, "Unauthorized request");
    }

    await User.findByIdAndUpdate(userId, { $unset: { refreshToken: 1 } }, { new: true });

    res.status(200)
        .clearCookie("accessToken", cookieOptions)
        .clearCookie("refreshToken", cookieOptions)
        .json(new ApiResponse(200, {}, "User logged out"));
};

export const validateAuth = async (req: Request, res: Response) => {
    const accessToken = req.cookies?.accessToken || req.body?.accessToken;
    if (!accessToken) throw new ApiError(401, "Access token missing");

    try {
        const decoded = jwt.verify(accessToken, ACCESS_TOKEN_SECRET) as { _id: string };
        const user = await User.findById(decoded._id);

        if (!user) throw new ApiError(401, "User not found or deleted");

        res.status(200).json(new ApiResponse(200, {}, "Session is valid"));
    } catch (err) {
        console.error(err);
        throw new ApiError(401, "Session is invalid or expired");
    }
};

export const refreshAuth = async (req: Request, res: Response) => {
    const incomingRefreshToken = req.cookies?.refreshToken || req.body?.refreshToken;

    if (!incomingRefreshToken) {
        throw new ApiError(401, "Unauthorized request");
    }

    const decodedRefreshToken = jwt.verify(incomingRefreshToken, REFRESH_TOKEN_SECRET) as {
        _id: string;
    };

    const user = await User.findById(decodedRefreshToken._id);

    if (!user || incomingRefreshToken !== user.refreshToken) {
        throw new ApiError(401, "Refresh token is invalid or expired");
    }

    const { accessToken, refreshToken: newRefreshToken } = await generateTokens(user._id);

    res.status(200)
        .cookie("accessToken", accessToken, cookieOptions)
        .cookie("refreshToken", newRefreshToken, cookieOptions)
        .json(
            new ApiResponse(
                200,
                { accessToken, refreshToken: newRefreshToken },
                "Access token refreshed"
            )
        );
};
