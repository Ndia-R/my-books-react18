import Logo from '@/components/layout/logo';
import AvatarCarousel from '@/components/profile/avatar-carousel';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useApiUser } from '@/hooks/api/use-api-user';
import { usePageTitle } from '@/hooks/use-page-title';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { useAuth } from '@/providers/auth-provider';
import { UpdateCurrentUser } from '@/types';
import { useMutation } from '@tanstack/react-query';
import { Loader2Icon } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

type Props = {
  title: string;
};

export default function Page({ title }: Props) {
  usePageTitle(title);

  const [nameErrorMessage, setNameErrorMessage] = useState('');

  const nameRef = useRef<HTMLInputElement | null>(null);

  const navigate = useNavigate();
  const { updateCurrentUser } = useApiUser();
  const { toast } = useToast();

  const { user, setUser } = useAuth();

  const [avatarPath, setAvatarPath] = useState(user?.avatarPath || '');

  const updateMutation = useMutation({
    mutationFn: (requestBody: UpdateCurrentUser) =>
      updateCurrentUser(requestBody),
    onSuccess: () => {
      navigate('/profile');
    },
    onError: (error) => {
      console.error(error);
    },
  });

  useEffect(() => {
    if (nameRef.current && user) {
      nameRef.current.value = user.name || '';
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const form = new FormData(e.currentTarget);
    const name = form.get('name') as string;

    const isNameValid = validateName();

    if (!isNameValid) {
      return;
    }

    const requestBody: UpdateCurrentUser = { name, avatarPath };
    updateMutation.mutate(requestBody, {
      onSuccess: () => {
        // 名前とアバターURLだけなので楽観的に更新しておく
        const newUser = user ? { ...user, name, avatarPath } : null;
        setUser(newUser);
        toast({ title: 'ユーザー情報を変更しました' });
      },
      onError: () => {
        toast({
          title: 'ユーザー情報を変更できませんでした',
          description: '入力内容を確認してください。',
          variant: 'destructive',
          duration: 5000,
        });
      },
    });
  };

  const validateName = () => {
    const name = nameRef.current?.value as string;
    setNameErrorMessage('');

    if (name === '') {
      setNameErrorMessage('ユーザー名は必須です。');
      return false;
    }

    return true;
  };

  return (
    <div className="my-6 flex flex-col place-items-center gap-y-3 sm:my-16">
      <Logo size="lg" disableLink />
      <h1 className="font-semibold">ユーザー情報変更</h1>
      <Card className="w-80 rounded-3xl sm:w-96">
        <CardContent className="p-6 sm:px-10">
          <form
            className="flex w-full flex-col gap-y-4"
            onSubmit={handleSubmit}
          >
            <div>
              <Label className="text-xs" htmlFor="name">
                ユーザー名
              </Label>
              <Input
                ref={nameRef}
                className={cn(
                  'my-2 rounded-full',
                  nameErrorMessage && 'border-destructive'
                )}
                id="name"
                name="name"
                autoComplete="off"
                spellCheck="false"
              />
              {nameErrorMessage && (
                <p className="text-xs text-destructive">{nameErrorMessage}</p>
              )}
            </div>

            <div>
              <Label className="text-xs" htmlFor="name">
                アバター画像
              </Label>
              <AvatarCarousel value={avatarPath} onChange={setAvatarPath} />
            </div>

            <Button
              className="w-full rounded-full"
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
