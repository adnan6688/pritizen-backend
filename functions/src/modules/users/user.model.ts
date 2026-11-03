import {Timestamp} from "firebase-admin/firestore";

export const USER_ROLES = ["customer", "admin"] as const;

export type UserRole = (typeof USER_ROLES)[number];

export const USER_STATUSES = [
  "active",
  "inactive",
] as const;

export type UserStatus = (typeof USER_STATUSES)[number];

export interface UserModel {
  uid: string;
  name: string;
  email: string;
  photoURL: string | null;
  role: UserRole;
  status: UserStatus;
  emailVerified: boolean;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
