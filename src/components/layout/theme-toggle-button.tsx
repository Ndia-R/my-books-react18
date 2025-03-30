import { Button } from '@/components/ui/button';
import { useTheme } from '@/providers/theme-provider';
import { MoonIcon, SunIcon } from 'lucide-react';

export default function ThemeToggleButton() {
  const { theme, setTheme } = useTheme();

  const handleClick = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  return (
    <Button
      className="rounded-full"
      variant="ghost"
      size="icon"
      aria-label={
        theme === 'light' ? 'ダークモードに切り替え' : 'ライトモードに切り替え'
      }
      onClick={handleClick}
    >
      {theme === 'light' ? (
        <MoonIcon className="size-4" />
      ) : (
        <SunIcon className="size-4" />
      )}
    </Button>
  );
}
