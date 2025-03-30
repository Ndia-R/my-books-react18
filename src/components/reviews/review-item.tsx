import Rating from '@/components/rating';
import ReviewUpdateDialog from '@/components/reviews/review-update-dialog';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { AVATAR_IMAGE_BASE_URL } from '@/constants/constants';
import { useConfirmDialog } from '@/hooks/use-confirm-dialog';
import { useToast } from '@/hooks/use-toast';
import { formatDateJP, formatTime } from '@/lib/utils';
import { useAuth } from '@/providers/auth-provider';
import {
  Review,
  ReviewCreateMutation,
  ReviewDeleteMutation,
  ReviewUpdateMutation,
} from '@/types';
import { SquarePenIcon, Trash2Icon } from 'lucide-react';
import { useState } from 'react';

type Props = {
  review: Review;
  createMutation?: ReviewCreateMutation;
  updateMutation?: ReviewUpdateMutation;
  deleteMutation?: ReviewDeleteMutation;
};

export default function ReviewItem({
  review,
  updateMutation,
  deleteMutation,
}: Props) {
  const [isOpen, setIsOpen] = useState(false);

  const { user } = useAuth();
  const { toast } = useToast();
  const { confirmDialog } = useConfirmDialog();

  const handleClickUpdate = () => {
    setIsOpen(true);
  };

  const handleClickDelete = async () => {
    const { isCancel } = await confirmDialog({
      icon: 'warning',
      title: '削除しますか？',
      message: '削除すると元に戻りません。',
      actionLabel: '削除',
    });
    if (isCancel) return;

    deleteMutation?.mutate(review.id, {
      onSuccess: () => {
        toast({ title: 'レビューを削除しました' });
      },
    });
  };

  return (
    <div className="p-4">
      <div className="flex flex-col items-center justify-between sm:flex-row">
        <div className="flex w-full items-center gap-x-4">
          <Avatar className="size-16">
            <AvatarImage
              className="bg-primary/50"
              src={AVATAR_IMAGE_BASE_URL + review.avatarPath}
              alt="avatar-image"
            />
            <AvatarFallback className="font-semibold">
              {review.name.slice(0, 1)}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="-mb-1 text-lg font-semibold">{review.name}</p>
            <div className="flex items-center">
              <time
                className="whitespace-nowrap text-sm leading-8 tracking-wide text-muted-foreground"
                dateTime={Date.parse(review.updatedAt) ? review.updatedAt : ''}
              >
                {formatDateJP(review.updatedAt)} {formatTime(review.updatedAt)}
              </time>
              <div className="ml-2 flex w-16">
                {user?.id === review.userId && (
                  <>
                    <Button
                      className="size-8 rounded-full text-muted-foreground"
                      variant="ghost"
                      size="icon"
                      aria-label="レビューを編集"
                      onClick={handleClickUpdate}
                    >
                      <SquarePenIcon className="size-4" />
                    </Button>
                    <ReviewUpdateDialog
                      review={review}
                      isOpen={isOpen}
                      setIsOpen={setIsOpen}
                      updateMutation={updateMutation}
                    />
                    <Button
                      className="size-8 rounded-full text-muted-foreground"
                      variant="ghost"
                      size="icon"
                      aria-label="レビューを削除"
                      onClick={handleClickDelete}
                    >
                      <Trash2Icon className="size-4" />
                    </Button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
        <Rating rating={review.rating} readOnly />
      </div>
      <p className="mt-2 text-muted-foreground sm:pl-20">{review.comment}</p>
    </div>
  );
}
