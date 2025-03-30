import Logo from '@/components/layout/logo';
import AvatarCarousel from '@/components/profile/avatar-carousel';
import PasswordInput from '@/components/profile/password-input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { useApiUser } from '@/hooks/api/use-api-user';
import { usePageTitle } from '@/hooks/use-page-title';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { useAuth } from '@/providers/auth-provider';
import { SignupRequest } from '@/types';
import { useMutation } from '@tanstack/react-query';
import { Loader2Icon } from 'lucide-react';
import { useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

type Props = {
  title: string;
};

export default function Page({ title }: Props) {
  usePageTitle(title);

  const [emailErrorMessage, setEmailErrorMessage] = useState('');
  const [passwordErrorMessage, setPasswordErrorMessage] = useState('');
  const [nameErrorMessage, setNameErrorMessage] = useState('');

  const emailRef = useRef<HTMLInputElement | null>(null);
  const passwordRef = useRef<HTMLInputElement | null>(null);
  const nameRef = useRef<HTMLInputElement | null>(null);
  const [avatarPath, setAvatarPath] = useState('');

  const navigate = useNavigate();
  const { signup, setUser } = useAuth();
  const { getCurrentUser } = useApiUser();
  const { toast } = useToast();

  const signupMutation = useMutation({
    mutationFn: (requestBody: SignupRequest) => signup(requestBody),
    onSuccess: async () => {
      const user = await getCurrentUser();
      setUser(user);
      navigate('/');
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
    const name = form.get('name') as string;

    const isEmailvalid = validateEmail();
    const isPasswordvalid = validatePassword();
    const isNamevalid = validateName();

    if (!isEmailvalid || !isPasswordvalid || !isNamevalid) {
      return;
    }

    const requestBody: SignupRequest = { email, password, name, avatarPath };
    signupMutation.mutate(requestBody, {
      onSuccess: () => {},
      onError: () => {
        toast({
          title: '新規登録できませんでした',
          description: '入力内容を確認してください。',
          variant: 'destructive',
          duration: 5000,
        });
      },
    });
  };

  const validateEmail = () => {
    setEmailErrorMessage('');

    const email = emailRef.current?.value as string;

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
    setPasswordErrorMessage('');

    const password = passwordRef.current?.value as string;

    if (password === '') {
      setPasswordErrorMessage('パスワードは必須です。');
      return false;
    }

    if (password.length < 4) {
      setPasswordErrorMessage('パスワードは4文字以上で設定してください。');
      return false;
    }

    return true;
  };

  const validateName = () => {
    setNameErrorMessage('');

    const name = nameRef.current?.value as string;

    if (name === '') {
      setNameErrorMessage('ユーザー名は必須です。');
      return false;
    }

    return true;
  };

  return (
    <div className="my-3 flex flex-col place-items-center gap-y-3 sm:my-16">
      <Logo size="lg" disableLink />
      <h1 className="font-semibold">アカウントの作成</h1>
      <Card className="w-80 rounded-3xl sm:w-96">
        <CardContent className="p-6 sm:px-10">
          <form
            className="flex w-full flex-col gap-y-4"
            onSubmit={handleSubmit}
          >
            <div>
              <Label className="text-xs" htmlFor="email">
                メールアドレス
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
                パスワード
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

            <Separator className="mb-2 mt-6 bg-foreground/10" />

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
              className="mt-2 w-full rounded-full"
              type="submit"
              disabled={signupMutation.isPending}
            >
              {signupMutation.isPending ? (
                <Loader2Icon className="animate-spin" />
              ) : (
                '新規登録'
              )}
            </Button>
          </form>

          <div className="mt-6 flex justify-center gap-x-1 text-xs">
            <p className="text-muted-foreground">アカウントをお持ちですか？</p>
            <Link to={'/login'}>
              <p className="text-primary hover:underline">ログイン</p>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
