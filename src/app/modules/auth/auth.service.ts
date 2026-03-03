/* eslint-disable @typescript-eslint/no-unused-vars */
import bcrypt from "bcryptjs";
import httpStatus from "http-status-codes";
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

export const AuthServices = {
  creadentialsLogin,
  getNewAccessToken,
};
