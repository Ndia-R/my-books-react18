import ConfirmDialog from '@/components/confirm-dialog';
import Footer from '@/components/layout/footer';
import Header from '@/components/layout/header';
import { Toaster } from '@/components/ui/toaster';
import { Outlet, ScrollRestoration } from 'react-router-dom';

export default function Layout() {
  return (
    <>
      <div className="fixed inset-0 -z-50 min-h-dvh bg-gradient-to-tr from-primary/10 via-background via-80% to-primary/15"></div>

      <div className="min-h-dvh">
        <Header className="fixed z-50 w-screen" />
        <main className="mx-auto max-w-7xl px-3 pt-16 sm:px-6">
          <Outlet />
        </main>
        <Footer className="sticky top-full" />
      </div>
      <Toaster />
      <ConfirmDialog />
      <ScrollRestoration />
    </>
  );
}
