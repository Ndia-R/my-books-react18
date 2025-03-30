import { useApi } from '@/hooks/api/use-api';
import {
  ChangeEmail,
  ChangePassword,
  ProfileCounts,
  UpdateCurrentUser,
  User,
} from '@/types';

export const useApiUser = () => {
  const { fetcherWithAuth, mutationWithAuth } = useApi();

  const getCurrentUser = async () => {
    try {
      const url = `/me`;
      const user = await fetcherWithAuth<User>(url);
      return user;
    } catch (error) {
      throw new Error('ユーザー情報の読み込みが失敗しました。' + error);
    }
  };

  const getProfileCounts = async () => {
    try {
      const url = `/me/profile-counts`;
      const profieleCounts = await fetcherWithAuth<ProfileCounts>(url);
      return profieleCounts;
    } catch (error) {
      throw new Error(
        'ユーザーのプロフィール情報の読み込みが失敗しました。' + error
      );
    }
  };

  const updateCurrentUser = async (requestBody: UpdateCurrentUser) => {
    try {
      const url = `/me`;
      const options: RequestInit = {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody),
      };
      await mutationWithAuth(url, options);
    } catch (error) {
      throw new Error('ユーザー情報の更新に失敗しました。' + error);
    }
  };

  const changePassword = async (requestBody: ChangePassword) => {
    try {
      const url = `/me/password`;
      const options: RequestInit = {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody),
      };
      await mutationWithAuth(url, options);
    } catch (error) {
      throw new Error('パスワードの更新に失敗しました。' + error);
    }
  };

  const changeEmail = async (requestBody: ChangeEmail) => {
    try {
      const url = `/me/email`;
      const options: RequestInit = {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody),
      };
      await mutationWithAuth(url, options);
    } catch (error) {
      throw new Error('メールアドレスの更新に失敗しました。' + error);
    }
  };

  return {
    getCurrentUser,
    getProfileCounts,
    updateCurrentUser,
    changePassword,
    changeEmail,
  };
};
