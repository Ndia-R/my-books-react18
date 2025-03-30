import CountUpNumber from '@/components/count-up-number';
import { useApiUser } from '@/hooks/api/use-api-user';
import { useSuspenseQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';

export default function ProfileCounts() {
  const { getProfileCounts } = useApiUser();

  const { data: profileCounts } = useSuspenseQuery({
    queryKey: ['getProfileCounts'],
    queryFn: () => getProfileCounts(),
  });

  return (
    <div className="flex justify-between pt-8">
      <div className="delay-0 duration-500 animate-in fade-in-0 slide-in-from-bottom-10 fill-mode-both">
        <Link to={'/favorites'}>
          <div className="w-24 text-center">
            <p className="text-xl font-bold">
              <CountUpNumber end={profileCounts.favoriteCount} delay={300} />
            </p>
            <p className="text-sm">お気に入り</p>
          </div>
        </Link>
      </div>
      <div className="delay-100 duration-500 animate-in fade-in-0 slide-in-from-bottom-10 fill-mode-both">
        <Link to={'/bookmarks'}>
          <div className="w-24 text-center">
            <p className="text-xl font-bold">
              <CountUpNumber end={profileCounts.bookmarkCount} delay={400} />
            </p>
            <p className="text-sm">ブックマーク</p>
          </div>
        </Link>
      </div>
      <div className="delay-200 duration-500 animate-in fade-in-0 slide-in-from-bottom-10 fill-mode-both">
        <Link to={'/my-reviews'}>
          <div className="w-24 text-center">
            <p className="text-xl font-bold">
              <CountUpNumber end={profileCounts.reviewCount} delay={500} />
            </p>
            <p className="text-sm">マイレビュー</p>
          </div>
        </Link>
      </div>
    </div>
  );
}
