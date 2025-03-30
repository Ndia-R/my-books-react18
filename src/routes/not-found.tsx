import notFoundImage from '@/assets/not-found.webp';
import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="flex h-[calc(100vh-64px-140px)] flex-col items-center justify-center gap-y-4 sm:h-[calc(100vh-64px-72px)]">
      <img className="opacity-50" src={notFoundImage} alt="not-found-image" />
      <h1 className="text-4xl font-bold">404 Not Found</h1>
      <p>お探しのページは見つかりませんでした。</p>
      <Link to="/" className="text-primary underline">
        ホームに戻る
      </Link>
    </div>
  );
}
