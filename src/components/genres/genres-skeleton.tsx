import { Skeleton } from '@/components/ui/skeleton';

export default function GenresSkeleton() {
  return (
    <ul className="flex flex-wrap">
      {[...Array<number>(12)].map((_, index) => (
        <li key={index}>
          {/* 背景色を bg-muted-foreground/5 にしてスケルトン見せるより、高さだけズレないように透明のほうがよい */}
          <Skeleton className="m-1 h-9 w-24 rounded-full bg-muted-foreground/5" />
        </li>
      ))}
    </ul>
  );
}
