import GenreList from '@/components/genres/genre-list';
import { useApiGenre } from '@/hooks/api/use-api-genre';
import { useSearchFilters } from '@/hooks/use-search-filters';
import { useSuspenseQuery } from '@tanstack/react-query';

export default function GenresSelector() {
  const { genreIds, condition, updateQueryParams } = useSearchFilters();
  const { getGenres } = useApiGenre();

  const { data: genres } = useSuspenseQuery({
    queryKey: ['getGenres'],
    queryFn: () => getGenres(),
  });

  // クエリ文字列から配列へ
  const selectedGenreIds = genreIds
    .split(',')
    .map((genreId) => Number(genreId));

  const handleClick = (genreId: number) => {
    let newGenreIds = selectedGenreIds.includes(genreId)
      ? selectedGenreIds.filter((id) => id !== genreId)
      : [...selectedGenreIds, genreId].sort((a, b) => a - b);

    // 最後の一つをクリックした場合、空配列になるので必ず１つは選択になるようにする
    // SINGLE選択に関しては必ず１つの選択になる
    if (newGenreIds.length === 0 || condition === 'SINGLE') {
      newGenreIds = [genreId];
    }
    updateQueryParams({ genreIds: newGenreIds.join(','), page: 1 });
  };

  return (
    <GenreList
      genres={genres}
      activeIds={selectedGenreIds}
      onClick={handleClick}
    />
  );
}
