import Logo from '@/components/layout/logo';
import PasswordInput from '@/components/profile/password-input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { useApiUser } from '@/hooks/api/use-api-user';
import { useConfirmDialog } from '@/hooks/use-confirm-dialog';
import { usePageTitle } from '@/hooks/use-page-title';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { ChangePassword } from '@/types';
import { useMutation } from '@tanstack/react-query';
import { Loader2Icon } from 'lucide-react';
import React, { useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

type Props = {
  title: string;
};

export default function Page({ title }: Props) {
  usePageTitle(title);

  const [currentPasswordErrorMessage, setCurrentPasswordErrorMessage] =
    useState('');
  const [newPasswordErrorMessage, setNewPasswordErrorMessage] = useState('');
  const [confirmPasswordErrorMessage, setConfirmPasswordErrorMessage] =
    useState('');

  const currentPasswordRef = useRef<HTMLInputElement | null>(null);
  const newPasswordRef = useRef<HTMLInputElement | null>(null);
  const confirmPasswordRef = useRef<HTMLInputElement | null>(null);

  const navigate = useNavigate();
  const { changePassword } = useApiUser();
  const { toast } = useToast();

  const { confirmDialog } = useConfirmDialog();

  const updateMutation = useMutation({
    mutationFn: (requestBody: ChangePassword) => changePassword(requestBody),
    onSuccess: () => {
      navigate('/profile');
    },
    onError: (error) => {
      console.error(error);
    },
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const form = new FormData(e.currentTarget);
    const currentPassword = form.get('current-password') as string;
    const newPassword = form.get('new-password') as string;
    const confirmPassword = form.get('confirm-password') as string;

    const isCurrentPasswrdValid = validateCurrentPassword();
    const isNewPasswrdValid = validateNewPassword();
    const isConfirmPasswrdValid = validateConfirmPassword();

    if (
      !isCurrentPasswrdValid ||
      !isNewPasswrdValid ||
      !isConfirmPasswrdValid
    ) {
      return;
    }

    const { isCancel } = await confirmDialog({
      icon: 'question',
      title: '本当に変更しますか？',
      message: 'パスワードを変更します。',
    });
    if (isCancel) return;

    const requestBody: ChangePassword = {
      currentPassword,
      newPassword,
      confirmPassword,
    };
    updateMutation.mutate(requestBody, {
      onSuccess: () => {
        toast({ title: 'パスワードを変更しました' });
      },
      onError: () => {
        toast({
          title: 'パスワードを変更できませんでした',
          description: '入力内容を確認してください。',
          variant: 'destructive',
          duration: 5000,
        });
      },
    });
  };

  const validateCurrentPassword = () => {
    setCurrentPasswordErrorMessage('');
    const password = currentPasswordRef.current?.value as string;

    if (password === '') {
      setCurrentPasswordErrorMessage('パスワードは必須です。');
      return false;
    }

    return true;
  };

  const validateNewPassword = () => {
    setNewPasswordErrorMessage('');
    const password = newPasswordRef.current?.value as string;

    if (password === '') {
      setNewPasswordErrorMessage('パスワードは必須です。');
      return false;
    }

    if (password.length < 4) {
      setNewPasswordErrorMessage('パスワードは4文字以上で設定してください。');
      return false;
    }

    return true;
  };

  const validateConfirmPassword = () => {
    setConfirmPasswordErrorMessage('');
    const newPassword = newPasswordRef.current?.value as string;
    const confirmPassword = confirmPasswordRef.current?.value as string;

    if (newPassword !== confirmPassword) {
      setConfirmPasswordErrorMessage(
        '新しいパスワードと確認用パスワードが一致していません。'
      );
      return false;
    }

    return true;
  };

  return (
    <div className="my-6 flex flex-col place-items-center gap-y-3 sm:my-16">
      <Logo size="lg" disableLink />
      <h1 className="font-semibold">パスワード変更</h1>
      <Card className="w-80 rounded-3xl sm:w-96">
        <CardContent className="p-6 sm:px-10">
          <form
            className="flex w-full flex-col gap-y-4"
            onSubmit={handleSubmit}
          >
            <div>
              <Label className="text-xs" htmlFor="current-password">
                現在のパスワード
              </Label>
              <PasswordInput
                ref={currentPasswordRef}
                className={cn(
                  'my-2 rounded-full',
                  currentPasswordErrorMessage && 'border-destructive'
                )}
                id="current-password"
                name="current-password"
              />
              {currentPasswordErrorMessage && (
                <p className="text-xs text-destructive">
                  {currentPasswordErrorMessage}
                </p>
              )}
            </div>

            <div>
              <Label className="text-xs" htmlFor="new-password">
                新しいパスワード
              </Label>
              <PasswordInput
                ref={newPasswordRef}
                className={cn(
                  'my-2 rounded-full',
                  newPasswordErrorMessage && 'border-destructive'
                )}
                id="new-password"
                name="new-password"
              />
              {newPasswordErrorMessage && (
                <p className="text-xs text-destructive">
                  {newPasswordErrorMessage}
                </p>
              )}
            </div>

            <div>
              <Label className="text-xs" htmlFor="confirm-password">
                新しいパスワード（確認用）
              </Label>
              <PasswordInput
                ref={confirmPasswordRef}
                className={cn(
                  'my-2 rounded-full',
                  confirmPasswordErrorMessage && 'border-destructive'
                )}
                id="confirm-password"
                name="confirm-password"
              />
              {confirmPasswordErrorMessage && (
                <p className="text-xs text-destructive">
                  {confirmPasswordErrorMessage}
                </p>
              )}
            </div>

            <Button
              className="mt-6 w-full rounded-full"
              type="submit"
              disabled={updateMutation.isPending}
            >
              {updateMutation.isPending ? (
                <Loader2Icon className="animate-spin" />
              ) : (
                '変更'
              )}
            </Button>

            <Button
              className="w-full rounded-full bg-transparent"
              type="button"
              variant="outline"
              asChild
            >
              <Link to="/profile">キャンセル</Link>
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
