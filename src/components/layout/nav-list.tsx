import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Link, useLocation } from 'react-router-dom';

const NAV_LIST = [
  {
    href: '/discover?genreIds=1&condition=SINGLE',
    title: 'ジャンル',
  },
  { href: '/ranking', title: 'ランキング' },
  { href: '/special-features', title: '特集' },
];

type Props = {
  onClick?: () => void;
};

export default function NavList({ onClick }: Props) {
  const location = useLocation();

  return (
    <nav>
      <ul className="flex flex-col gap-y-2 lg:flex-row">
        {NAV_LIST.map((item) => (
          <li className="w-full" key={item.href}>
            <Button
              className={cn(
                'rounded-full w-full hover:bg-transparent hover:text-foreground/50',
                location.pathname !== '/' &&
                  item.href.includes(location.pathname) &&
                  'text-primary'
              )}
              variant="ghost"
              asChild
            >
              <Link to={item.href} onClick={onClick}>
                {item.title}
              </Link>
            </Button>
          </li>
        ))}
      </ul>
    </nav>
  );
}
