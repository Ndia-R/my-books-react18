import { Toast } from '@/components/ui/toast';
import { ToastEvent } from '@/hooks/use-toast';
import { useCallback, useEffect, useState } from 'react';

export const TOAST_EVENT = 'TOAST_EVENT';

type ToasterToast = {
  id: string;
  title?: string;
  description?: string;
  duration?: number;
  variant?: 'default' | 'destructive';
};

const Toaster = () => {
  const [toasts, setToasts] = useState<ToasterToast[]>([]);

  const addToast = useCallback((detail: ToastEvent) => {
    const newToast: ToasterToast = {
      id: Date.now().toString(),
      title: detail.title,
      description: detail.description,
      variant: detail.variant,
      duration: detail.duration,
    };

    setToasts((currentToasts) => [...currentToasts, newToast]);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((currentToasts) =>
      currentToasts.filter((toast) => toast.id !== id)
    );
  }, []);

  useEffect(() => {
    const handleToastEvent = (event: CustomEvent<ToastEvent>) => {
      addToast(event.detail);
    };
    document.addEventListener(TOAST_EVENT, handleToastEvent as EventListener);
    return () => {
      document.removeEventListener(
        TOAST_EVENT,
        handleToastEvent as EventListener
      );
    };
  }, [addToast]);

  return (
    <div className="pointer-events-none fixed top-0 z-[100] flex max-h-screen w-full flex-col-reverse p-4 sm:bottom-0 sm:right-0 sm:top-auto sm:flex-col md:max-w-[420px]">
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          title={toast.title}
          description={toast.description}
          variant={toast.variant}
          duration={toast.duration}
          onRemove={() => removeToast(toast.id)}
        />
      ))}
    </div>
  );
};

export { Toaster };
