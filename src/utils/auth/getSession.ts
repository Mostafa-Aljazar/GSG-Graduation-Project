import { LOCALSTORAGE_SESSION_KEY } from "@/constants/session-key";
import { z } from "zod";
import { USER_RANK, USER_TYPE } from "@/constants/user-types";
import { IUser } from "@/types/auth/loginResponse.type";

// Validate user data including optional fields and complex types
const UserSchema = z.object({
  id: z.number(),
  name: z.string(),
  email: z.string().email(),
  identity: z.string(),
  phoneNumber: z.string(),
  createdAt: z.union([z.string(), z.date()]),
  updatedAt: z.union([z.string(), z.date()]).optional(),
  profileImage: z.union([z.string(), z.null()]).optional(),
  role: z.nativeEnum(USER_TYPE),
  rank: z.nativeEnum(USER_RANK).optional(),
});

// Session schema with user nested
const SessionSchema = z.object({
  token: z.string().min(1),
  user: UserSchema,
});


/**
 * Gets the user session from localStorage
 * 
 * Returns the session object containing:
 * - token: The authentication token
 * - user: The user information (id, name, email, etc)
 * 
 * Returns null if:
 * - No session found in localStorage
 * - Session data is invalid
 * - Any error occurs while parsing
 */

export const getSession = (): { token: string; user: IUser } | null => {
  try {
    const rawSession = localStorage.getItem(LOCALSTORAGE_SESSION_KEY);
    if (!rawSession) return null;

    // Parse the session data from localStorage
    const parsedSession = JSON.parse(rawSession);

    // Validate parsed data
    const session = SessionSchema.safeParse(parsedSession);
    if (!session.success) return null;

    // Convert date strings to Date objects
    const user = {
      ...session.data.user,
      createdAt: new Date(session.data.user.createdAt),
      updatedAt: session.data.user.updatedAt ? new Date(session.data.user.updatedAt) : undefined,
    };

    // Transform the validated data to match the expected return type
    return {
      token: session.data.token,
      user,
    };
  } catch {
    return null;
  }
};
