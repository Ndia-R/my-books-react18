import { FETCH_FAVORITES_MAX_RESULTS } from '@/constants/constants';
import { useApi } from '@/hooks/api/use-api';
import { Favorite, FavoriteInfo, FavoritePage, FavoriteRequest } from '@/types';

export const useApiFavorite = () => {
  const { fetcher, fetcherWithAuth, mutationWithAuth } = useApi();

  const getFavoriteByBookId = async (bookId: string) => {
    try {
      const url = `/favorites/${bookId}`;
      const favorite = await fetcherWithAuth<Favorite>(url);
      return favorite;
    } catch (error) {
      throw new Error('お気に入りの読み込みが失敗しました。' + error);
    }
  };

  const getFavoritePage = async (page: number = 0) => {
    try {
      const basePage = page > 0 ? page - 1 : 0;
      const url = `/favorites?&page=${basePage}&maxResults=${FETCH_FAVORITES_MAX_RESULTS}`;
      const favoritePage = await fetcherWithAuth<FavoritePage>(url);
      return favoritePage;
    } catch (error) {
      throw new Error('お気に入り一覧の読み込みが失敗しました。' + error);
    }
  };

  const getFavoriteInfo = async (
    bookId: string,
    userId: number | undefined
  ) => {
    try {
      const query = userId ? `?userId=${userId}` : '';
      const url = `/books/${bookId}/favorites/info${query}`;
      const favoriteInfo = await fetcher<FavoriteInfo>(url);
      return favoriteInfo;
    } catch (error) {
      throw new Error('お気に入り情報の読み込みが失敗しました。' + error);
    }
  };

  const createFavorite = async (requestBody: FavoriteRequest) => {
    try {
      const url = `/favorites`;
      const options: RequestInit = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody),
      };
      await mutationWithAuth(url, options);
    } catch (error) {
      throw new Error('お気に入りの作成に失敗しました。' + error);
    }
  };

  const deleteFavorite = async (bookId: string) => {
    try {
      const url = `/favorites/${bookId}`;
      const options: RequestInit = { method: 'DELETE' };
      await mutationWithAuth(url, options);
    } catch (error) {
      throw new Error('お気に入りの削除に失敗しました。' + error);
    }
  };

  return {
    getFavoriteByBookId,
    getFavoritePage,
    getFavoriteInfo,
    createFavorite,
    deleteFavorite,
  };
};
