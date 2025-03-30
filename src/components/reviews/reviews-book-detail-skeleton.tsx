import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { FETCH_REVIEWS_MAX_RESULTS } from '@/constants/constants';

const ReviewItemSkeleton = () => {
  return (
    <div className="p-4">
      <div className="flex flex-col items-center justify-between sm:flex-row">
        <div className="flex w-full items-center gap-x-4">
          <Skeleton className="size-16 rounded-full bg-muted-foreground/5" />
          <div>
            <div className="-mb-1">
              <Skeleton className="my-2 h-5 w-20 rounded-full bg-muted-foreground/5" />
            </div>
            <div className="flex items-center">
              <Skeleton className="my-1.5 h-5 w-32 rounded-full bg-muted-foreground/5" />
              <div className="ml-2 flex w-14"></div>
            </div>
          </div>
        </div>
        <Skeleton className="my-1 h-8 w-40 rounded-full bg-muted-foreground/5" />
      </div>
      <div className="mt-2 text-muted-foreground sm:pl-20">
        <Skeleton className="h-6 w-full rounded-full bg-muted-foreground/5" />
      </div>
    </div>
  );
};

export default function ReviewsBookDetailSkeleton() {
  return (
    <div className="mx-auto w-full lg:w-3/4">
      <div className="flex items-center justify-end px-3 sm:px-6">
        <Skeleton className="h-10 w-44 rounded-full bg-muted-foreground/5" />
      </div>
      <ul className="flex flex-col p-3 sm:p-6">
        {[...Array<number>(FETCH_REVIEWS_MAX_RESULTS)].map((_, index) => (
          <li key={index}>
            <Separator className="bg-foreground/10" />
            <ReviewItemSkeleton />
          </li>
        ))}
      </ul>
      <div className="mb-4 flex justify-center">
        <Skeleton className="size-8 rounded-full bg-muted-foreground/5" />
        <Skeleton className="size-8 rounded-full bg-muted-foreground/5" />
        <Skeleton className="size-8 rounded-full bg-muted-foreground/5" />
      </div>
    </div>
  );
}
