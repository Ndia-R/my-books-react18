import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogFooter } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { BookmarkCreateMutation, BookmarkRequest } from '@/types';
import { useEffect, useState } from 'react';

type Props = {
  bookId: string;
  chapterNumber: number;
  pageNumber: number;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  createMutation?: BookmarkCreateMutation;
};

export default function BookmarkCreateDialog({
  bookId,
  chapterNumber,
  pageNumber,
  isOpen,
  setIsOpen,
  createMutation,
}: Props) {
  const [note, setNote] = useState('');

  const { toast } = useToast();

  useEffect(() => {
    if (isOpen) {
      setNote('');
    }
  }, [isOpen]);

  const handleCreate = () => {
    const requestBody: BookmarkRequest = {
      bookId,
      chapterNumber,
      pageNumber,
      note,
    };
    createMutation?.mutate(requestBody, {
      onSuccess: () => {
        toast({ title: 'ブックマークを作成しました' });
        setIsOpen(false);
      },
      onError: () => {
        toast({
          title: 'ブックマークの作成に失敗しました',
          description: '管理者へ連絡してください。',
          variant: 'destructive',
          duration: 5000,
        });
        setIsOpen(false);
      },
    });
  };

  const handleCloseDialog = () => {
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent
        className="w-3/4 min-w-[360px] max-w-[600px] p-4 sm:p-6"
        onEscapeKeyDown={handleCloseDialog}
        onPointerDownOutside={handleCloseDialog}
      >
        <div>
          <p className="font-semibold leading-10">ブックマーク</p>
          <p className="text-xs text-muted-foreground sm:text-sm">
            このブックマークにメモを残せます。メモが未入力でもブックマーク登録できます。
          </p>
        </div>

        <Textarea
          spellCheck={false}
          value={note}
          onChange={(e) => setNote(e.currentTarget.value)}
        />

        <DialogFooter className="gap-y-4 sm:gap-y-0">
          <Button
            className="min-w-24 rounded-full"
            variant="ghost"
            onClick={handleCloseDialog}
          >
            キャンセル
          </Button>
          <Button className="min-w-24 rounded-full" onClick={handleCreate}>
            作成
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
