import { NextFunction, Request, Response } from "express"
import httpStatus from "http-status-codes"
import { catchAsync } from "../../utils/catchAsync"
import { sendResponse } from "../../utils/sendResponse"
import { AuthServices } from "./auth.service"

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const creadentialsLogin = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

    const loginInfo = await AuthServices.creadentialsLogin(req.body)

    sendResponse(res, {
        success: true,
        message: "User logged in successfully",
        data: loginInfo,
        statusCode: httpStatus.OK
    })
})


export const AuthControllers = {
    creadentialsLogin
}