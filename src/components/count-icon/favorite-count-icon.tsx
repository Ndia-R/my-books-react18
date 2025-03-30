import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { useApiFavorite } from '@/hooks/api/use-api-favorite';
import { cn } from '@/lib/utils';
import { useAuth } from '@/providers/auth-provider';
import { FavoriteInfo, FavoriteRequest } from '@/types';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { HeartIcon } from 'lucide-react';

const BUTTON_SIZE = { sm: 'size-6', md: 'size-8' };
const ICON_SIZE = { sm: 'size-3', md: 'size-4' };
const TEXT_SIZE = { sm: 'text-xs', md: 'text-sm' };

type Props = {
  bookId: string;
  size?: 'sm' | 'md';
  showCount?: boolean;
};

export default function FavoriteCountIcon({
  bookId,
  size = 'md',
  showCount = false,
}: Props) {
  const { user } = useAuth();
  const { getFavoriteInfo, createFavorite, deleteFavorite } = useApiFavorite();

  const queryClient = useQueryClient();

  const queryKey = ['getFavoriteInfo', bookId, user?.id];
  const { data: favoriteInfo = { isFavorite: false, favoriteCount: 0 } } =
    useQuery({
      queryKey,
      queryFn: () => getFavoriteInfo(bookId, user?.id),
    });

  const {
    mutate: toggleMutation,
    variables,
    isPending,
  } = useMutation({
    mutationFn: async (newFavorite: FavoriteInfo) => {
      if (newFavorite.isFavorite) {
        const requestBody: FavoriteRequest = { bookId };
        await createFavorite(requestBody);
      } else {
        await deleteFavorite(bookId);
      }
    },
    onMutate: async (newFavoriteInfo: FavoriteInfo) => {
      await queryClient.cancelQueries({ queryKey });
      const previousFavoriteInfo = queryClient.getQueryData(queryKey);
      queryClient.setQueryData(queryKey, newFavoriteInfo);
      return { previousFavoriteInfo };
    },
    onSettled: (_newFavoriteInfo, error, _variables, context) => {
      if (error) {
        queryClient.setQueryData(queryKey, context?.previousFavoriteInfo);
      }
      queryClient.invalidateQueries({ queryKey });
    },
    onError: (error) => {
      console.error(error);
    },
  });

  const handleClick = () => {
    if (!user) return;

    const newFavoriteInfo: FavoriteInfo = {
      isFavorite: !favoriteInfo.isFavorite,
      favoriteCount: favoriteInfo.isFavorite
        ? favoriteInfo.favoriteCount - 1
        : favoriteInfo.favoriteCount + 1,
    };
    toggleMutation(newFavoriteInfo);
  };

  const optimisticData = isPending ? variables : favoriteInfo;

  return (
    <div className="flex items-center text-muted-foreground">
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            className={cn(
              'rounded-full text-muted-foreground',
              BUTTON_SIZE[size],
              optimisticData?.isFavorite && 'text-primary bg-transparent'
            )}
            variant="ghost"
            size="icon"
            aria-label={
              optimisticData?.isFavorite
                ? 'お気に入りから削除'
                : 'お気に入りに追加'
            }
            onClick={handleClick}
          >
            <HeartIcon
              className={ICON_SIZE[size]}
              style={{
                fill: optimisticData?.isFavorite ? 'hsl(var(--primary))' : '',
              }}
            />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          {user
            ? optimisticData?.isFavorite
              ? 'お気に入りから削除'
              : 'お気に入りに追加'
            : 'ログインしてこの本を「お気に入り」に加えましょう'}
        </TooltipContent>
      </Tooltip>

      {showCount && (
        <div className={cn('flex min-w-4 justify-center', TEXT_SIZE[size])}>
          {optimisticData?.favoriteCount}
        </div>
      )}
    </div>
  );
}
