import { Request, Response, NextFunction } from "express";
import { verifyToken } from "../modules/auth/internal/token.service";
import { authConfig } from "@/config/auth.config";
import { getAuthenticatedUser } from "@/modules/auth/auth.service";

export async function authenticate(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const token = req.cookies?.[authConfig.accessTokenCookie];

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const payload = verifyToken(token);

    req.user = await getAuthenticatedUser(payload.id);

    return next();
  } catch {
    return res.status(401).json({
      success: false,
      message: "Authentication failed",
    });
  }
};