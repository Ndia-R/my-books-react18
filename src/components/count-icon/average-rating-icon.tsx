import { cn } from '@/lib/utils';
import { StarIcon } from 'lucide-react';

const BUTTON_SIZE = { sm: 'size-6', md: 'size-8' };
const ICON_SIZE = { sm: 'size-3', md: 'size-4' };
const TEXT_SIZE = { sm: 'text-xs', md: 'text-sm' };

type Props = {
  averageRating: number;
  size?: 'sm' | 'md';
};

export default function AverageRatingIcon({
  averageRating,
  size = 'md',
}: Props) {
  return (
    <div className="flex items-center text-muted-foreground">
      <div
        className={cn('flex items-center justify-center', BUTTON_SIZE[size])}
      >
        <StarIcon className={ICON_SIZE[size]} />
      </div>
      <div className={cn('flex min-w-4 justify-center', TEXT_SIZE[size])}>
        {averageRating.toFixed(1)}
      </div>
    </div>
  );
}
