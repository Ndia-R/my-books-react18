import ReviewCreateDialog from '@/components/reviews/review-create-dialog';
import ReviewList from '@/components/reviews/review-list';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { useApiReview } from '@/hooks/api/use-api-review';
import { useAuth } from '@/providers/auth-provider';
import { Review, ReviewRequest } from '@/types';
import {
  useMutation,
  useQuery,
  useQueryClient,
  useSuspenseQuery,
} from '@tanstack/react-query';
import { useEffect, useState } from 'react';

type Props = {
  bookId: string;
};

export default function ReviewsBookDetail({ bookId }: Props) {
  const [isOpen, setIsOpen] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [totalPages, setTotalPages] = useState(0);

  const { user } = useAuth();
  const {
    getReviewPage,
    checkSelfReviewExists,
    createReview,
    updateReview,
    deleteReview,
  } = useApiReview();

  const { data: initialReviewPage } = useSuspenseQuery({
    queryKey: ['getReviewPage', bookId, 1],
    queryFn: () => getReviewPage(bookId, 1),
  });

  // ログインしていない場合は、enabledオプションを指定して
  // queryFnを呼び出さないようにする（この指定はuseSuspenseQueryでは出来ない模様）
  const { data: reviewExists = false } = useQuery({
    queryKey: ['checkSelfReviewExists', bookId],
    queryFn: () => checkSelfReviewExists(bookId),
    enabled: !!user,
    retry: false,
  });

  const queryClient = useQueryClient();

  const onSuccess = () => {
    queryClient.invalidateQueries({ queryKey: ['getReviewPage', bookId, 1] });
    queryClient.invalidateQueries({ queryKey: ['getBookDetailsById', bookId] });
    queryClient.invalidateQueries({
      queryKey: ['checkSelfReviewExists', bookId],
    });
  };

  const onError = (error: Error) => {
    console.error(error);
  };

  const createMutation = useMutation({
    mutationFn: (requestBody: ReviewRequest) => createReview(requestBody),
    onSuccess,
    onError,
  });

  const updateMutation = useMutation({
    mutationFn: ({
      id,
      requestBody,
    }: {
      id: number;
      requestBody: ReviewRequest;
    }) => updateReview(id, requestBody),
    onSuccess,
    onError,
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => deleteReview(id),
    onSuccess,
    onError,
  });

  useEffect(() => {
    if (initialReviewPage) {
      setCurrentPage(1);
      setReviews(initialReviewPage.reviews);
      setTotalPages(initialReviewPage.totalPages);
    }
  }, [initialReviewPage]);

  const loadMoreReviews = async () => {
    const nextPage = currentPage + 1;
    const nextReviewPage = await getReviewPage(bookId, nextPage);
    setReviews((prevReviews) => [...prevReviews, ...nextReviewPage.reviews]);
    setCurrentPage(nextPage);
  };

  return (
    <div className="mx-auto w-full pb-4 lg:w-3/4">
      <div className="flex flex-col-reverse items-center justify-end gap-y-4 sm:flex-row sm:gap-x-4 sm:px-6">
        <p>レビュー {initialReviewPage.totalItems} 件</p>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              className="w-44 rounded-full bg-transparent"
              variant="outline"
              disabled={user ? reviewExists : true}
              onClick={() => user && setIsOpen(true)}
            >
              {user && reviewExists ? 'レビュー済み' : 'レビューする'}
            </Button>
          </TooltipTrigger>
          {!user && (
            <TooltipContent>
              ログインしてこの本の「レビュー」を書きましょう
            </TooltipContent>
          )}
        </Tooltip>
        <ReviewCreateDialog
          bookId={bookId}
          page={currentPage}
          isOpen={isOpen}
          setIsOpen={setIsOpen}
          createMutation={createMutation}
        />
      </div>

      <ReviewList
        reviews={reviews}
        updateMutation={updateMutation}
        deleteMutation={deleteMutation}
      />

      {currentPage < totalPages && (
        <div className="flex justify-center">
          <Button
            className="w-44 rounded-full text-muted-foreground"
            variant="ghost"
            onClick={loadMoreReviews}
          >
            もっと見る
          </Button>
        </div>
      )}
    </div>
  );
}
