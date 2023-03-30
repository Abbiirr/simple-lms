import { v4 as uuid } from "uuid";

export const getUserId = () => {
  let userId = localStorage.getItem("userId");
  if (!userId) {
    userId = uuid();
    localStorage.setItem("userId", userId);
  }
  return userId;
};
