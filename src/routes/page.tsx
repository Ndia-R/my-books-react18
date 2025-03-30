import BooksNewReleases from '@/components/books/books-new-releases';
import BooksSkeleton from '@/components/books/books-skeleton';
import GenresSkeleton from '@/components/genres/genres-skeleton';
import GenresTopPage from '@/components/genres/genres-top-page';
import Hero from '@/components/layout/hero';
import ErrorElement from '@/routes/error-element';
import { Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';

export default function Page() {
  return (
    <>
      <section className="mb-4 sm:mb-0">
        <Hero />
      </section>

      <section className="mb-4 flex flex-col gap-y-4">
        <h2 className="font-bold">ジャンル</h2>

        <ErrorBoundary fallback={<ErrorElement />}>
          <Suspense fallback={<GenresSkeleton />}>
            <GenresTopPage />
          </Suspense>
        </ErrorBoundary>
      </section>

      <section className="flex flex-col">
        <h2 className="font-bold">ニューリリース</h2>

        <ErrorBoundary fallback={<ErrorElement />}>
          <Suspense fallback={<BooksSkeleton />}>
            <BooksNewReleases />
          </Suspense>
        </ErrorBoundary>
      </section>
    </>
  );
}
