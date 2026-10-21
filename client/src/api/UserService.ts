import axiosInstance from "./axiosInstance";
import type { LoginRequest, LoginResponse, RegisterRequest } from "./models/user";
import API_PATHS from "./paths";

export class UserService {
  async createUser(registerRequest: RegisterRequest): Promise<void> {
    await axiosInstance.post(API_PATHS.REGISTER, registerRequest);
  }

  async login(loginRequest: LoginRequest): Promise<LoginResponse> {
    const response = await axiosInstance.post(API_PATHS.LOGIN, loginRequest);
    const success = response.data;
    return success.data;
  }

  async me(): Promise<LoginResponse> {
    const response = await axiosInstance.get(API_PATHS.ME);
    const success = response.data;
    return success.data;
  }

  async logout(): Promise<void> {
    await axiosInstance.get(API_PATHS.LOGOUT);
  }
}

const userService = new UserService();
export default userService;
