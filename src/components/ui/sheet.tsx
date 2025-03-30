import { cn } from '@/lib/utils';
import React, {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import ReactDOM from 'react-dom';

type SheetSideType = 'top' | 'right' | 'bottom' | 'left';

const DEFAULT_SIDE: SheetSideType = 'right';

interface SheetContextType {
  isOpen: boolean;
  openSheet: () => void;
  closeSheet: () => void;
}

const SheetContext = React.createContext<SheetContextType | undefined>(
  undefined
);

// ----------------------------------------------------------------------------
// Sheet
// ----------------------------------------------------------------------------
interface SheetProps extends React.HTMLAttributes<HTMLDivElement> {
  open?: boolean;
  onOpenChange?: (isOpen: boolean) => void;
}

const Sheet = ({ children, open, onOpenChange }: SheetProps) => {
  // 外部からの状態を優先し、指定がない場合は内部状態を利用
  const [isOpen, setIsOpen] = useState(open ?? false);

  // propsが更新されたら内部状態も更新
  useEffect(() => {
    if (open !== undefined) {
      setIsOpen(open);
    }
  }, [open]);

  const openSheet = useCallback(() => {
    if (onOpenChange) {
      onOpenChange(true);
    } else {
      setIsOpen(true);
    }
  }, [onOpenChange]);

  const closeSheet = useCallback(() => {
    if (onOpenChange) {
      onOpenChange(false);
    } else {
      setIsOpen(false);
    }
  }, [onOpenChange]);

  return (
    <SheetContext.Provider value={{ isOpen, openSheet, closeSheet }}>
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child)) {
          switch (child.type) {
            case SheetTrigger:
            case SheetContent:
              return child;
            default:
              return null;
          }
        }
      })}
    </SheetContext.Provider>
  );
};

// ----------------------------------------------------------------------------
// SheetTrigger
// ----------------------------------------------------------------------------
interface SheetTriggerProps extends React.HTMLAttributes<HTMLButtonElement> {
  asChild?: boolean;
}
const SheetTrigger = React.forwardRef<HTMLButtonElement, SheetTriggerProps>(
  ({ children, asChild = false, ...props }, ref) => {
    const context = useContext(SheetContext);
    if (!context) throw new Error('SheetTrigger must be used within Sheet');

    const { openSheet } = context;

    if (asChild && React.isValidElement(children)) {
      const mergeChildProps = {
        ...children.props,
        onClick: (e: React.MouseEvent) => {
          children.props.onClick?.(e);
          openSheet();
        },
      };
      return React.cloneElement(children, { ...mergeChildProps, ref });
    }

    const mergeProps = {
      ...props,
      onClick: (e: React.MouseEvent<HTMLButtonElement>) => {
        props.onClick?.(e);
        openSheet();
      },
    };

    return (
      <button ref={ref} {...mergeProps}>
        {children}
      </button>
    );
  }
);

// ----------------------------------------------------------------------------
// SheetOverlay
// ----------------------------------------------------------------------------
type SheetOverlayProps = React.HTMLAttributes<HTMLDivElement>;

const SheetOverlay = ({ className, ...props }: SheetOverlayProps) => {
  const context = useContext(SheetContext);
  if (!context) throw new Error('SheetOverlay must be used within Sheet');

  const { isOpen } = context;

  return (
    <div
      className={cn(
        'fixed inset-0 z-50 bg-black/80 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',
        'fill-mode-both',
        className
      )}
      data-state={isOpen ? 'open' : 'closed'}
      {...props}
    ></div>
  );
};
// ----------------------------------------------------------------------------
// SheetContent
// ----------------------------------------------------------------------------
interface SheetContentProps extends React.HTMLAttributes<HTMLDivElement> {
  side?: SheetSideType;
  onEscapeKeyDown?: () => void;
  onPointerDownOutside?: () => void;
}

const POSITION_LIST = {
  top: 'inset-x-0 top-0 border-b data-[state=closed]:slide-out-to-top data-[state=open]:slide-in-from-top',
  bottom:
    'inset-x-0 bottom-0 border-t data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom',
  left: 'inset-y-0 left-0 h-full w-3/4 border-r data-[state=closed]:slide-out-to-left data-[state=open]:slide-in-from-left sm:max-w-sm',
  right:
    'inset-y-0 right-0 h-full w-3/4  border-l data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right sm:max-w-sm',
};

const SheetContent = ({
  className,
  children,
  side = DEFAULT_SIDE,
  onEscapeKeyDown,
  onPointerDownOutside,
  ...props
}: SheetContentProps) => {
  const context = useContext(SheetContext);
  if (!context) throw new Error('SheetContent must be used within Sheet');

  const { isOpen, closeSheet } = context;
  const [isVisible, setIsVisible] = useState(false);
  const sheetRef = useRef<HTMLDivElement>(null);

  const handleWheel = useCallback((e: WheelEvent) => {
    const isInsideDialog =
      e.target instanceof Node && sheetRef.current?.contains(e.target);

    if (!isInsideDialog) {
      e.preventDefault();
      return;
    }

    let target = e.target as HTMLElement;
    while (target && target !== sheetRef.current) {
      const { overflowY } = window.getComputedStyle(target);
      const isScrollable = overflowY === 'auto' || overflowY === 'scroll';
      const hasScrollableContent = target.scrollHeight > target.clientHeight;

      if (isScrollable && hasScrollableContent) {
        const scrollTop = target.scrollTop;
        const scrollHeight = target.scrollHeight;
        const clientHeight = target.clientHeight;

        if (scrollTop === 0 && e.deltaY < 0) {
          e.preventDefault();
        } else if (scrollTop + clientHeight >= scrollHeight && e.deltaY > 0) {
          e.preventDefault();
        }
        return;
      }
      target = target.parentElement as HTMLElement;
    }

    e.preventDefault();
  }, []);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (!isOpen) return;

      if (e.key === 'Escape') {
        if (onEscapeKeyDown) {
          onEscapeKeyDown();
        } else {
          closeSheet();
        }
      }
    },
    [closeSheet, isOpen, onEscapeKeyDown]
  );

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
      document.addEventListener('wheel', handleWheel, { passive: false });
      document.addEventListener('keydown', handleKeyDown);
    } else {
      document.removeEventListener('wheel', handleWheel);
      document.removeEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.removeEventListener('wheel', handleWheel);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown, handleWheel, isOpen]);

  const handlePointerDownOutside = () => {
    if (onPointerDownOutside) {
      onPointerDownOutside();
    } else {
      closeSheet();
    }
  };

  const handleAnimationEnd = (e: React.AnimationEvent) => {
    if (e.animationName === 'exit') {
      setIsVisible(false);
    }
  };

  const mergeProps = {
    ...props,
    onAnimationEnd: (e: React.AnimationEvent<HTMLDivElement>) => {
      props.onAnimationEnd?.(e);
      handleAnimationEnd(e);
    },
  };

  return ReactDOM.createPortal(
    <>
      {isVisible && (
        <>
          <SheetOverlay onClick={handlePointerDownOutside} />
          <div
            ref={sheetRef}
            className={cn(
              'fixed z-50 gap-4 bg-background p-6 shadow-lg transition ease-in-out data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:duration-300 data-[state=open]:duration-500',
              'fill-mode-both',
              POSITION_LIST[side],
              className
            )}
            data-state={isOpen ? 'open' : 'closed'}
            {...mergeProps}
          >
            {children}
          </div>
        </>
      )}
    </>,
    document.body
  );
};

export { Sheet, SheetContent, SheetOverlay, SheetTrigger };
