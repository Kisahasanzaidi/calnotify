import API from "./api.ts";
import { LoginRequest, LoginResponse, RegisterRequest, RegisterResponse } from "./type";

export const loginUser = async (payload: LoginRequest): Promise<LoginResponse> => {
  const response = await API.post<LoginResponse>("/public/login", payload);
  return response.data;
};

export const registerUser = async (payload: RegisterRequest): Promise<RegisterResponse> => {
  const response = await API.post<RegisterResponse>("/public/signup", payload);
  return response.data;
};
