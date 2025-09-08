import API from "./api.ts";
import { User } from "./type.ts";

export const getAllUsers = async (): Promise<User[]> => {
  const response = await API.get(`/user/all`);
  return response.data;
};