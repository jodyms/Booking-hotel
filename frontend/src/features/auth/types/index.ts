export interface User {
  sub: string;
  username: string;
  email: string;
  name: string;
}

export interface LoginProps {
  onLogin: (user: User) => void;
}

export interface LoginFormData {
  email: string;
  password: string;
  rememberMe: boolean;
}

export interface RegisterFormData {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  password: string;
  confirmPassword: string;
  acceptTerms: boolean;
}