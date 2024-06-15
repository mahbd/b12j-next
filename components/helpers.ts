import { auth } from "@/auth";
import prisma from "@/prisma/client";
import { Language, Role, User, Verdict } from "@prisma/client";
import { redirect } from "next/navigation";

export const readableDateTime = (dateString: string) => {
  const date = new Date(dateString);
  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const year = date.getFullYear();
  const month = monthNames[date.getMonth()];
  const day =
    date.getDate() < 10
      ? "0" + date.getDate().toString()
      : date.getDate().toString();
  const hours =
    date.getHours() < 10
      ? "0" + date.getHours().toString()
      : date.getHours().toString();
  const minutes =
    date.getMinutes() < 10
      ? "0" + date.getMinutes().toString()
      : date.getMinutes().toString();
  const amOrPm = parseInt(hours) >= 12 ? "PM" : "AM";
  const formattedHours = parseInt(hours) % 12 || 12;
  const formattedDateTime = `${month} ${day}, ${year} ${formattedHours}:${minutes} ${amOrPm}`;
  return formattedDateTime;
};

export const LANGUAGE_MAP = {
  [Language.C_CPP]: 54,
  [Language.JAVASCRIPT]: 63,
  [Language.PYTHON3]: 71,
};

export const JUDGE0ERROR_MAP = {
  1: Verdict.PENDING,
  2: Verdict.PENDING,
  3: Verdict.ACCEPTED,
  4: Verdict.WRONG_ANSWER,
  5: Verdict.TIME_LIMIT_EXCEEDED,
  6: Verdict.COMPILATION_ERROR,
  7: Verdict.RUNTIME_ERROR,
  8: Verdict.RUNTIME_ERROR,
  9: Verdict.RUNTIME_ERROR,
  10: Verdict.RUNTIME_ERROR,
  11: Verdict.RUNTIME_ERROR,
  12: Verdict.RUNTIME_ERROR,
  13: Verdict.RUNTIME_ERROR,
  14: Verdict.RUNTIME_ERROR,
  15: Verdict.RUNTIME_ERROR,
};

export const isLogged = async (callbackUrl: string) => {
  const session = await auth();
  const user = session && session.user;
  if (!user) {
    redirect(callbackUrl);
  }
  const prismaUser = await prisma.user.findUnique({
    where: {
      email: user.email!,
    },
  });
  if (!prismaUser) {
    redirect(callbackUrl);
  }
  return prismaUser;
};

export const permissionOwner = (
  user: User | undefined | null,
  content: { userId: string }
): boolean => {
  if (!user) return false;
  if (user.role === Role.ADMIN) return true;
  return user.id === content.userId;
};

export const permissionOwnerStaff = (
  user: User | undefined | null,
  content: { userId: string }
): boolean => {
  if (!user) return false;
  if (user.role === Role.ADMIN || user.role === Role.STAFF) return true;
  return user.id === content.userId;
};

export const permissionStaff = (user: User | undefined | null): boolean => {
  if (!user) return false;
  return user.role === Role.ADMIN || user.role === Role.STAFF;
};

export const permissionAdmin = (user: User | undefined | null): boolean => {
  if (!user) return false;
  return user.role === Role.ADMIN;
};

export const permissionUser = (user: User | undefined | null): boolean => {
  if (!user) return false;
  return true;
};

export const permissionPublic = (user: User | undefined | null): boolean => {
  return true;
};
