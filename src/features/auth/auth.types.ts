export type UserRole = "ADMIN" | "AGENT" | "OWNER" | "BUYER";

export interface User {
  id: number;
  email?: string;
  full_name?: string;
  role: UserRole;
  phone?: string | null;
  profile_image?: string | null;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterPayload {
  full_name: string;
  email: string;
  password: string;
  role: UserRole;
}

export interface AuthToken {
  access_token: string;
  token_type: string;
}
