import { BOOKS_API_ENDPOINT } from '@/constants/constants';
import {
  AccessToken,
  ErrorResponse,
  LoginRequest,
  SignupRequest,
  User,
} from '@/types';
import { createContext, useContext, useEffect, useState } from 'react';

type AuthProviderProps = {
  children: React.ReactNode;
};

type AuthProviderState = {
  accessToken: string | null;
  isLoading: boolean;
  user: User | null;
  setUser: (user: User | null) => void;
  login: (requestBody: LoginRequest) => Promise<void>;
  signup: (requestBody: SignupRequest) => Promise<void>;
  logout: () => Promise<void>;
  refreshAccessToken: () => Promise<string | null>;
};

const AuthProviderContext = createContext<AuthProviderState | undefined>(
  undefined
);

export function AuthProvider({ children }: AuthProviderProps) {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const login = async (requestBody: LoginRequest) => {
    try {
      const url = `${BOOKS_API_ENDPOINT}/login`;
      const options: RequestInit = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody),
        credentials: 'include',
      };

      const response = await fetch(url, options);
      if (!response.ok) {
        const data = (await response.json()) as ErrorResponse;
        throw new Error(
          `[STATUS] ${response.status} [MESSAGE] ${data.message} [URL] ${url}`
        );
      }

      const data = (await response.json()) as AccessToken;
      setAccessToken(data.accessToken);
    } catch (error) {
      setAccessToken(null);
      setUser(null);
      throw new Error('ログインできませんでした。' + error);
    }
  };

  const signup = async (requestBody: SignupRequest) => {
    try {
      const url = `${BOOKS_API_ENDPOINT}/signup`;
      const options: RequestInit = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody),
        credentials: 'include',
      };

      const response = await fetch(url, options);
      if (!response.ok) {
        const data = (await response.json()) as ErrorResponse;
        throw new Error(
          `[STATUS] ${response.status} [MESSAGE] ${data.message} [URL] ${url}`
        );
      }

      const data = (await response.json()) as AccessToken;
      setAccessToken(data.accessToken);
    } catch (error) {
      setAccessToken(null);
      setUser(null);
      throw new Error('サインアップできませんでした。' + error);
    }
  };

  const logout = async () => {
    try {
      const url = `${BOOKS_API_ENDPOINT}/logout`;
      const options: RequestInit = {
        method: 'POST',
        credentials: 'include',
      };

      const response = await fetch(url, options);
      if (!response.ok) {
        const data = (await response.json()) as ErrorResponse;
        throw new Error(
          `[STATUS] ${response.status} [MESSAGE] ${data.message} [URL] ${url}`
        );
      }

      setAccessToken(null);
      setUser(null);
    } catch (error) {
      setAccessToken(null);
      setUser(null);
      throw new Error('ログアウトに失敗しました。' + error);
    }
  };

  const refreshAccessToken = async () => {
    const accessToken = await fetchAccessToken();
    setAccessToken(accessToken);
    if (!accessToken) {
      alert('セッションが切れたため、自動ログアウトしました。');
      setUser(null);
    }
    return accessToken;
  };

  const fetchAccessToken = async () => {
    try {
      const url = `${BOOKS_API_ENDPOINT}/refresh-token`;
      const options: RequestInit = {
        method: 'POST',
        credentials: 'include',
      };

      const response = await fetch(url, options);
      if (!response.ok) {
        throw new Error('Failed to refresh token');
      }

      const data = (await response.json()) as AccessToken;
      return data.accessToken;
    } catch {
      return null;
    }
  };

  useEffect(() => {
    // リロードするとメモリからアクセストークンが消えてしまうので
    // 初期読み込み時にリフレッシュトークンを使って再取得する
    const init = async () => {
      const accessToken = await fetchAccessToken();
      setAccessToken(accessToken);
      setIsLoading(false);
    };
    init();
  }, []);

  const value = {
    accessToken,
    isLoading,
    user,
    setUser,
    login,
    signup,
    logout,
    refreshAccessToken,
  };

  return (
    <AuthProviderContext.Provider value={value}>
      {children}
    </AuthProviderContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthProviderContext);

  if (context === undefined)
    throw new Error('useAuth must be used within an AuthProvider');

  return context;
};
