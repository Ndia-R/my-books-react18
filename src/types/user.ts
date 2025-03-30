export interface User {
  id: number;
  email: string;
  roles: string[];
  name: string;
  avatarPath: string;
}

export interface ProfileCounts {
  favoriteCount: number;
  bookmarkCount: number;
  reviewCount: number;
}

export interface UpdateCurrentUser {
  name: string;
  avatarPath: string;
}

export interface ChangePassword {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface ChangeEmail {
  email: string;
  password: string;
}
