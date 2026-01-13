export interface User {
  _id: string;
  email: string;
  firstName: string;
  lastName: string;
}

export interface MeResponse {
  user: User | null;
}

export interface AuthResponse {
  user: User;
}

export interface RegisterDto {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}





