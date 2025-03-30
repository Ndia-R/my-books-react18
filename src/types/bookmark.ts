import { Book } from '@/types/book';
import { UseMutationResult } from '@tanstack/react-query';

export interface Bookmark {
  id: number;
  userId: number;
  bookId: string;
  chapterNumber: number;
  pageNumber: number;
  note: string;
  chapterTitle: string;
  updatedAt: string;
  book: Book;
}

export interface BookmarkPage {
  page: number;
  totalPages: number;
  totalItems: number;
  bookmarks: Bookmark[];
}

export interface BookmarkRequest {
  bookId: string;
  chapterNumber: number;
  pageNumber: number;
  note: string;
}

export type BookmarkCreateMutation = UseMutationResult<
  void,
  Error,
  BookmarkRequest,
  unknown
>;

export type BookmarkUpdateMutation = UseMutationResult<
  void,
  Error,
  {
    id: number;
    requestBody: BookmarkRequest;
  },
  unknown
>;

export type BookmarkDeleteMutation = UseMutationResult<
  void,
  Error,
  number,
  unknown
>;
