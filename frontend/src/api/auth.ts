import API from "./api.ts";
import { LoginRequest, LoginResponse, RegisterRequest, RegisterResponse } from "./type";

export const loginUser = async (payload: LoginRequest) => {
  const response = await API.post<{ token: string; userId: string }>("/public/login", payload);
  localStorage.setItem("jwt", response.data.token);
  localStorage.setItem("userId", response.data.userId);

  return response.data;
};


export const registerUser = async (payload: RegisterRequest): Promise<RegisterResponse> => {
  const response = await API.post<RegisterResponse>("/public/signup", payload);
  return response.data;
};
