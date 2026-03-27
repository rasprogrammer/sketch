import { HTTP_URL } from "@/config";
import axios from "axios";


export interface AuthError {
  response?: {
    data?: {
      message?: string;
    };
  };
  message?: string;
}

export const signinUser = async (userData: {
  email: string;
  password: string;
}) => {
  try {
    const response = await axios.post(`${HTTP_URL}/auth/signin`, userData);

    await new Promise(resolve => setTimeout(resolve, 2000));
    return response.data;
  } catch (error) {
    const err = error as AuthError;
    if (axios.isAxiosError(err)) {
      if (err.response) {
        throw new Error('Sign-in failed. Please check your credentials.');
      } else {
        throw new Error('Network error. Please check your connection.');
      }
    }
  }
};