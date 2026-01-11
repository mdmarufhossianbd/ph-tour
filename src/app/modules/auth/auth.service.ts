/* eslint-disable @typescript-eslint/no-unused-vars */
import bcrypt from 'bcryptjs';
import httpStatus from "http-status-codes";
import { envVars } from '../../config/env';
import AppError from "../../errorHandler/AppError";
import { generateToken } from '../../utils/jwt';
import { IUser } from "../user/user.interface";
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
    const jwtPayload = {
        _id: userExits._id,
        name: userExits.name,
        email: userExits.email,
        role: userExits.role,
    }
    const accessToken = generateToken(jwtPayload, envVars.JWT_SECRET, envVars.JWT_EXPIRES_IN);
    const refreshToken = generateToken(jwtPayload, envVars.JWT_REFRESH_SECRET, envVars.JWT_REFRESH_EXPIRES_IN);
    const { password: pass, ...user } = userExits.toObject();

    return { accessToken, user };
}


export const AuthServices = {
    creadentialsLogin
}