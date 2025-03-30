import { Book } from '@/types';
import { UseMutationResult } from '@tanstack/react-query';

export interface Review {
  id: number;
  userId: number;
  bookId: string;
  name: string;
  avatarPath: string;
  comment: string;
  rating: number;
  createdAt: string;
  updatedAt: string;
  book: Book;
}

export interface ReviewPage {
  page: number;
  totalPages: number;
  totalItems: number;
  reviews: Review[];
}

export interface ReviewSummary {
  bookId: string;
  reviewCount: number;
  averageRating: number;
}

export interface ReviewRequest {
  bookId: string;
  comment: string;
  rating: number;
}

export interface SelfReviewExists {
  exists: boolean;
}

export type ReviewCreateMutation = UseMutationResult<
  void,
  Error,
  ReviewRequest,
  unknown
>;

export type ReviewUpdateMutation = UseMutationResult<
  void,
  Error,
  {
    id: number;
    requestBody: ReviewRequest;
  },
  unknown
>;

export type ReviewDeleteMutation = UseMutationResult<
  void,
  Error,
  number,
  unknown
>;
