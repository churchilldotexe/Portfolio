import { eq, sql } from "drizzle-orm";
import db from "../database";
import users, {
  insertUsersSchema,
  selectUsersSchema,
  type InsertUsersTypes,
  type SelectUsersTypes,
} from "../database/schema/users";
import { createIsoDateNow } from "./helpers";
import { ZodError } from "zod";

type GetUserByIdReturnType = Omit<SelectUsersTypes, "createdAt" | "updatedAt" | "authId" | "id">;

export async function getUserByIdFromDB(id: number): Promise<GetUserByIdReturnType | undefined> {
  const user = await db.query.users.findFirst({
    columns: {
      userId: true, //userId
      email: true,
      displayName: true,
      avatarUrl: true,
      refreshToken: true,
      refreshTokenVersion: true,
    },
    where: (users, { eq }) => eq(users.authId, id),
  });

  const parsedUser = selectUsersSchema
    .omit({ createdAt: true, updatedAt: true, authId: true, id: true })
    .safeParse(user);

  if (parsedUser.success === false) {
    return undefined;
  }
  return parsedUser.data;
}

export async function getTokenDetailsFromDb(
  userId: string
): Promise<{ refreshToken: string | null; refreshTokenVersion: number } | undefined> {
  const refreshtokenInfo = await db.query.users.findFirst({
    columns: { refreshToken: true, refreshTokenVersion: true },
    where: (users, { eq }) => eq(users.userId, userId),
  });

  return refreshtokenInfo;
}

type CreateUserType = Pick<InsertUsersTypes, "displayName" | "authId" | "avatarUrl" | "email">;

export async function createUserFromDb(userInfo: CreateUserType): Promise<GetUserByIdReturnType> {
  const parsedUser = insertUsersSchema
    .pick({ displayName: true, authId: true, avatarUrl: true, email: true })
    .safeParse(userInfo);
  if (parsedUser.success === false) {
    throw new ZodError(parsedUser.error.errors);
  }

  const { displayName, email, avatarUrl, authId } = parsedUser.data;

  const insertedUser = await db
    .insert(users)
    .values({
      displayName,
      authId,
      avatarUrl,
      email,
    })
    .returning({
      userId: users.userId,
      refreshToken: users.refreshToken,
      refreshTokenVersion: users.refreshTokenVersion,
      email: users.email,
      avatarUrl: users.avatarUrl,
    });

  const [newUser] = insertedUser;
  if (!newUser) {
    throw new Error("Unable to Insert user, please Try again");
  }

  return {
    userId: newUser.userId as string, //auto generated guarantee return if insertion succeed
    displayName,
    email: newUser.email,
    avatarUrl: newUser.avatarUrl,
    refreshTokenVersion: newUser.refreshTokenVersion,
    refreshToken: newUser.refreshToken,
  };
}

export async function updateRefreshTokenFromDb(
  refreshToken: string,
  userId: string
): Promise<void> {
  await db
    .update(users)
    .set({ refreshToken: refreshToken, updatedAt: createIsoDateNow() })
    .where(eq(users.userId, userId));
}

export async function updateLogoutUserFromDB(userId: string): Promise<void> {
  await db
    .update(users)
    .set({
      refreshToken: null,
      updatedAt: createIsoDateNow(),
      refreshTokenVersion: sql`${users.refreshTokenVersion} + 1`,
    })
    .where(eq(users.userId, userId));
}
