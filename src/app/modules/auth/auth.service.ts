

import bcrypt from 'bcryptjs';
import httpStatus from "http-status-codes";
import jwt from "jsonwebtoken";
import AppError from "../../errorHandler/AppError";
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
    const accessToken = jwt.sign(jwtPayload, "secretKey", {
        expiresIn: '1d'
    })
    const userData = {
        _id: userExits._id,
        name: userExits.name,
        email: userExits.email,
        role: userExits.role,
        isDeleted: userExits.isDeleted,
        isActive: userExits.isActive,
        isVerified: userExits.isVerified,
        auths: userExits.auths,
        accessToken
    };

    return userData;
}


export const AuthServices = {
    creadentialsLogin
}