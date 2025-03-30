import { cn } from '@/lib/utils';
import { StarHalfIcon, StarIcon } from 'lucide-react';
import { useEffect, useState } from 'react';

type Props = {
  rating: number;
  max?: number;
  readOnly?: boolean;
  onChange?: (rating: number) => void;
};

export default function Rating({
  rating,
  max = 5,
  readOnly = false,
  onChange,
}: Props) {
  // 現在の評価点と表示上の評価点は別で管理
  // 表示上の評価点はマウスでホバーしたときに変化する値として使用する
  const [currentRating, setCurrentRating] = useState(0);
  const [dispRating, setDispRating] = useState(0);

  useEffect(() => {
    const initRating = rating > max ? max : rating;
    setDispRating(initRating);
    setCurrentRating(initRating);
  }, [max, rating]);

  const handleMouseClick = (newDispRating: number) => {
    if (readOnly) return;

    setDispRating(newDispRating);
    setCurrentRating(newDispRating);
    if (onChange) {
      onChange(newDispRating);
    }
  };

  const handleMouseEnter = (newDispRating: number) => {
    if (readOnly) return;
    setDispRating(newDispRating);
  };

  const handleMouseLeave = () => {
    if (readOnly) return;
    setDispRating(currentRating);
  };

  return (
    <div className="flex h-10 items-center text-foreground">
      <div
        className={cn(
          'w-8',
          currentRating !== dispRating
            ? 'text-muted-foreground/50'
            : 'text-muted-foreground',
          !readOnly && 'cursor-pointer'
        )}
        onClick={() => handleMouseClick(0)}
        onMouseEnter={() => handleMouseEnter(0)}
        onMouseLeave={() => handleMouseLeave()}
      >
        {dispRating.toFixed(1)}
      </div>

      <div className="relative">
        <div className="flex">
          {[...Array<number>(max)].map((_, index) => (
            <StarIcon
              key={index}
              style={{ fill: 'hsl(var(--foreground) / 0.1)' }}
              strokeWidth={0}
            />
          ))}
        </div>

        <div className="absolute left-0 top-0 flex">
          {[...Array<number>(Math.floor(dispRating))].map((_, index) => (
            <StarIcon
              key={index}
              style={{ fill: 'hsl(var(--primary))' }}
              strokeWidth={0}
            />
          ))}
          {dispRating % 1 >= 0.5 && (
            <StarHalfIcon
              style={{ fill: 'hsl(var(--primary))' }}
              strokeWidth={0}
            />
          )}
        </div>

        <div className="absolute left-0 top-0 flex">
          {[...Array<number>(max)].map((_, index) => (
            <div className="flex" key={index}>
              <div
                className={cn(
                  'w-3 h-6 bg-transparent',
                  !readOnly && 'cursor-pointer'
                )}
                onClick={() => handleMouseClick(index + 1 - 0.5)}
                onMouseEnter={() => handleMouseEnter(index + 1 - 0.5)}
                onMouseLeave={() => handleMouseLeave()}
              />
              <div
                className={cn(
                  'w-3 h-6 bg-transparent',
                  !readOnly && 'cursor-pointer'
                )}
                onClick={() => handleMouseClick(index + 1)}
                onMouseEnter={() => handleMouseEnter(index + 1)}
                onMouseLeave={() => handleMouseLeave()}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
