/* eslint-disable @typescript-eslint/no-unused-vars */
import bcrypt from 'bcryptjs';
import httpStatus from "http-status-codes";
import { JwtPayload } from 'jsonwebtoken';
import { envVars } from '../../config/env';
import AppError from "../../errorHandler/AppError";
import { generateToken, verifiToken } from '../../utils/jwt';
import { createUserTokens } from '../../utils/userTokens';
import { IsActive, IUser } from "../user/user.interface";
import { User } from "../user/user.model";

const creadentialsLogin = async (payload: Partial<IUser>) => {
    const { email, password } = payload;
    const userExits = await User.findOne({ email })
    if (!userExits) {
        throw new AppError(httpStatus.NOT_FOUND, "User does not exist")
    }
    const isPasswordMatched = await bcrypt.compare(password as string, userExits.password as string)
    if (!isPasswordMatched) {
        throw new AppError(httpStatus.UNAUTHORIZED, "Please provide valid credentials")
    }
    // const jwtPayload = {
    //     _id: userExits._id,
    //     name: userExits.name,
    //     email: userExits.email,
    //     role: userExits.role,
    // }
    // const accessToken = generateToken(jwtPayload, envVars.JWT_SECRET, envVars.JWT_EXPIRES_IN);
    // const refreshToken = generateToken(jwtPayload, envVars.JWT_REFRESH_SECRET, envVars.JWT_REFRESH_EXPIRES_IN);
    const { password: pass, ...rest } = userExits.toObject();
    const userTokens = createUserTokens(userExits)

    return {
        accessToken: userTokens.accessToken,
        refreshToken: userTokens.refreshToken,
        user: rest
    };
}

const getNewAccessToken = async (refreshToken: string) => {
    const verifiedRefreshToken = verifiToken(refreshToken, envVars.JWT_REFRESH_SECRET) as JwtPayload

    const isUserExist = await User.findOne({ email: verifiedRefreshToken.email })
    if (!isUserExist) {
        throw new AppError(httpStatus.NOT_FOUND, "User does not exist")
    }
    if (isUserExist.isDeleted) {
        throw new AppError(httpStatus.BAD_REQUEST, "User account is deleted")
    }
    if (isUserExist.isActive === IsActive.BLOCKED || isUserExist.isActive === IsActive.INACTIVE) {
        throw new AppError(httpStatus.BAD_REQUEST, "User account is inactive")
    }
    const jwtPayload = {
        userId: isUserExist._id,
        name: isUserExist.name,
        email: isUserExist.email,
        role: isUserExist.role,

    }
    const accessToken = generateToken(jwtPayload, envVars.JWT_SECRET, envVars.JWT_EXPIRES_IN)
    return { accessToken };
}

export const AuthServices = {
    creadentialsLogin,
    getNewAccessToken
}