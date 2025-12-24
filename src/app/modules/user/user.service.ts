import bcrypt from 'bcryptjs';
import httpStatus from "http-status-codes";
import { envVars } from '../../config/env';
import AppError from "../../errorHandler/AppError";
import { IAuthProvider, IUser } from "./user.interface";
import { User } from "./user.model";

const createUser = async (payload: Partial<IUser>) => {
    const { email, password, ...rest } = payload;
    const userExits = await User.findOne({ email });
    if (userExits) {
        throw new AppError(httpStatus.BAD_REQUEST, "User already exists");
    }
    const hashedPassword = await bcrypt.hash(password as string, Number(envVars.BCRYPT_SALT_ROUND));
    const authProvider: IAuthProvider = { provider: "credentials", providerId: email as string }

    const user = await User.create({
        email,
        password: hashedPassword,
        auths: [authProvider],
        ...rest
    })
    return user
}

const getAllUsers = async () => {
    const users = await User.find({});
    const totalUsers = await User.countDocuments();
    return { users, meta: { total: totalUsers } }
}

export const UserServices = {
    createUser,
    getAllUsers
}