import Logo from '@/components/layout/logo';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import {
  FacebookIcon,
  InstagramIcon,
  TwitterIcon,
  YoutubeIcon,
} from 'lucide-react';
import { Link } from 'react-router-dom';

const SNS_LIST = [
  { label: 'Youtube', icon: YoutubeIcon, url: 'https://www.youtube.com' },
  { label: 'Twitter', icon: TwitterIcon, url: 'https://x.com' },
  { label: 'Instagram', icon: InstagramIcon, url: 'https://www.instagram.com' },
  { label: 'Facebook', icon: FacebookIcon, url: 'https://www.facebook.com' },
];

type Props = {
  className?: string;
};

export default function Footer({ className }: Props) {
  return (
    <footer className={cn('bg-card', className)}>
      <div className="mx-auto max-w-7xl px-3 sm:px-6">
        <div className="flex flex-col items-center justify-between py-4 sm:flex-row">
          <ul className="flex">
            {SNS_LIST.map((item) => (
              <li key={item.label}>
                <Button
                  className="rounded-full"
                  variant="ghost"
                  size="icon"
                  asChild
                >
                  <Link
                    to={item.url}
                    aria-label={item.label}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <item.icon className="size-5" />
                  </Link>
                </Button>
              </li>
            ))}
          </ul>
          <p className="flex h-7 items-center text-sm">© 2025 Xxxxx, Inc.</p>
          <Logo size="sm" />
        </div>
      </div>
    </footer>
  );
}
