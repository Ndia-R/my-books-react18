import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { AVATAR_IMAGE_BASE_URL } from '@/constants/constants';
import { useApiUser } from '@/hooks/api/use-api-user';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { useAuth } from '@/providers/auth-provider';
import { useMutation } from '@tanstack/react-query';
import {
  BookmarkIcon,
  HeartIcon,
  LogOutIcon,
  MessageSquareIcon,
  UserRoundIcon,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

const MENU_LIST = [
  { href: '/favorites', title: 'お気に入り', icon: HeartIcon },
  { href: '/bookmarks', title: 'ブックマーク', icon: BookmarkIcon },
  { href: '/my-reviews', title: 'マイレビュー', icon: MessageSquareIcon },
  { href: '/profile', title: 'プロフィール', icon: UserRoundIcon },
];

export default function UserIconButton() {
  const [isOpen, setIsOpen] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const pathname = location.pathname;

  const { accessToken, user, setUser, logout } = useAuth();
  const { getCurrentUser } = useApiUser();
  const { toast } = useToast();

  const logoutMutation = useMutation({
    mutationFn: () => logout(),
    onError: (error) => {
      console.error(error);
    },
  });

  useEffect(() => {
    const init = async () => {
      if (accessToken && !user) {
        const currentUser = await getCurrentUser();
        setUser(currentUser);
      }
    };
    init();
  }, [accessToken, getCurrentUser, setUser, user]);

  const handleClickLogout = async () => {
    logoutMutation.mutate(undefined, {
      onSuccess: () => {
        toast({ title: 'ログアウトしました' });
        setIsOpen(false);
        navigate('/');
      },
    });
  };

  const handleClickMenuItem = (href: string) => {
    navigate(href);
    setIsOpen(false);
  };

  if (!user)
    return (
      <Button className="rounded-full" variant="ghost" asChild>
        <Link to="/login" state={{ from: location }}>
          ログイン
        </Link>
      </Button>
    );

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger
        className="ml-2 flex items-center justify-center"
        asChild
      >
        <Button
          className="rounded-full"
          variant="ghost"
          size="icon"
          aria-label="アバター画像"
        >
          <Avatar>
            <AvatarImage
              className="bg-primary/50"
              src={AVATAR_IMAGE_BASE_URL + user.avatarPath}
              alt="avatar-image"
            />
            <AvatarFallback className="text-lg font-semibold">
              {user.name.slice(0, 1)}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-48 p-2" side="bottom" align="end">
        <DropdownMenuLabel>
          <div className="flex items-center gap-x-2">
            <Avatar className="size-8">
              <AvatarImage
                className="bg-primary/50"
                src={AVATAR_IMAGE_BASE_URL + user.avatarPath}
                alt="avatar-image"
              />
              <AvatarFallback className="font-semibold">
                {user.name.slice(0, 1)}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 overflow-hidden">
              <p className="truncate">{user.name}</p>
              <p className="truncate text-xs font-normal text-muted-foreground">
                {user.email}
              </p>
            </div>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {MENU_LIST.map((item) => (
          <DropdownMenuItem
            className={cn(
              pathname !== '/' && item.href.includes(pathname) && 'text-primary'
            )}
            key={item.href}
            onClick={() => handleClickMenuItem(item.href)}
          >
            <item.icon className="mr-1" />
            {item.title}
          </DropdownMenuItem>
        ))}
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleClickLogout}>
          <LogOutIcon className="mr-1" />
          ログアウト
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
