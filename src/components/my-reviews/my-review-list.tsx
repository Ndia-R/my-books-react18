import MyReviewItem from '@/components/my-reviews/my-review-item';
import {
  Review,
  ReviewCreateMutation,
  ReviewDeleteMutation,
  ReviewUpdateMutation,
} from '@/types';

type Props = {
  reviews: Review[];
  createMutation?: ReviewCreateMutation;
  updateMutation?: ReviewUpdateMutation;
  deleteMutation?: ReviewDeleteMutation;
};

export default function MyReviewList({
  reviews,
  createMutation,
  updateMutation,
  deleteMutation,
}: Props) {
  return (
    <ul className="flex flex-col gap-y-2">
      {reviews.map((review) => (
        <li key={review.id}>
          <article>
            <MyReviewItem
              review={review}
              createMutation={createMutation}
              updateMutation={updateMutation}
              deleteMutation={deleteMutation}
            />
          </article>
        </li>
      ))}
    </ul>
  );
}
