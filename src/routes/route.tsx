import BookDetailPage from '@/routes/book/[bookId]/page';
import BookmarksPage from '@/routes/bookmarks/page';
import DiscoverPage from '@/routes/discover/page';
import FavoritesPage from '@/routes/favorites/page';
import RootLayout from '@/routes/layout';
import LoginPage from '@/routes/login/page';
import MyReviewsPage from '@/routes/my-reviews/page';
import NotFoundPage from '@/routes/not-found';
import RootPage from '@/routes/page';
import ChangeEmailPage from '@/routes/profile/change-email/page';
import ChangePasswordPage from '@/routes/profile/change-password/page';
import ChangeUserInfoPage from '@/routes/profile/change-user-info/page';
import ProfilePage from '@/routes/profile/page';
import ProtectedRoute from '@/routes/protected-route';
import RankingPage from '@/routes/ranking/page';
import BookReadPage from '@/routes/read/[bookId]/chapter/[chapterNumber]/page/[pageNumber]/page';
import BookReadTableOfContentsPage from '@/routes/read/[bookId]/table-of-contents/page';
import SearchPage from '@/routes/search/page';
import SignupPage from '@/routes/signup/page';
import SpecialFeaturesPage from '@/routes/special-features/page';
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
} from 'react-router-dom';

export const router = createBrowserRouter(
  createRoutesFromElements(
    <Route>
      <Route path="/" element={<RootLayout />}>
        <Route index element={<RootPage />} />

        <Route path="login" element={<LoginPage title="ログイン" />} />
        <Route path="signup" element={<SignupPage title="サインアップ" />} />

        <Route path="book">
          <Route path=":bookId" element={<BookDetailPage />} />
        </Route>

        <Route path="read">
          <Route path=":bookId">
            <Route
              path="table-of-contents"
              element={<BookReadTableOfContentsPage />}
            />
          </Route>
        </Route>

        <Route path="search" element={<SearchPage />} />
        <Route path="discover" element={<DiscoverPage title="ジャンル" />} />
        <Route path="ranking" element={<RankingPage title="ランキング" />} />
        <Route
          path="special-features"
          element={<SpecialFeaturesPage title="特集" />}
        />

        {/* 以下、認証が必要な画面 */}
        <Route element={<ProtectedRoute />}>
          <Route
            path="favorites"
            element={<FavoritesPage title="お気に入り" />}
          />
          <Route
            path="bookmarks"
            element={<BookmarksPage title="ブックマーク" />}
          />
          <Route
            path="my-reviews"
            element={<MyReviewsPage title="マイレビュー" />}
          />

          <Route path="profile">
            <Route index element={<ProfilePage title="プロフィール" />} />
            <Route
              path="change-user-info"
              element={<ChangeUserInfoPage title="ユーザー情報変更" />}
            />
            <Route
              path="change-email"
              element={<ChangeEmailPage title="メールアドレス変更" />}
            />
            <Route
              path="change-password"
              element={<ChangePasswordPage title="パスワード変更" />}
            />
          </Route>

          <Route path="read/:bookId">
            <Route path="chapter/:chapterNumber">
              <Route path="page/:pageNumber" element={<BookReadPage />} />
            </Route>
          </Route>
        </Route>

        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Route>
  )
);
