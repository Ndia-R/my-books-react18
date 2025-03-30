import { cn } from '@/lib/utils';
import React, {
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';

type TooltipSideType = 'top' | 'right' | 'bottom' | 'left';
type TooltipAlignType = 'start' | 'center' | 'end';

const DEFAULT_SIDE: TooltipSideType = 'top';
const DEFAULT_ALIGN: TooltipAlignType = 'center';
const DEFAULT_SIDE_OFFSET = 8;

interface TooltipContextType {
  isOpen: boolean;
  openTooltip: () => void;
  closeTooltip: () => void;
  triggerRef: React.MutableRefObject<HTMLDivElement | null>;
}

const TooltipContext = React.createContext<TooltipContextType | undefined>(
  undefined
);

// ----------------------------------------------------------------------------
// Tooltip
// ----------------------------------------------------------------------------
interface TooltipProps extends React.HTMLAttributes<HTMLDivElement> {
  open?: boolean;
  onOpenChange?: (isOpen: boolean) => void;
}

const Tooltip = ({ children, open, onOpenChange }: TooltipProps) => {
  // 外部からの状態を優先し、指定がない場合は内部状態を利用
  const [isOpen, setIsOpen] = useState(open ?? false);

  // propsが更新されたら内部状態も更新
  useEffect(() => {
    if (open !== undefined) {
      setIsOpen(open);
    }
  }, [open]);

  const openTooltip = useCallback(() => {
    if (onOpenChange) {
      onOpenChange(true);
    } else {
      setIsOpen(true);
    }
  }, [onOpenChange]);

  const closeTooltip = useCallback(() => {
    if (onOpenChange) {
      onOpenChange(false);
    } else {
      setIsOpen(false);
    }
  }, [onOpenChange]);

  const triggerRef = useRef<HTMLDivElement | null>(null);

  return (
    <TooltipContext.Provider
      value={{ isOpen, openTooltip, closeTooltip, triggerRef }}
    >
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child)) {
          switch (child.type) {
            case TooltipTrigger:
            case TooltipContent:
              return child;
            default:
              return null;
          }
        }
      })}
    </TooltipContext.Provider>
  );
};

// ----------------------------------------------------------------------------
// TooltipTrigger
// ----------------------------------------------------------------------------
interface TooltipTriggerProps extends React.HTMLAttributes<HTMLButtonElement> {
  asChild?: boolean;
}

const TooltipTrigger = React.forwardRef<HTMLButtonElement, TooltipTriggerProps>(
  ({ children, asChild = false, ...props }, ref) => {
    const context = useContext(TooltipContext);
    if (!context) throw new Error('TooltipContent must be used within Tooltip');

    const { triggerRef, openTooltip, closeTooltip } = context;

    if (asChild && React.isValidElement(children)) {
      const mergeChildProps = {
        ...children.props,
      };
      return (
        <div
          ref={triggerRef}
          className="w-fit"
          onPointerEnter={openTooltip}
          onPointerLeave={closeTooltip}
          onPointerDown={closeTooltip}
        >
          {React.cloneElement(children, { ...mergeChildProps, ref })}
        </div>
      );
    }

    return (
      <div
        ref={triggerRef}
        className="w-fit"
        onPointerEnter={openTooltip}
        onPointerLeave={closeTooltip}
        onPointerDown={closeTooltip}
      >
        <button ref={ref} {...props}>
          {children}
        </button>
      </div>
    );
  }
);

// ----------------------------------------------------------------------------
// TooltipContent
// ----------------------------------------------------------------------------
interface TooltipContentProps extends React.HTMLAttributes<HTMLDivElement> {
  side?: TooltipSideType;
  align?: TooltipAlignType;
  sideOffset?: number;
}

const TooltipContent = React.forwardRef<HTMLDivElement, TooltipContentProps>(
  (
    {
      children,
      className,
      side = DEFAULT_SIDE,
      align = DEFAULT_ALIGN,
      sideOffset = DEFAULT_SIDE_OFFSET,
      ...props
    },
    ref
  ) => {
    const context = useContext(TooltipContext);
    if (!context) throw new Error('TooltipContent must be used within Tooltip');

    const { isOpen, closeTooltip, triggerRef } = context;

    const [transformStyle, setTransformStyle] = useState('');

    const handleWheel = useCallback(
      (e: WheelEvent) => {
        e.preventDefault();
        closeTooltip();
      },
      [closeTooltip]
    );

    useEffect(() => {
      if (isOpen) {
        document.addEventListener('wheel', handleWheel, { passive: false });
      } else {
        document.removeEventListener('wheel', handleWheel);
      }
      return () => {
        document.removeEventListener('wheel', handleWheel);
      };
    }, [handleWheel, isOpen]);

    useLayoutEffect(() => {
      // triggerとなる要素からTooltipを表示する座標を計算する
      // （style属性に指定する文字列作成）
      if (triggerRef.current) {
        const { left, top, right, bottom, width, height } =
          triggerRef.current.getBoundingClientRect();

        const getOffset = (align: TooltipAlignType, size: number) => {
          switch (align) {
            case 'start':
              return `0% - ${size / 2}px`;
            case 'end':
              return `-100% + ${size / 2}px`;
            default:
              return '-50%';
          }
        };

        const offsetX = getOffset(align, width);
        const offsetY = getOffset(align, height);

        const positions = {
          top: {
            x: left + width / 2,
            y: top,
            offset: { x: offsetX, y: `-100% - ${sideOffset}px` },
          },
          bottom: {
            x: left + width / 2,
            y: bottom,
            offset: { x: offsetX, y: `0% + ${sideOffset}px` },
          },
          left: {
            x: left,
            y: top + height / 2,
            offset: { x: `-100% - ${sideOffset}px`, y: offsetY },
          },
          right: {
            x: right,
            y: top + height / 2,
            offset: { x: `0% + ${sideOffset}px`, y: offsetY },
          },
        };
        const pos = positions[side];

        setTransformStyle(
          `translate(calc(${pos.x}px + ${pos.offset.x}), calc(${pos.y}px + ${pos.offset.y}))`
        );
      }
    }, [context, triggerRef, side, sideOffset, align]);

    return (
      <>
        {isOpen && (
          <div
            className="fixed left-0 top-0 z-50"
            style={{ transform: transformStyle }}
          >
            <div
              ref={ref}
              className={cn(
                'z-50 overflow-hidden rounded-md border bg-popover px-3 py-1.5 text-sm text-popover-foreground shadow-md animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2',
                className
              )}
              data-state={isOpen ? 'open' : 'closed'}
              data-side={side}
              {...props}
            >
              {children}
            </div>
          </div>
        )}
      </>
    );
  }
);

export { Tooltip, TooltipContent, TooltipTrigger };
