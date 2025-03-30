import { cn } from '@/lib/utils';
import React, {
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';
import ReactDOM from 'react-dom';

type DropdownMenuSideType = 'top' | 'right' | 'bottom' | 'left';
type DropdownMenuAlignType = 'start' | 'center' | 'end';

const DEFAULT_SIDE: DropdownMenuSideType = 'bottom';
const DEFAULT_ALIGN: DropdownMenuAlignType = 'center';
const DEFAULT_SIDE_OFFSET = 4;

interface DropdownMenuContextType {
  isOpen: boolean;
  openDropdownMenu: () => void;
  closeDropdownMenu: () => void;
  triggerRef: React.MutableRefObject<HTMLDivElement | HTMLButtonElement | null>;
  focusedIndex: number;
  setFocusedIndex: (index: number) => void;
  itemsRef: React.MutableRefObject<HTMLButtonElement[]>;
}

const DropdownMenuContext = React.createContext<
  DropdownMenuContextType | undefined
>(undefined);

// ----------------------------------------------------------------------------
// DropdownMenu
// ----------------------------------------------------------------------------
interface DropdownMenuProps extends React.HTMLAttributes<HTMLDivElement> {
  open?: boolean;
  onOpenChange?: (isOpen: boolean) => void;
}

const DropdownMenu = ({ children, open, onOpenChange }: DropdownMenuProps) => {
  // 外部からの状態を優先し、指定がない場合は内部状態を利用
  const [isOpen, setIsOpen] = useState(open ?? false);
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const itemsRef = useRef<HTMLButtonElement[]>([]);

  // propsが更新されたら内部状態も更新
  useEffect(() => {
    if (open !== undefined) {
      setIsOpen(open);
    }
  }, [open]);

  const openDropdownMenu = useCallback(() => {
    if (onOpenChange) {
      onOpenChange(true);
    } else {
      setIsOpen(true);
    }
  }, [onOpenChange]);

  const closeDropdownMenu = useCallback(() => {
    if (onOpenChange) {
      onOpenChange(false);
    } else {
      setIsOpen(false);
    }
  }, [onOpenChange]);

  const triggerRef = useRef<HTMLDivElement | null>(null);

  return (
    <DropdownMenuContext.Provider
      value={{
        isOpen,
        openDropdownMenu,
        closeDropdownMenu,
        triggerRef,
        focusedIndex,
        setFocusedIndex,
        itemsRef,
      }}
    >
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child)) {
          switch (child.type) {
            case DropdownMenuTrigger:
            case DropdownMenuContent:
              return child;
            default:
              return null;
          }
        }
      })}
    </DropdownMenuContext.Provider>
  );
};

// ----------------------------------------------------------------------------
// DropdownMenuTrigger
// ----------------------------------------------------------------------------
interface DropdownMenuTriggerProps
  extends React.HTMLAttributes<HTMLButtonElement> {
  asChild?: boolean;
}

const DropdownMenuTrigger = React.forwardRef<
  HTMLButtonElement,
  DropdownMenuTriggerProps
>(({ className, children, asChild = false, ...props }, ref) => {
  const context = useContext(DropdownMenuContext);
  if (!context)
    throw new Error('DropdownMenuContent must be used within DropdownMenu');

  const { openDropdownMenu, triggerRef } = context;

  if (asChild && React.isValidElement(children)) {
    const mergeChildProps = {
      ...children.props,
      onClick: (e: React.MouseEvent) => {
        children.props.onClick?.(e);
        openDropdownMenu();
      },
    };
    return (
      <div
        ref={triggerRef as React.MutableRefObject<HTMLDivElement>}
        className={cn('w-fit', className)}
      >
        {React.cloneElement(children, { ...mergeChildProps, ref })}
      </div>
    );
  }
  const mergeProps = {
    ...props,
    onClick: (e: React.MouseEvent<HTMLButtonElement>) => {
      props.onClick?.(e);
      openDropdownMenu();
    },
  };

  return (
    <button
      ref={triggerRef as React.MutableRefObject<HTMLButtonElement>}
      className={cn('w-fit', className)}
      {...mergeProps}
    >
      {children}
    </button>
  );
});

// ----------------------------------------------------------------------------
// DropdownMenuContent
// ----------------------------------------------------------------------------
interface DropdownMenuContentProps
  extends React.HTMLAttributes<HTMLDivElement> {
  side?: DropdownMenuSideType;
  align?: DropdownMenuAlignType;
  sideOffset?: number;
  onEscapeKeyDown?: () => void;
  onPointerDownOutside?: () => void;
}

const DropdownMenuContent = ({
  children,
  className,
  side = DEFAULT_SIDE,
  align = DEFAULT_ALIGN,
  sideOffset = DEFAULT_SIDE_OFFSET,
  onEscapeKeyDown,
  onPointerDownOutside,
  ...props
}: DropdownMenuContentProps) => {
  const context = useContext(DropdownMenuContext);
  if (!context)
    throw new Error('DropdownMenuContent must be used within DropdownMenu');

  const {
    isOpen,
    closeDropdownMenu,
    triggerRef,
    focusedIndex,
    itemsRef,
    setFocusedIndex,
  } = context;

  const [isVisible, setIsVisible] = useState(false);

  const handleArrawNavigation = useCallback(
    (key: string) => {
      const isArrowUp = key === 'ArrowUp';
      const itemCount = itemsRef.current.length;

      let newIndex = focusedIndex;

      if (focusedIndex === -1) {
        newIndex = isArrowUp ? itemCount - 1 : 0;
      } else {
        newIndex = isArrowUp
          ? (focusedIndex - 1 + itemCount) % itemCount
          : (focusedIndex + 1) % itemCount;
      }

      setFocusedIndex(newIndex);
      itemsRef.current[newIndex].focus();
    },
    [focusedIndex, itemsRef, setFocusedIndex]
  );

  const handleWheel = useCallback((e: WheelEvent) => {
    e.preventDefault();
  }, []);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (!isOpen) return;

      switch (e.key) {
        case 'Escape':
          if (onEscapeKeyDown) {
            onEscapeKeyDown();
          } else {
            closeDropdownMenu();
          }
          break;

        case 'Tab':
          e.preventDefault();
          break;

        case 'ArrowUp':
        case 'ArrowDown':
          e.preventDefault();
          handleArrawNavigation(e.key);
          break;
      }
    },
    [closeDropdownMenu, handleArrawNavigation, isOpen, onEscapeKeyDown]
  );

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
      document.addEventListener('wheel', handleWheel, { passive: false });
      document.addEventListener('keydown', handleKeyDown);
    } else {
      setFocusedIndex(-1);
      document.removeEventListener('wheel', handleWheel);
      document.removeEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.removeEventListener('wheel', handleWheel);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown, handleWheel, isOpen, setFocusedIndex]);

  const handlePointerDownOutside = () => {
    if (onPointerDownOutside) {
      onPointerDownOutside();
    } else {
      closeDropdownMenu();
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

  const [transformStyle, setTransformStyle] = useState('');

  useLayoutEffect(() => {
    // triggerとなる要素からDropdownMenuを表示する座標を計算する
    // （style属性に指定する文字列作成）
    if (triggerRef.current) {
      const { left, top, right, bottom, width, height } =
        triggerRef.current.getBoundingClientRect();

      const getOffset = (align: DropdownMenuAlignType, size: number) => {
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

  let itemIndex = 0;
  const innerChildren = React.Children.map(children, (child) => {
    if (React.isValidElement(child)) {
      switch (child.type) {
        case DropdownMenuItem:
          return React.cloneElement(child, {
            ...child.props,
            index: itemIndex++,
          });
        default:
          return child;
      }
    }
  });

  return ReactDOM.createPortal(
    <>
      {isVisible && (
        <>
          <div
            className="fixed inset-0 z-50"
            onClick={handlePointerDownOutside}
          />
          <div
            className="fixed left-0 top-0 z-50"
            style={{ transform: transformStyle }}
          >
            <div
              className={cn(
                'z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2',
                'fill-mode-both',
                className
              )}
              data-state={isOpen ? 'open' : 'closed'}
              data-side={side}
              {...mergeProps}
            >
              {innerChildren}
            </div>
          </div>
        </>
      )}
    </>,
    document.body
  );
};

// ----------------------------------------------------------------------------
// DropdownMenuItem
// ----------------------------------------------------------------------------
interface DropdownMenuItemProps
  extends React.HTMLAttributes<HTMLButtonElement> {
  index?: number;
  inset?: boolean;
}
const DropdownMenuItem = ({
  className,
  children,
  index = 0,
  inset,
  ...props
}: DropdownMenuItemProps) => {
  const context = useContext(DropdownMenuContext);
  if (!context)
    throw new Error('DropdownMenuItem must be used within DropdownMenu');

  const { itemsRef, closeDropdownMenu } = context;

  const mergeProps = {
    ...props,
    onMouseEnter: (e: React.MouseEvent<HTMLButtonElement>) => {
      props.onMouseEnter?.(e);
      itemsRef.current[index].focus();
    },
    onClick: (e: React.MouseEvent<HTMLButtonElement>) => {
      if (props.onClick) {
        props.onClick(e);
        return;
      }
      closeDropdownMenu();
    },
  };

  return (
    <button
      ref={(el) => (itemsRef.current[index] = el as HTMLButtonElement)}
      className={cn(
        'relative w-full flex cursor-default select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0',
        inset && 'pl-8',
        className
      )}
      tabIndex={-1}
      {...mergeProps}
    >
      {children}
    </button>
  );
};

// ----------------------------------------------------------------------------
// DropdownMenuSeparator
// ----------------------------------------------------------------------------
type DropdownMenuSeparatorProps = React.HTMLAttributes<HTMLDivElement>;
const DropdownMenuSeparator = React.forwardRef<
  HTMLDivElement,
  DropdownMenuSeparatorProps
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('-mx-1 my-1 h-px bg-muted', className)}
    {...props}
  />
));

// ----------------------------------------------------------------------------
// DropdownMenuLabel
// ----------------------------------------------------------------------------
interface DropdownMenuLabelProps extends React.HTMLAttributes<HTMLDivElement> {
  inset?: boolean;
}
const DropdownMenuLabel = React.forwardRef<
  HTMLDivElement,
  DropdownMenuLabelProps
>(({ className, inset, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      'px-2 py-1.5 text-sm font-semibold',
      inset && 'pl-8',
      className
    )}
    {...props}
  />
));

export {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
};
