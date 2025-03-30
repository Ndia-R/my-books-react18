import BookmarkList from '@/components/bookmarks/bookmark-list';
import SearchPagination from '@/components/search-pagination';
import { useApiBookmark } from '@/hooks/api/use-api-bookmark';
import { BookmarkRequest } from '@/types';
import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';

type Props = {
  page: number;
};

export default function Bookmarks({ page }: Props) {
  const navigate = useNavigate();
  const { getBookmarkPage, updateBookmark, deleteBookmark } = useApiBookmark();

  const { data: bookmarkPage } = useSuspenseQuery({
    queryKey: ['getBookmarkPage', page],
    queryFn: () => getBookmarkPage(page),
  });

  const queryClient = useQueryClient();

  const onSuccess = () => {
    queryClient.invalidateQueries({ queryKey: ['getBookmarkPage', page] });
    navigate('/bookmarks');
  };

  const onError = (error: Error) => {
    console.error(error);
  };

  const updateMutation = useMutation({
    mutationFn: ({
      id,
      requestBody,
    }: {
      id: number;
      requestBody: BookmarkRequest;
    }) => updateBookmark(id, requestBody),
    onSuccess,
    onError,
  });

  const deleteMutation = useMutation({
    mutationFn: (bookmarkId: number) => deleteBookmark(bookmarkId),
    onSuccess,
    onError,
  });

  return (
    <div className="flex flex-col gap-y-4 pb-4">
      <p className="text-right">
        {bookmarkPage.totalItems}
        <span className="ml-1 mr-4 text-sm text-muted-foreground">件</span>
      </p>
      <BookmarkList
        bookmarks={bookmarkPage.bookmarks}
        updateMutation={updateMutation}
        deleteMutation={deleteMutation}
      />
      <SearchPagination totalPages={bookmarkPage.totalPages} />
    </div>
  );
}
