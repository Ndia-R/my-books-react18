import Pagination from '@/components/pagination';
import { useSearchFilters } from '@/hooks/use-search-filters';

type Props = {
  totalPages: number;
};

export default function SearchPagination({ totalPages }: Props) {
  const { page, updateQueryParams } = useSearchFilters();

  const handleChange = (newPage: number) => {
    updateQueryParams({ page: newPage });
  };

  return (
    <div className="flex justify-center">
      {totalPages > 1 && (
        <Pagination
          total={totalPages}
          page={page}
          onChangePage={handleChange}
        />
      )}
    </div>
  );
}
