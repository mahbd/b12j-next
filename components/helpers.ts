import { Language } from "@prisma/client";

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
