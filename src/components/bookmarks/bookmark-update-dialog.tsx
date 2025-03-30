import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogFooter } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { useConfirmDialog } from '@/hooks/use-confirm-dialog';
import { useToast } from '@/hooks/use-toast';
import {
  Bookmark,
  BookmarkDeleteMutation,
  BookmarkRequest,
  BookmarkUpdateMutation,
} from '@/types';
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

type Props = {
  bookmark: Bookmark;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  updateMutation?: BookmarkUpdateMutation;
  deleteMutation?: BookmarkDeleteMutation;
};

export default function BookmarkUpdateDialog({
  bookmark,
  isOpen,
  setIsOpen,
  updateMutation,
  deleteMutation,
}: Props) {
  const [note, setNote] = useState('');

  const location = useLocation();

  const { confirmDialog } = useConfirmDialog();
  const { toast } = useToast();

  useEffect(() => {
    if (isOpen) {
      setNote(bookmark.note);
    }
  }, [isOpen, bookmark.note]);

  const handleDelete = async () => {
    const { isCancel } = await confirmDialog({
      icon: 'warning',
      title: 'このブックマークを削除しますか？',
      message: 'ブックマークのメモも削除されます。',
    });
    if (isCancel) return;

    deleteMutation?.mutate(bookmark.id, {
      onSuccess: () => {
        toast({ title: 'ブックマークを削除しました' });
        setIsOpen(false);
      },
      onError: () => {
        toast({
          title: 'ブックマークの削除に失敗しました',
          description: '管理者へ連絡してください。',
          variant: 'destructive',
          duration: 5000,
        });
        setIsOpen(false);
      },
    });
  };

  const handleUpdate = () => {
    const requestBody: BookmarkRequest = {
      bookId: bookmark.bookId,
      chapterNumber: bookmark.chapterNumber,
      pageNumber: bookmark.pageNumber,
      note,
    };
    updateMutation?.mutate(
      { id: bookmark.id, requestBody },
      {
        onSuccess: () => {
          toast({ title: 'ブックマークのメモを更新しました' });
          setIsOpen(false);
        },
        onError: () => {
          toast({
            title: 'ブックマークのメモを更新に失敗しました',
            description: '管理者へ連絡してください。',
            variant: 'destructive',
            duration: 5000,
          });
          setIsOpen(false);
        },
      }
    );
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
            メモを編集できます。メモが未入力でもブックマーク登録は消えません。
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
          {location.pathname.includes('read') && (
            <Button
              className="min-w-24 rounded-full"
              variant="outline"
              onClick={handleDelete}
            >
              削除
            </Button>
          )}
          <Button className="min-w-24 rounded-full" onClick={handleUpdate}>
            更新
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
