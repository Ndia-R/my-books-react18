import { cn } from '@/lib/utils';
import { MessageSquareIcon } from 'lucide-react';

const BUTTON_SIZE = { sm: 'size-6', md: 'size-8' };
const ICON_SIZE = { sm: 'size-3', md: 'size-4' };
const TEXT_SIZE = { sm: 'text-xs', md: 'text-sm' };

type Props = {
  reviewCount: number;
  size?: 'sm' | 'md';
};

export default function ReviewCountIcon({ reviewCount, size = 'md' }: Props) {
  return (
    <div className="flex items-center text-muted-foreground">
      <div
        className={cn('flex items-center justify-center', BUTTON_SIZE[size])}
      >
        <MessageSquareIcon className={ICON_SIZE[size]} />
      </div>
      <div className={cn('flex min-w-4 justify-center', TEXT_SIZE[size])}>
        {reviewCount}
      </div>
    </div>
  );
}
