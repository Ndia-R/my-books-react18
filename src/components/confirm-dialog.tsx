import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import {
  CONFIRM_DIALOG_EVENT,
  ConfirmDialogOptions,
} from '@/hooks/use-confirm-dialog';
import { cn } from '@/lib/utils';
import {
  AlertTriangleIcon,
  CheckCircle2Icon,
  HelpCircleIcon,
  InfoIcon,
} from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

const ICON_COMPONENTS = {
  info: InfoIcon,
  question: HelpCircleIcon,
  warning: AlertTriangleIcon,
  check: CheckCircle2Icon,
};

const DEFAULT_OPTION_VALUE: ConfirmDialogOptions = {
  icon: 'info',
  title: '',
  message: '',
  actionLabel: 'OK',
  actionOnly: false,
  persistent: false,
  showInput: false,
  inputLabel: '',
  inputPlaceholder: '',
  inputRows: 1,
};

export default function ConfirmDialog() {
  const [isOpen, setIsOpen] = useState(false);
  const [options, setOptions] =
    useState<ConfirmDialogOptions>(DEFAULT_OPTION_VALUE);
  const [isPersistentAnimation, setIsPersistentAnimation] = useState(false);

  const refTextarea = useRef<HTMLTextAreaElement>(null);

  const IconComponent = ICON_COMPONENTS[options.icon];

  // hooksから呼ぶためにイベントリスナー登録
  useEffect(() => {
    const handleEvent = (event: CustomEvent<ConfirmDialogOptions>) => {
      setIsOpen(true);
      setOptions({ ...DEFAULT_OPTION_VALUE, ...event.detail });
    };
    document.addEventListener(
      CONFIRM_DIALOG_EVENT,
      handleEvent as EventListener
    );
    return () => {
      document.removeEventListener(
        CONFIRM_DIALOG_EVENT,
        handleEvent as EventListener
      );
    };
  }, []);

  const handleCloseDialog = () => {
    // アニメーションフラグ（閉じれないことを伝えるためにぶるっとする）
    if (options.persistent) {
      setIsPersistentAnimation(true);
      setTimeout(() => {
        setIsPersistentAnimation(false);
      }, 50);
      return;
    }
    handleClickCancel();
  };

  const handleClickAction = () => {
    setIsOpen(false);
    options.resolve?.({
      isAction: true,
      isCancel: false,
      text: refTextarea.current?.value || '',
    });
  };

  const handleClickCancel = () => {
    setIsOpen(false);
    options.resolve?.({
      isAction: false,
      isCancel: true,
      text: '',
    });
  };

  return (
    <Dialog open={isOpen}>
      <DialogContent
        className={cn(
          'w-[360px] sm:w-[400px] transition-transform ease-in-out [transition-duration:25ms]',
          isPersistentAnimation && 'scale-[1.02] transform'
        )}
        onEscapeKeyDown={handleCloseDialog}
        onPointerDownOutside={handleCloseDialog}
      >
        <DialogHeader>
          <DialogTitle className="my-2 flex items-center">
            <IconComponent
              className={cn(
                'mr-3 min-w-fit',
                options.icon === 'warning' && 'text-destructive'
              )}
            />
            <p className="leading-6">{options.title}</p>
          </DialogTitle>
          {options.message && (
            <DialogDescription className="pt-2 text-left">
              {options.message}
            </DialogDescription>
          )}
        </DialogHeader>

        {options.showInput && (
          <div className="mb-4 grid w-full items-center gap-1.5">
            <p className="text-xs">{options.inputLabel}</p>
            <Textarea
              ref={refTextarea}
              className="min-h-4 resize-none"
              placeholder={options.inputPlaceholder}
              rows={options.inputRows}
            />
          </div>
        )}

        <DialogFooter className="flex justify-end gap-y-4 sm:gap-y-0">
          {!options.actionOnly && (
            <Button
              className="min-w-24 rounded-full"
              variant="ghost"
              onClick={handleClickCancel}
            >
              キャンセル
            </Button>
          )}
          <Button
            className="min-w-24 rounded-full"
            variant={options.icon === 'warning' ? 'destructive' : 'default'}
            onClick={handleClickAction}
          >
            {options.actionLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
