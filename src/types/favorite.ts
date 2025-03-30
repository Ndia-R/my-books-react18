import { Book } from '@/types/book';

export interface Favorite {
  userId: number;
  bookId: string;
  updatedAt: string;
  book: Book;
}

export interface FavoritePage {
  page: number;
  totalPages: number;
  totalItems: number;
  favorites: Favorite[];
}

export interface FavoriteInfo {
  isFavorite: boolean;
  favoriteCount: number;
}

export interface FavoriteRequest {
  bookId: string;
}
