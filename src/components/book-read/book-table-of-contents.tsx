import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { useApiBook } from '@/hooks/api/use-api-book';
import { usePageTitle } from '@/hooks/use-page-title';
import { cn } from '@/lib/utils';
import { useAuth } from '@/providers/auth-provider';
import { useSuspenseQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';

type Props = {
  bookId: string;
};

export default function BookTableOfContents({ bookId }: Props) {
  const { getBookTableOfContents } = useApiBook();
  const { user } = useAuth();

  const { data: bookTableOfContents } = useSuspenseQuery({
    queryKey: ['getBookTableOfContents', bookId],
    queryFn: () => getBookTableOfContents(bookId),
  });

  usePageTitle(bookTableOfContents.title);

  return (
    <div className="delay-0 duration-200 animate-in fade-in-0">
      <div className="flex flex-col gap-y-12 px-4 py-12 sm:px-20">
        <div className="flex w-full flex-col items-center gap-y-6 sm:items-start">
          <h1 className="text-3xl font-bold sm:text-5xl">
            {bookTableOfContents.title}
          </h1>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                className={cn(
                  'w-44 rounded-full bg-transparent',
                  (!user || !bookTableOfContents.chapters.length) &&
                    'pointer-events-none opacity-50'
                )}
                variant="outline"
                asChild
              >
                <Link to={`/read/${bookId}/chapter/1/page/1`}>
                  最初から読む
                </Link>
              </Button>
            </TooltipTrigger>
            {!user && (
              <TooltipContent>ログインしてこの本を読みましょう</TooltipContent>
            )}
          </Tooltip>
        </div>

        {bookTableOfContents.chapters.length ? (
          <ul className="flex w-full flex-col gap-y-8">
            {bookTableOfContents.chapters.map((chapter) => (
              <li
                className="w-full text-center sm:text-left"
                key={chapter.chapterNumber}
              >
                <p className="text-xs text-muted-foreground sm:text-sm">{`第 ${chapter.chapterNumber} 章`}</p>
                <Link
                  to={`/read/${bookId}/chapter/${chapter.chapterNumber}/page/1`}
                  className={cn(
                    'font-semibold hover:text-primary text-base sm:text-xl',
                    !user && 'pointer-events-none'
                  )}
                >
                  {chapter.chapterTitle}
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-center sm:text-start">目次がありません</p>
        )}
      </div>
    </div>
  );
}
