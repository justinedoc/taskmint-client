import { API } from "@/api/axios";
import type { ApiResponse, User } from "@/types";

export async function getCurrentUser(): Promise<ApiResponse<User>> {
  const res = await API.get("/user/current");
  return res.data;
}
