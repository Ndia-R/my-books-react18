import Menu from '@/components/layout/menu';
import ThemeToggleButton from '@/components/layout/theme-toggle-button';
import UserIconButton from '@/components/layout/user-icon-button';
import SearchInput from '@/components/search-input';
import { cn } from '@/lib/utils';

type Props = {
  className?: string;
};

export default function Header({ className }: Props) {
  return (
    <header className={cn('backdrop-blur', className)}>
      <div className="mx-auto max-w-7xl px-3 sm:px-6">
        <div className="delay-0 duration-500 animate-in fade-in-0 slide-in-from-top-10 fill-mode-both">
          <div className="flex h-16 w-full items-center justify-between sm:gap-x-2">
            <Menu />
            <div className="flex">
              <SearchInput />
              <UserIconButton />
              <ThemeToggleButton />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
