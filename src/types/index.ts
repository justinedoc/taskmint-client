export type ApiResponse<T> = {
  message: string;
  success: boolean;
  data: T;
};

export type User = {
  id: string;
  fullname: string;
  email: string;
  password: string;
  role: "User" | "Admin" | "Guest" | "Superadmin";
  username: string | undefined;
  profileImg: string | undefined;
  twoFactorEnabled: boolean;
};

export interface Meta {
  total: number;
  nextPage: number | null;
  prevPage: number | null;
  page: number;
  limit: number;
  totalPages: number;
}
