import { Skeleton } from '@/components/ui/skeleton';

export default function BookDetailSkeleton() {
  return (
    <div className="flex flex-col justify-center p-3 pt-10 sm:p-6 lg:flex-row">
      <div className="flex flex-col items-center justify-center lg:w-1/2">
        <Skeleton className="h-[360px] w-[280px] rounded bg-muted-foreground/5 object-cover sm:h-[480px] sm:w-[360px]" />
        <div className="mt-2 flex flex-col items-center justify-around sm:w-[440px] sm:flex-row">
          <Skeleton className="mt-2 h-6 w-48 rounded-full bg-muted-foreground/5" />
          <div className="flex justify-center gap-x-2">
            <Skeleton className="size-8 rounded-full bg-muted-foreground/5" />
            <Skeleton className="size-8 rounded-full bg-muted-foreground/5" />
          </div>
        </div>
        <div className="my-4 flex items-center">
          <Skeleton className="h-11 w-48 rounded-full bg-muted-foreground/5" />
        </div>
      </div>

      <div className="p-4 lg:w-1/2">
        <div className="text-3xl font-bold sm:text-4xl">
          <Skeleton className="h-9 w-64 rounded-full bg-muted-foreground/5 sm:h-10" />
        </div>
        <div className="my-4 flex w-full flex-wrap items-center justify-end gap-x-3">
          <Skeleton className="h-7 w-24 rounded-full bg-muted-foreground/5 sm:h-8" />
        </div>

        <div className="flex gap-x-2">
          <Skeleton className="h-9 w-24 rounded-full bg-muted-foreground/5" />
          <Skeleton className="h-9 w-24 rounded-full bg-muted-foreground/5" />
        </div>

        <div className="my-6 md:my-10">
          <Skeleton className="my-2 h-6 w-full rounded-full bg-muted-foreground/5" />
          <Skeleton className="my-2 h-6 w-full rounded-full bg-muted-foreground/5" />
          <Skeleton className="my-2 h-6 w-full rounded-full bg-muted-foreground/5" />
        </div>

        <div className="flex flex-col justify-between gap-y-4 lg:flex-row">
          <div className="flex flex-col gap-y-1 text-muted-foreground">
            <div className="flex">
              <Skeleton className="mb-1 h-5 w-48 rounded-full bg-muted-foreground/5" />
            </div>
            <div className="flex">
              <Skeleton className="mb-1 h-5 w-36 rounded-full bg-muted-foreground/5" />
            </div>
            <div className="flex">
              <Skeleton className="mb-1 h-5 w-44 rounded-full bg-muted-foreground/5" />
            </div>
            <div className="flex">
              <Skeleton className="mb-1 h-5 w-36 rounded-full bg-muted-foreground/5" />
            </div>
            <div className="flex">
              <Skeleton className="mb-1 h-5 w-32 rounded-full bg-muted-foreground/5" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
