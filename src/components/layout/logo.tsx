import { Button } from '@/components/ui/button';
import { TITLE_LOGO } from '@/constants/constants';
import { cn } from '@/lib/utils';
import { Link } from 'react-router-dom';

type Props = {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  disableLink?: boolean;
  onClick?: () => void;
};

export default function Logo({
  className,
  size = 'md',
  disableLink = false,
  onClick,
}: Props) {
  const SIZE = {
    sm: 'text-xl',
    md: 'text-3xl',
    lg: 'text-5xl',
  };

  return (
    <Button
      className={cn(
        "select-none whitespace-nowrap font-['Alfa_Slab_One'] tracking-tighter text-primary hover:bg-transparent",
        disableLink && 'pointer-events-none cursor-default',
        SIZE[size],
        className
      )}
      variant="ghost"
      asChild
    >
      <Link
        to="/"
        aria-label="タイトルロゴ"
        aria-disabled={disableLink}
        onClick={onClick}
      >
        {TITLE_LOGO}
      </Link>
    </Button>
  );
}
