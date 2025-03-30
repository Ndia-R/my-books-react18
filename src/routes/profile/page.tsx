import Logo from '@/components/layout/logo';
import ProfileCounts from '@/components/profile/profile-counts';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { AVATAR_IMAGE_BASE_URL } from '@/constants/constants';
import { usePageTitle } from '@/hooks/use-page-title';
import { useAuth } from '@/providers/auth-provider';
import ErrorElement from '@/routes/error-element';
import { KeyRoundIcon, MailIcon, UserRoundPenIcon } from 'lucide-react';
import { Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { Link } from 'react-router-dom';

type Props = {
  title: string;
};

export default function Page({ title }: Props) {
  usePageTitle(title);

  const { user } = useAuth();

  if (!user) return null;

  return (
    <div className="my-6 flex flex-col place-items-center gap-y-3 sm:my-16">
      <Logo size="lg" disableLink />
      <h1 className="font-semibold">プロフィール</h1>

      <Card className="w-80 overflow-hidden rounded-3xl sm:w-96">
        <CardHeader className="h-80 w-full bg-gradient-to-tr from-secondary to-primary px-2 sm:px-6">
          <div className="flex flex-col items-center pt-8">
            <Avatar className="mb-4 size-24">
              <AvatarImage
                className="bg-primary"
                src={AVATAR_IMAGE_BASE_URL + user.avatarPath}
                alt="avatar-image"
              />
              <AvatarFallback className="bg-primary text-5xl font-semibold">
                {user.name.slice(0, 1)}
              </AvatarFallback>
            </Avatar>
            <p className="text-xl font-semibold">{user.name}</p>
            <p className="text-sm">{user.email}</p>
          </div>

          <ErrorBoundary fallback={<ErrorElement />}>
            <Suspense fallback={null}>
              <ProfileCounts />
            </Suspense>
          </ErrorBoundary>
        </CardHeader>

        <CardContent className="relative p-6">
          <ul>
            <li className="flex items-center p-2">
              <UserRoundPenIcon className="mr-4" />
              <p>ユーザー情報</p>
              <div className="flex-1"></div>
              <Button
                className="rounded-full bg-transparent"
                variant="outline"
                asChild
              >
                <Link to="/profile/change-user-info">変更</Link>
              </Button>
            </li>
            <li className="flex items-center p-2">
              <MailIcon className="mr-4" />
              <p>メールアドレス</p>
              <div className="flex-1"></div>
              <Button
                className="rounded-full bg-transparent"
                variant="outline"
                asChild
              >
                <Link to="/profile/change-email">変更</Link>
              </Button>
            </li>
            <li className="flex items-center p-2">
              <KeyRoundIcon className="mr-4" />
              <p>パスワード</p>
              <div className="flex-1"></div>
              <Button
                className="rounded-full bg-transparent"
                variant="outline"
                asChild
              >
                <Link to="/profile/change-password">変更</Link>
              </Button>
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
