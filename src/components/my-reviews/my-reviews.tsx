import MyReviewList from '@/components/my-reviews/my-review-list';
import SearchPagination from '@/components/search-pagination';
import { useApiReview } from '@/hooks/api/use-api-review';
import { ReviewRequest } from '@/types';
import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';

type Props = {
  page: number;
};

export default function MyReviews({ page }: Props) {
  const navigate = useNavigate();

  const { getReviewPageByUser, updateReview, deleteReview } = useApiReview();

  const { data: reviewPage } = useSuspenseQuery({
    queryKey: ['getReviewPageByUser', page],
    queryFn: () => getReviewPageByUser(page),
  });

  const queryClient = useQueryClient();

  const onSuccess = () => {
    queryClient.invalidateQueries({
      queryKey: ['getReviewPageByUser', page],
    });
    navigate('/my-reviews');
  };

  const onError = (error: Error) => {
    console.error(error);
  };

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

  return (
    <div className="flex flex-col gap-y-4 pb-4">
      <p className="text-right">
        {reviewPage.totalItems}
        <span className="ml-1 mr-4 text-sm text-muted-foreground">件</span>
      </p>
      <MyReviewList
        reviews={reviewPage.reviews}
        updateMutation={updateMutation}
        deleteMutation={deleteMutation}
      />
      <SearchPagination totalPages={reviewPage.totalPages} />
    </div>
  );
}
