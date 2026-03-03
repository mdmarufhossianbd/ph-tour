import httpStatus from "http-status-codes";
import { JwtPayload } from "jsonwebtoken";
import { envVars } from "../config/env";
import AppError from "../errorHandler/AppError";
import { IsActive, IUser } from "../modules/user/user.interface";
import { User } from "../modules/user/user.model";
import { generateToken, verifyToken } from "./jwt";

export const createUserTokens = (user: Partial<IUser>) => {
  const jwtPayload = {
    userId: user._id,
    email: user.email,
    role: user.role,
  };
  const accessToken = generateToken(
    jwtPayload,
    envVars.JWT_SECRET,
    envVars.JWT_EXPIRES_IN,
  );

  const refreshToken = generateToken(
    jwtPayload,
    envVars.JWT_SECRET_REFRESH,
    envVars.JWT_EXPIRES_IN_REFRESH,
  );

  return {
    accessToken,
    refreshToken,
  };
};

export const createNewAccessTokenWithRefreshToken = async (
  refreshToken: string,
) => {
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
