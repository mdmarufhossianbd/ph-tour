/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import bcrypt from "bcryptjs";
import httpStatus from "http-status-codes";
import { JwtPayload } from "jsonwebtoken";
import { envVars } from "../../config/env";
import AppError from "../../errorHandler/AppError";
import {
  createNewAccessTokenWithRefreshToken,
  createUserTokens,
} from "../../utils/userTokens";
import { IUser } from "../user/user.interface";
import { User } from "../user/user.model";

const creadentialsLogin = async (payload: Partial<IUser>) => {
  const { email, password } = payload;
  const userExits = await User.findOne({ email });
  if (!userExits) {
    throw new AppError(httpStatus.NOT_FOUND, "User does not exist");
  }
  const isPasswordMatched = await bcrypt.compare(
    password as string,
    userExits.password as string,
  );
  if (!isPasswordMatched) {
    throw new AppError(
      httpStatus.UNAUTHORIZED,
      "Please provide valid credentials",
    );
  }
  const userToken = createUserTokens(userExits);
  const { password: pass, ...rest } = userExits.toObject();

  return {
    user: rest,
    accessToken: userToken.accessToken,
    refreshToken: userToken.refreshToken,
  };
};

const getNewAccessToken = async (refreshToken: string) => {
  const accessToken = await createNewAccessTokenWithRefreshToken(refreshToken);
  return accessToken;
};

const resetPassword = async (
  payload: Record<string, any>,
  decodedToken: JwtPayload,
) => {
  if (payload.id !== decodedToken.userId) {
    throw new AppError(
      httpStatus.FORBIDDEN,
      "You are not authorized to reset password",
    );
  }
  const isUser = await User.findById(decodedToken.userId);
  if (!isUser) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found");
  }
  const isOldPasswordMatched = await bcrypt.compare(
    payload.oldPassword,
    isUser.password as string,
  );
  if (!isOldPasswordMatched) {
    throw new AppError(httpStatus.UNAUTHORIZED, "Old password is incorrect");
  }
  const hashedPassword = await bcrypt.hash(
    payload.newPassword,
    Number(envVars.BCRYPT_SALT_ROUND),
  );
  isUser.password = hashedPassword;
  await isUser.save();
};

export const AuthServices = {
  creadentialsLogin,
  getNewAccessToken,
  resetPassword,
};
