import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status-codes";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { AuthServices } from "./auth.service";

const creadentialsLogin = catchAsync(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async (req: Request, res: Response, next: NextFunction) => {
    const loginInfo = await AuthServices.creadentialsLogin(req.body);
    res.cookie("refreshToken", loginInfo.refreshToken, {
      httpOnly: true,
      secure: false,
    });
    res.cookie("accessToken", loginInfo.accessToken, {
      httpOnly: true,
      secure: false,
    });
    sendResponse(res, {
      success: true,
      message: "User logged in successfully",
      data: loginInfo,
      statusCode: httpStatus.OK,
    });
  },
);
const getNewAccessToken = catchAsync(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
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

    sendResponse(res, {
      success: true,
      message: "Refresh token verified successfully and get new access token",
      data: tokenInfo,
      statusCode: httpStatus.OK,
    });
  },
);

export const AuthControllers = {
  creadentialsLogin,
  getNewAccessToken,
};
