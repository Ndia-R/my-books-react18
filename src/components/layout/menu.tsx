import Logo from '@/components/layout/logo';
import NavList from '@/components/layout/nav-list';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { useWindowSize } from '@/hooks/use-window-size';
import { MenuIcon } from 'lucide-react';
import { useState } from 'react';

export default function Menu() {
  const [isOpen, setIsOpen] = useState(false);

  const DEBOUNCED_DELAY = 100;
  const { width } = useWindowSize(DEBOUNCED_DELAY);

  const TABLET_WIDTH = 1024;
  if (isOpen && width >= TABLET_WIDTH) {
    setIsOpen(false);
  }

  return (
    <>
      <div className="hidden lg:flex lg:items-center lg:gap-x-8">
        <Logo />
        <NavList />
      </div>

      <div className="lg:hidden">
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button
              className="rounded-full"
              variant="ghost"
              size="icon"
              aria-label="メニュー"
            >
              <MenuIcon className="size-5" />
            </Button>
          </SheetTrigger>
          <SheetContent className="w-fit p-8" side="left">
            <Logo className="mb-4" onClick={() => setIsOpen(false)} />
            <NavList onClick={() => setIsOpen(false)} />
          </SheetContent>
        </Sheet>
      </div>
    </>
  );
}
