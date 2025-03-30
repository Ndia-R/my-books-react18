import { FETCH_BOOKMARKS_MAX_RESULTS } from '@/constants/constants';
import { useApi } from '@/hooks/api/use-api';
import { Bookmark, BookmarkPage, BookmarkRequest } from '@/types';

export const useApiBookmark = () => {
  const { fetcherWithAuth, mutationWithAuth } = useApi();

  const getBookmarkByBookId = async (bookId: string) => {
    try {
      const url = `/bookmarks/${bookId}`;
      const bookmarks = await fetcherWithAuth<Bookmark[]>(url);
      return bookmarks;
    } catch (error) {
      throw new Error('ブックマークの読み込みが失敗しました。' + error);
    }
  };

  const getBookmarkPage = async (page: number = 0) => {
    try {
      const basePage = page > 0 ? page - 1 : 0;
      const url = `/bookmarks?&page=${basePage}&maxResults=${FETCH_BOOKMARKS_MAX_RESULTS}`;
      const bookmarkPage = await fetcherWithAuth<BookmarkPage>(url);
      return bookmarkPage;
    } catch (error) {
      throw new Error('ブックマーク一覧の読み込みが失敗しました。' + error);
    }
  };

  const createBookmark = async (requestBody: BookmarkRequest) => {
    try {
      const url = `/bookmarks`;
      const options: RequestInit = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody),
      };
      await mutationWithAuth(url, options);
    } catch (error) {
      throw new Error('ブックマークの作成に失敗しました。' + error);
    }
  };

  const updateBookmark = async (id: number, requestBody: BookmarkRequest) => {
    try {
      const url = `/bookmarks/${id}`;
      const options: RequestInit = {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody),
      };
      await mutationWithAuth(url, options);
    } catch (error) {
      throw new Error('ブックマークの更新に失敗しました。' + error);
    }
  };

  const deleteBookmark = async (id: number) => {
    try {
      const url = `/bookmarks/${id}`;
      const options: RequestInit = { method: 'DELETE' };
      await mutationWithAuth(url, options);
    } catch (error) {
      throw new Error('ブックマークの削除に失敗しました。' + error);
    }
  };

  return {
    getBookmarkByBookId,
    getBookmarkPage,
    createBookmark,
    updateBookmark,
    deleteBookmark,
  };
};
