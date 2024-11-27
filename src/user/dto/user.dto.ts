export interface UserRegisterRequest {
  id: string;
  name: string;
  username: string;
  password: string;
}

export interface UserLoginRequest {
  username: string;
  password: string;
}

export interface UserLoginResponse {
  access_token: string;
}
