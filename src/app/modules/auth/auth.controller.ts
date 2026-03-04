/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status-codes";
import { JwtPayload } from "jsonwebtoken";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { setAuthCookie } from "../../utils/setCookie";
import { AuthServices } from "./auth.service";

const creadentialsLogin = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const loginInfo = await AuthServices.creadentialsLogin(req.body);

    setAuthCookie(res, loginInfo);

    sendResponse(res, {
      success: true,
      message: "User logged in successfully",
      data: loginInfo,
      statusCode: httpStatus.OK,
    });
  },
);
const getNewAccessToken = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
      sendResponse(res, {
        success: false,
        message: "Refresh token is required",
        data: null,
        statusCode: httpStatus.BAD_REQUEST,
      });
    }

    const tokenInfo = await AuthServices.getNewAccessToken(refreshToken);
    setAuthCookie(res, tokenInfo);

    sendResponse(res, {
      success: true,
      message: "Refresh token verified successfully and get new access token",
      data: tokenInfo,
      statusCode: httpStatus.OK,
    });
  },
);
const logout = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    res.clearCookie("accessToken", {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
    });
    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
    });
    sendResponse(res, {
      success: true,
      message: "User logged out successfully",
      data: null,
      statusCode: httpStatus.OK,
    });
  },
);

const resetPassword = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const decodedToken = req.user;
    // console.log("decodedToken =>", decodedToken);
    await AuthServices.resetPassword(req.body, decodedToken as JwtPayload);
    sendResponse(res, {
      success: true,
      message: "Password reset successfully",
      data: null,
      statusCode: httpStatus.OK,
    });
  },
);

export const AuthControllers = {
  creadentialsLogin,
  getNewAccessToken,
  logout,
  resetPassword,
};
