import { TOAST_EVENT } from '@/components/ui/toaster';

export type ToastEvent = {
  title?: string;
  description?: string;
  duration?: number;
  variant?: 'default' | 'destructive';
};

export const useToast = () => {
  const toast = (detail: ToastEvent) => {
    const event = new CustomEvent(TOAST_EVENT, { detail });
    document.dispatchEvent(event);
  };
  return { toast };
};
