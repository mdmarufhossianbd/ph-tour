/* eslint-disable @typescript-eslint/no-unused-vars */
import bcrypt from "bcryptjs";
import httpStatus from "http-status-codes";
import { JwtPayload } from "jsonwebtoken";
import { envVars } from "../../config/env";
import AppError from "../../errorHandler/AppError";
import { verifyToken } from "../../utils/jwt";
import { createUserTokens } from "../../utils/userTokens";
import { IsActive, IUser } from "../user/user.interface";
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
  const verifiedRefreshToken = verifyToken(
    refreshToken,
    envVars.JWT_SECRET_REFRESH as string,
  ) as JwtPayload;

  const userExits = await User.findOne({ email: verifiedRefreshToken.email });

  if (!userExits) {
    throw new AppError(httpStatus.NOT_FOUND, "User does not exist");
  }
  if (
    userExits.isActive === IsActive.BLOCKED ||
    userExits.isActive === IsActive.INACTIVE
  ) {
    throw new AppError(httpStatus.UNAUTHORIZED, "User is blocked or inactive");
  }
  if (userExits.isDeleted) {
    throw new AppError(httpStatus.UNAUTHORIZED, "User is deleted");
  }
  const userToken = createUserTokens(userExits);

  return {
    accessToken: userToken.accessToken,
  };
};

export const AuthServices = {
  creadentialsLogin,
  getNewAccessToken,
};
