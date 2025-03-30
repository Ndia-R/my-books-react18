import Logo from '@/components/layout/logo';
import PasswordInput from '@/components/profile/password-input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useApiUser } from '@/hooks/api/use-api-user';
import { useConfirmDialog } from '@/hooks/use-confirm-dialog';
import { usePageTitle } from '@/hooks/use-page-title';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { useAuth } from '@/providers/auth-provider';
import { ChangeEmail } from '@/types';
import { useMutation } from '@tanstack/react-query';
import { Loader2Icon } from 'lucide-react';
import React, { useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

type Props = {
  title: string;
};

export default function Page({ title }: Props) {
  usePageTitle(title);

  const [emailErrorMessage, setEmailErrorMessage] = useState('');
  const [passwordErrorMessage, setPasswordErrorMessage] = useState('');

  const emailRef = useRef<HTMLInputElement | null>(null);
  const passwordRef = useRef<HTMLInputElement | null>(null);

  const navigate = useNavigate();
  const { changeEmail } = useApiUser();
  const { toast } = useToast();

  const { user, logout } = useAuth();
  const { confirmDialog } = useConfirmDialog();

  const updateMutation = useMutation({
    mutationFn: (requestBody: ChangeEmail) => changeEmail(requestBody),
    onSuccess: async () => {
      await logout();
      navigate('/login');
    },
    onError: (error) => {
      console.error(error);
    },
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const form = new FormData(e.currentTarget);
    const email = form.get('email') as string;
    const password = form.get('password') as string;

    const isEmailValid = validateEmail();
    const isPasswordValid = validatePassword();

    if (!isEmailValid || !isPasswordValid) {
      return;
    }

    const { isCancel } = await confirmDialog({
      icon: 'question',
      title: '本当に変更しますか？',
      message: 'メールアドレス変更後、一度ログアウトします。',
    });
    if (isCancel) return;

    const requestBody: ChangeEmail = { email, password };
    updateMutation.mutate(requestBody, {
      onSuccess: async () => {
        toast({
          title: 'メールアドレスを変更し、ログアウトしました',
          duration: 5000,
        });
      },
      onError: () => {
        toast({
          title: 'メールアドレスを変更できませんでした',
          description: '入力内容を確認してください。',
          variant: 'destructive',
          duration: 5000,
        });
      },
    });
  };

  const validateEmail = () => {
    const email = emailRef.current?.value as string;
    setEmailErrorMessage('');

    if (email === '') {
      setEmailErrorMessage('メールアドレスは必須です。');
      return false;
    }

    const emailRegex = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email)) {
      setEmailErrorMessage('無効なメールアドレスです。');
      return false;
    }

    return true;
  };

  const validatePassword = () => {
    const password = passwordRef.current?.value as string;
    setPasswordErrorMessage('');

    if (password === '') {
      setPasswordErrorMessage('パスワードは必須です。');
      return false;
    }

    return true;
  };

  return (
    <div className="my-6 flex flex-col place-items-center gap-y-3 sm:my-16">
      <Logo size="lg" disableLink />
      <h1 className="font-semibold">メールアドレス変更</h1>
      <Card className="w-80 rounded-3xl sm:w-96">
        <CardContent className="p-6 sm:px-10">
          <form
            className="flex w-full flex-col gap-y-4"
            onSubmit={handleSubmit}
          >
            <div>
              <Label className="text-xs" htmlFor="name">
                現在のメールアドレス
              </Label>
              <p className="my-2 rounded-full border border-transparent px-3 py-2 text-sm">
                {user?.email}
              </p>
            </div>

            <div>
              <Label className="text-xs" htmlFor="name">
                新しいメールアドレス
              </Label>
              <Input
                ref={emailRef}
                className={cn(
                  'my-2 rounded-full',
                  emailErrorMessage && 'border-destructive'
                )}
                id="email"
                name="email"
                autoComplete="off"
                spellCheck="false"
              />
              {emailErrorMessage && (
                <p className="text-xs text-destructive">{emailErrorMessage}</p>
              )}
            </div>

            <div>
              <Label className="text-xs" htmlFor="password">
                現在のパスワード
              </Label>
              <PasswordInput
                ref={passwordRef}
                className={cn(
                  'my-2 rounded-full',
                  passwordErrorMessage && 'border-destructive'
                )}
                id="password"
                name="password"
              />
              {passwordErrorMessage && (
                <p className="text-xs text-destructive">
                  {passwordErrorMessage}
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
