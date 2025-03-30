import BooksSearch from '@/components/books/books-search';
import BooksSkeleton from '@/components/books/books-skeleton';
import { Separator } from '@/components/ui/separator';
import { usePageTitle } from '@/hooks/use-page-title';
import { useSearchFilters } from '@/hooks/use-search-filters';
import ErrorElement from '@/routes/error-element';
import { Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';

export default function Page() {
  const { q, page } = useSearchFilters();

  usePageTitle(q);

  return (
    <>
      <div className="m-4 flex h-10 items-center">
        <h1>
          「 {q} 」
          <span className="text-sm text-muted-foreground">の検索結果</span>
        </h1>
      </div>

      <Separator className="my-4 bg-foreground/10" />

      <ErrorBoundary fallback={<ErrorElement />}>
        <Suspense fallback={<BooksSkeleton />}>
          <BooksSearch searchQuery={q} page={page} />
        </Suspense>
      </ErrorBoundary>
    </>
  );
}
