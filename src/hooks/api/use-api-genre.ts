import { useApi } from '@/hooks/api/use-api';
import { Genre } from '@/types';

export const useApiGenre = () => {
  const { fetcher } = useApi();

  const getGenres = async () => {
    try {
      const url = `/genres`;
      const genres = await fetcher<Genre[]>(url);
      return genres;
    } catch (error) {
      throw new Error('ジャンル一覧の読み込みが失敗しました。' + error);
    }
  };

  return { getGenres };
};
