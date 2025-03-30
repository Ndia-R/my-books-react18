import ReviewItem from '@/components/reviews/review-item';
import { Separator } from '@/components/ui/separator';
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

export default function ReviewList({
  reviews,
  createMutation,
  updateMutation,
  deleteMutation,
}: Props) {
  return (
    <ul className="flex flex-col p-3 sm:p-6">
      {reviews.map((review) => (
        <li key={review.id}>
          <Separator className="bg-foreground/10" />
          <article className="delay-0 duration-500 animate-in fade-in-0 slide-in-from-top-2 fill-mode-both">
            <ReviewItem
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
