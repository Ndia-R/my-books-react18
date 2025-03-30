import { FETCH_BOOKS_MAX_RESULTS } from '@/constants/constants';
import { useApi } from '@/hooks/api/use-api';
import {
  BookContentPage,
  BookDetails,
  BookPage,
  BookTableOfContents,
} from '@/types';

export const useApiBook = () => {
  const { fetcher, fetcherWithAuth } = useApi();

  const getBookDetailsById = async (bookId: string) => {
    try {
      const url = `/books/${bookId}`;
      const book = await fetcher<BookDetails>(url);
      return book;
    } catch (error) {
      throw new Error('書籍情報の読み込みが失敗しました。' + error);
    }
  };

  const getBookPageByQuery = async (query: string, page: number = 0) => {
    try {
      const basePage = page > 0 ? page - 1 : 0;
      const url = `/books/search?q=${query}&page=${basePage}&maxResults=${FETCH_BOOKS_MAX_RESULTS}`;
      const bookPage = await fetcher<BookPage>(url);
      return bookPage;
    } catch (error) {
      throw new Error('書籍検索が失敗しました。' + error);
    }
  };

  const getBookPageByGenreId = async (
    genreIdsQuery: string,
    conditionQuery: string,
    page: number = 0
  ) => {
    try {
      const basePage = page > 0 ? page - 1 : 0;
      const url = `/books/discover?genreIds=${genreIdsQuery}&condition=${conditionQuery}&page=${basePage}&maxResults=${FETCH_BOOKS_MAX_RESULTS}`;
      const bookPage = await fetcher<BookPage>(url);
      return bookPage;
    } catch (error) {
      throw new Error('ジャンル検索が失敗しました。' + error);
    }
  };

  const getNewBooks = async () => {
    try {
      const url = `/books/new-books`;
      const bookPage = await fetcher<BookPage>(url);
      return bookPage;
    } catch (error) {
      throw new Error('ニューリリース一覧の読み込みが失敗しました。' + error);
    }
  };

  const getBookTableOfContents = async (bookId: string) => {
    try {
      const url = `/books/${bookId}/table-of-contents`;
      const bookTableOfContents = await fetcher<BookTableOfContents>(url);
      return bookTableOfContents;
    } catch (error) {
      throw new Error('書籍の目次の読み込みが失敗しました。' + error);
    }
  };

  const getBookContentPage = async (
    bookId: string,
    chapterNumber: number,
    pageNumber: number
  ) => {
    try {
      const url = `/read/books/${bookId}/chapters/${chapterNumber}/pages/${pageNumber}`;
      const bookContentPage = await fetcherWithAuth<BookContentPage>(url);
      return bookContentPage;
    } catch (error) {
      throw new Error('書籍のページ情報の読み込みが失敗しました。' + error);
    }
  };

  return {
    getBookDetailsById,
    getBookPageByQuery,
    getBookPageByGenreId,
    getNewBooks,
    getBookTableOfContents,
    getBookContentPage,
  };
};
