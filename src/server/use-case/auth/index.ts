import {
  createUserFromDb,
  getTokenDetailsFromDb,
  getUserByIdFromDB,
  updateRefreshTokenFromDb,
} from "@/server/data-access/users";
import {
  decodeToken,
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
} from "./token-use-cases";
import { ZodError } from "zod";

type ValidateUserType = {
  email?: string | null;
  avatarUrl?: string;
  authId: number;
  displayName: string;
};
type UserInfo = NonNullable<Awaited<ReturnType<typeof getUserByIdFromDB>>>;

type AccessTokenTypes = { userId: string };

export async function validateUserUseCase({
  displayName,
  authId,
  avatarUrl,
  email,
}: ValidateUserType) {
  try {
    let userInfo: UserInfo;

    const existingUser = await getUserByIdFromDB(authId);
    if (!existingUser) {
      // not in db create the user
      userInfo = await createUserFromDb({ email, avatarUrl, authId, displayName });
    } else {
      userInfo = existingUser;
    }
    // if exist create Refreshtoken  and access token
    const signedRefreshToken = await signRefreshToken({
      userId: userInfo.userId,
      version: userInfo.refreshTokenVersion,
    });

    // refreshtoken to db // this should add the token version here
    await updateRefreshTokenFromDb(signedRefreshToken, userInfo.userId);

    const signedAccessTokenJWT = await signAccessToken<AccessTokenTypes>({
      userId: userInfo.userId,
    });

    return signedAccessTokenJWT;
  } catch (e) {
    if (e instanceof Error) {
      throw new Error(`${e.name}: ${e.message}. ${e.cause}`);
    }
    if (e instanceof ZodError) {
      throw new Error(`Validation Error: ${e.errors.map((err) => err.message).join(",")}`);
    }
  }
  return;
}

export async function refreshAccessToken(token: string) {
  const decodedtoken = await decodeToken<AccessTokenTypes>(token);
  if (!decodedtoken) {
    // means no access token in db.. redirect/continue auth process
    return;
  }
  const tokenfromDb = await getTokenDetailsFromDb(decodedtoken.userId);

  if (tokenfromDb === undefined || !tokenfromDb.refreshToken) {
    // means not a registered user/not logged in . redirect to login/resume the auth process
    return;
  }

  const jwtRefreshTokeninfo = await verifyRefreshToken(tokenfromDb.refreshToken);

  if (jwtRefreshTokeninfo?.version !== tokenfromDb.refreshTokenVersion) {
    // possible user in another device/ not the current user. redirect to login/reumse the auth process
    return;
  }

  // means just an invalid accesstoken. Update refresh token and create new access token
  const signedRefreshToken = await signRefreshToken({
    userId: decodedtoken.userId,
    version: tokenfromDb.refreshTokenVersion,
  });

  await updateRefreshTokenFromDb(signedRefreshToken, decodedtoken.userId);

  const signedAccessTokenJWT = await signAccessToken<AccessTokenTypes>({
    userId: decodedtoken.userId,
  });

  return signedAccessTokenJWT;
}
