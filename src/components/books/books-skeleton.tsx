import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { FETCH_BOOKS_MAX_RESULTS } from '@/constants/constants';

export default function BooksSkeleton() {
  return (
    <div className="flex flex-col gap-y-4 pb-4">
      <div className="h-6" />
      <div className="grid grid-cols-2 justify-items-center gap-2 sm:grid-cols-3 sm:gap-3 md:grid-cols-4 lg:grid-cols-5">
        {[...Array<number>(FETCH_BOOKS_MAX_RESULTS)].map((_, index) => (
          <article key={index}>
            <Card>
              <CardContent className="flex w-40 flex-col items-center gap-y-0 p-3 sm:w-48 sm:gap-y-1 sm:p-4">
                <Skeleton className="mb-1 h-44 w-32 rounded bg-muted-foreground/5 object-cover sm:mb-0 sm:h-52 sm:w-36" />
                <div className="flex h-8 w-full items-center justify-center sm:h-10">
                  <Skeleton className="h-4 w-4/5 rounded-full bg-muted-foreground/5 sm:h-5" />
                </div>
                <div className="flex h-11 w-full flex-col items-center">
                  <Skeleton className="h-3 w-24 rounded-lg bg-muted-foreground/5" />
                  <Skeleton className="mt-3 h-3 w-24 rounded-lg bg-muted-foreground/5" />
                </div>
              </CardContent>
            </Card>
          </article>
        ))}
      </div>
    </div>
  );
}
