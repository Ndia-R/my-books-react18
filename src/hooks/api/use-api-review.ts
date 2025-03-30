import {
  FETCH_MY_REVIEWS_MAX_RESULTS,
  FETCH_REVIEWS_MAX_RESULTS,
} from '@/constants/constants';
import { useApi } from '@/hooks/api/use-api';
import {
  ReviewPage,
  ReviewRequest,
  ReviewSummary,
  SelfReviewExists,
} from '@/types';

export const useApiReview = () => {
  const { fetcher, fetcherWithAuth, mutationWithAuth } = useApi();

  const getReviewPage = async (bookId: string, page: number = 0) => {
    try {
      const basePage = page > 0 ? page - 1 : 0;
      const url = `/books/${bookId}/reviews?&page=${basePage}&maxResults=${FETCH_REVIEWS_MAX_RESULTS}`;
      const reviewPage = await fetcher<ReviewPage>(url);
      return reviewPage;
    } catch (error) {
      throw new Error('レビュー一覧の読み込みが失敗しました。' + error);
    }
  };

  const getReviewSummary = async (bookId: string) => {
    try {
      const url = `/books/${bookId}/reviews/summary`;
      const reviewSummary = await fetcher<ReviewSummary>(url);
      return reviewSummary;
    } catch (error) {
      throw new Error('レビュー情報の読み込みが失敗しました。' + error);
    }
  };

  const checkSelfReviewExists = async (bookId: string) => {
    try {
      const url = `/reviews/self-review-exists/${bookId}`;
      const data = await fetcherWithAuth<SelfReviewExists>(url);
      return data.exists;
    } catch (error) {
      throw new Error('レビューの存在チェックに失敗しました。' + error);
    }
  };

  const getReviewPageByUser = async (page: number = 0) => {
    try {
      const basePage = page > 0 ? page - 1 : 0;
      const url = `/reviews?&page=${basePage}&maxResults=${FETCH_MY_REVIEWS_MAX_RESULTS}`;
      const reviewPage = await fetcherWithAuth<ReviewPage>(url);
      return reviewPage;
    } catch (error) {
      throw new Error('マイレビュー一覧の読み込みが失敗しました。' + error);
    }
  };

  const createReview = async (requestBody: ReviewRequest) => {
    try {
      const url = `/reviews`;
      const options: RequestInit = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody),
      };
      await mutationWithAuth(url, options);
    } catch (error) {
      throw new Error('レビューの作成に失敗しました。' + error);
    }
  };

  const updateReview = async (id: number, requestBody: ReviewRequest) => {
    try {
      const url = `/reviews/${id}`;
      const options: RequestInit = {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody),
      };
      await mutationWithAuth(url, options);
    } catch (error) {
      throw new Error('レビューの更新に失敗しました。' + error);
    }
  };

  const deleteReview = async (id: number) => {
    try {
      const url = `/reviews/${id}`;
      const options: RequestInit = {
        method: 'DELETE',
      };
      await mutationWithAuth(url, options);
    } catch (error) {
      throw new Error('レビューの削除に失敗しました。' + error);
    }
  };

  return {
    getReviewPage,
    getReviewSummary,
    checkSelfReviewExists,
    getReviewPageByUser,
    createReview,
    updateReview,
    deleteReview,
  };
};
