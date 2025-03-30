import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useSearchFilters } from '@/hooks/use-search-filters';

const CONDITION_LIST = [
  { text: '単一選択', value: 'SINGLE' },
  { text: 'AND条件', value: 'AND' },
  { text: 'OR条件', value: 'OR' },
];

export default function GenresConditionSelector() {
  const { genreIds, condition, updateQueryParams } = useSearchFilters();

  const handleChange = (condition: string) => {
    // SINGLE選択以外は複数ジャンル選択可能OKだが
    // SINGLE選択の場合、複数ジャンルの中の最初の値（単一の値）とする
    const ids = condition === 'SINGLE' ? genreIds.split(',')[0] : undefined;
    updateQueryParams({ genreIds: ids, condition, page: 1 });
  };

  return (
    <RadioGroup
      className="flex gap-x-4"
      value={condition}
      onValueChange={handleChange}
    >
      {CONDITION_LIST.map((item) => (
        <div
          className="flex flex-col-reverse items-center sm:flex-row"
          key={item.value}
        >
          <RadioGroupItem value={item.value} id={item.value} />
          <Label
            className="cursor-pointer select-none p-2 text-xs sm:text-sm"
            htmlFor={item.value}
          >
            {item.text}
          </Label>
        </div>
      ))}
    </RadioGroup>
  );
}
