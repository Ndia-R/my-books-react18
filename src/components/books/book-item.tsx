import AverageRatingIcon from '@/components/count-icon/average-rating-icon';
import ReviewCountIcon from '@/components/count-icon/review-count-icon';
import { Card, CardContent } from '@/components/ui/card';
import { BOOK_IMAGE_BASE_URL } from '@/constants/constants';
import { formatDateJP } from '@/lib/utils';
import { Book } from '@/types';
import { Link } from 'react-router-dom';

type Props = {
  book: Book;
};

export default function BookItem({ book }: Props) {
  return (
    <Card className="border-card-foreground/5 bg-card/70">
      <CardContent className="flex w-40 flex-col items-center gap-y-0 p-3 sm:w-48 sm:gap-y-1 sm:p-4">
        <Link to={`/book/${book.id}`} className="size-fit">
          <img
            className="mb-1 h-44 rounded object-cover sm:mb-0 sm:h-52"
            src={BOOK_IMAGE_BASE_URL + book.imagePath}
            alt={book.title}
          />
        </Link>
        <Link
          to={`/book/${book.id}`}
          className="flex h-8 items-center justify-center text-xs hover:text-primary sm:h-10 sm:text-sm"
        >
          <h2 className="line-clamp-2 text-center">{book.title}</h2>
        </Link>
        <time
          className="text-xs tracking-wide text-muted-foreground"
          dateTime={Date.parse(book.publishedDate) ? book.publishedDate : ''}
        >
          {formatDateJP(book.publishedDate)}
        </time>
        <div className="flex gap-x-3">
          <AverageRatingIcon size="sm" averageRating={book.averageRating} />
          <ReviewCountIcon size="sm" reviewCount={book.reviewCount} />
        </div>
      </CardContent>
    </Card>
  );
}
