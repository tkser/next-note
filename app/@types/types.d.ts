type UserRole = 'admin' | 'user';

type User = {
  username: string;
  user_id: string;
  role: UserRole;
}

type JWTPayload = User;

type ApiResponse<T> = {
  data?: T;
  meta: {
    status: number;
    message: string;
  }
}

type ApiDataUserResponse = {
  type: "user";
  user: User;
}

type InitializeApiRequest = {
  username: string;
  password: string;
}

type UserDatabaseRow = {
  user_id: string;
  username: string;
  role: UserRole;
  password_hash: string;
  password_salt: string;
  is_deleted: boolean;
  created_at: Date;
  updated_at: Date;
}