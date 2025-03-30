import BookmarkItem from '@/components/bookmarks/bookmark-item';
import {
  Bookmark,
  BookmarkCreateMutation,
  BookmarkDeleteMutation,
  BookmarkUpdateMutation,
} from '@/types';

type Props = {
  bookmarks: Bookmark[];
  createMutation?: BookmarkCreateMutation;
  updateMutation?: BookmarkUpdateMutation;
  deleteMutation?: BookmarkDeleteMutation;
};

export default function BookmarkList({
  bookmarks,
  createMutation,
  updateMutation,
  deleteMutation,
}: Props) {
  return (
    <ul className="flex flex-col gap-y-2">
      {bookmarks.map((bookmark) => (
        <li key={bookmark.id}>
          <article>
            <BookmarkItem
              bookmark={bookmark}
              createMutation={createMutation}
              updateMutation={updateMutation}
              deleteMutation={deleteMutation}
            />
          </article>
        </li>
      ))}
    </ul>
  );
}
