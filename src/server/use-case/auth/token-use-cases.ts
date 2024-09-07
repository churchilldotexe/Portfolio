import { COOKIES_PROPERTIES, type COOKIES_PROPERTIES_TYPES } from "@/lib/constants";
import type { AstroCookies } from "astro";
import { SignJWT, jwtVerify, decodeJwt } from "jose";

const ACCESS_TOKEN_SECRET = new TextEncoder().encode(import.meta.env.ACCESS_TOKEN_SECRET);
const REFRESH_TOKEN_SECRET = new TextEncoder().encode(import.meta.env.REFRESH_TOKEN_SECRET);

export async function signAccessToken<T extends Record<string, unknown>>(
  signingPayload: T
): Promise<string> {
  const signedJWT = await new SignJWT(signingPayload)
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime("15 mins")
    .sign(ACCESS_TOKEN_SECRET);

  return signedJWT;
}

export async function verifyAccessToken<T extends Record<string, unknown>>(
  token: T[keyof T] | undefined
): Promise<T | undefined> {
  try {
    const verified = await jwtVerify(token as string, ACCESS_TOKEN_SECRET);
    return verified.payload as T;
  } catch (error) {
    return;
  }
}

export type RefreshTokenTypes = { userId: string; version: number };

export async function signRefreshToken({ version, userId }: RefreshTokenTypes): Promise<string> {
  const signedRefreshJWT = await new SignJWT({ userId, version })
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime("30 days")
    .sign(REFRESH_TOKEN_SECRET);

  return signedRefreshJWT;
}

export async function verifyRefreshToken(token: string): Promise<RefreshTokenTypes | undefined> {
  try {
    const verifiedRefreshToken = await jwtVerify(token, REFRESH_TOKEN_SECRET);
    return verifiedRefreshToken.payload as RefreshTokenTypes;
  } catch (e) {
    return undefined;
  }
}

export async function decodeToken<T extends Record<string, unknown>>(
  token: string
): Promise<T | undefined> {
  try {
    return decodeJwt(token) as T;
  } catch (e) {
    return;
  }
}

export async function getUserId(cookies: AstroCookies) {
  const userInfo = cookies.get(COOKIES_PROPERTIES.ACCESSTOKEN)?.value as COOKIES_PROPERTIES_TYPES;
  if (!userInfo) {
    return undefined;
  }
  return userInfo;
}

// TODO: setup JWT write, verify and other stuff.
// for Refresh token dont forget to add the refresh token versioning.. refer again in the vid for more info.
