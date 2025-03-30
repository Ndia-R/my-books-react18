import { Button } from '@/components/ui/button';
import { createPageNumbers } from '@/lib/pagination';
import { cn } from '@/lib/utils';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { HTMLAttributes } from 'react';

interface Props extends HTMLAttributes<HTMLDivElement> {
  total: number;
  page: number;
  onChangePage: (page: number) => void;
}

export default function Pagination({
  total,
  page,
  onChangePage,
  className,
  ...props
}: Props) {
  const pageNumbers = createPageNumbers(page, total);

  return (
    <div className={cn('flex', className)} {...props}>
      <Button
        className="size-8 rounded-full"
        variant="ghost"
        size="icon"
        aria-label="前のページへ"
        disabled={page <= 1}
        onClick={() => onChangePage(page - 1)}
      >
        <ChevronLeft className="size-5" />
      </Button>

      <ul className="flex">
        {pageNumbers.map((pageNumber, index) => (
          <li key={`${pageNumber}-${index}`}>
            {pageNumber === 0 ? (
              <div className="size-8 text-center">...</div>
            ) : (
              <Button
                className="size-8 rounded-full"
                variant={page === pageNumber ? 'secondary' : 'ghost'}
                size="icon"
                aria-label="ページ番号"
                onClick={() => {
                  if (page !== pageNumber) {
                    onChangePage(pageNumber);
                  }
                }}
              >
                {pageNumber}
              </Button>
            )}
          </li>
        ))}
      </ul>

      <Button
        className="size-8 rounded-full"
        variant="ghost"
        size="icon"
        aria-label="次のページへ"
        disabled={page >= total}
        onClick={() => onChangePage(page + 1)}
      >
        <ChevronRight className="size-5" />
      </Button>
    </div>
  );
}
