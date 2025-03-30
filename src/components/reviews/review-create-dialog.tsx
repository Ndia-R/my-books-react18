import Rating from '@/components/rating';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogFooter } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { useConfirmDialog } from '@/hooks/use-confirm-dialog';
import { useToast } from '@/hooks/use-toast';
import { ReviewCreateMutation, ReviewRequest } from '@/types';
import { useEffect, useState } from 'react';

type Props = {
  bookId: string;
  page: number;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  createMutation?: ReviewCreateMutation;
};

export default function ReviewCreateDialog({
  bookId,
  isOpen,
  setIsOpen,
  createMutation,
}: Props) {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');

  const { toast } = useToast();
  const { confirmDialog } = useConfirmDialog();

  useEffect(() => {
    if (isOpen) {
      setRating(0);
      setComment('');
    }
  }, [isOpen]);

  const handleClickPost = async () => {
    if (rating === 0) {
      const { isCancel } = await confirmDialog({
        icon: 'question',
        title: 'このまま投稿しますか？',
        message: '星の数が「0」のままです。',
        actionLabel: '投稿',
      });
      if (isCancel) return;
    }

    const requestBody: ReviewRequest = { bookId, comment, rating };
    createMutation?.mutate(requestBody, {
      onSuccess: () => {
        toast({ title: 'レビューを投稿しました' });
        setIsOpen(false);
      },
      onError: () => {
        toast({
          title: 'レビュー投稿に失敗しました',
          description: '管理者へ連絡してください。',
          variant: 'destructive',
          duration: 5000,
        });
        setIsOpen(false);
      },
    });
  };

  const handleClickCancel = async () => {
    if (comment) {
      const { isCancel } = await confirmDialog({
        icon: 'question',
        title: 'キャンセルして閉じますか？',
        message: 'コメントはまだ投稿していません。',
        persistent: true,
      });
      if (isCancel) return;
    }
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent
        className="w-3/4 min-w-[360px] max-w-[600px] p-4 sm:p-6"
        onEscapeKeyDown={handleClickCancel}
        onPointerDownOutside={handleClickCancel}
      >
        <div className="flex items-start justify-between">
          <div>
            <p className="font-semibold leading-10">レビュー</p>
            <p className="text-xs text-muted-foreground sm:text-sm">
              素敵な感想を伝えましょう！
            </p>
          </div>
          <div>
            <Rating rating={rating} onChange={setRating} />
            <p className="text-center text-xs text-muted-foreground sm:text-sm">
              星をクリックして決定
            </p>
          </div>
        </div>

        <Textarea
          spellCheck={false}
          value={comment}
          onChange={(e) => setComment(e.currentTarget.value)}
        />

        <DialogFooter className="gap-y-4 sm:gap-y-0">
          <Button
            className="min-w-24 rounded-full"
            variant="ghost"
            onClick={handleClickCancel}
          >
            キャンセル
          </Button>
          <Button
            className="min-w-24 rounded-full"
            disabled={comment === ''}
            onClick={handleClickPost}
          >
            投稿
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
