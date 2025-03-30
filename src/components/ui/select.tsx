import { cn } from '@/lib/utils';
import { CheckIcon, ChevronDownIcon } from 'lucide-react';
import React, {
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';
import ReactDOM from 'react-dom';

type SelectSideType = 'top' | 'right' | 'bottom' | 'left';
type SelectAlignType = 'start' | 'center' | 'end';

const DEFAULT_SIDE: SelectSideType = 'bottom';
const DEFAULT_ALIGN: SelectAlignType = 'center';
const DEFAULT_SIDE_OFFSET = 4;

interface SelectContextType {
  isOpen: boolean;
  openSelect: () => void;
  closeSelect: () => void;
  triggerRef: React.MutableRefObject<HTMLDivElement | HTMLButtonElement | null>;
  focusedIndex: number;
  setFocusedIndex: (index: number) => void;
  itemsRef: React.MutableRefObject<HTMLButtonElement[]>;
  innerValue: string;
  setValue: (value: string) => void;
}

const SelectContext = React.createContext<SelectContextType | undefined>(
  undefined
);

// ----------------------------------------------------------------------------
// Select
// ----------------------------------------------------------------------------
interface SelectProps extends React.HTMLAttributes<HTMLDivElement> {
  open?: boolean;
  onOpenChange?: (isOpen: boolean) => void;
  value?: string;
  onValueChange?: (value: string) => void;
}

const Select = ({
  children,
  open,
  onOpenChange,
  value,
  onValueChange,
}: SelectProps) => {
  // 外部からの状態を優先し、指定がない場合は内部状態を利用
  const [isOpen, setIsOpen] = useState(open ?? false);
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const itemsRef = useRef<HTMLButtonElement[]>([]);
  const [innerValue, setInnerValue] = useState(value ?? '');

  // propsが更新されたら内部状態も更新
  useEffect(() => {
    if (open !== undefined) {
      setIsOpen(open);
    }
  }, [open]);

  useEffect(() => {
    if (value !== undefined) {
      setInnerValue(value);
    }
  }, [value]);

  const openSelect = useCallback(() => {
    if (onOpenChange) {
      onOpenChange(true);
    } else {
      setIsOpen(true);
    }
  }, [onOpenChange]);

  const closeSelect = useCallback(() => {
    if (onOpenChange) {
      onOpenChange(false);
    } else {
      setIsOpen(false);
    }
  }, [onOpenChange]);

  const setValue = useCallback(
    (value: string) => {
      if (onValueChange) {
        onValueChange(value);
      } else {
        setInnerValue(value);
      }
    },
    [onValueChange]
  );

  const triggerRef = useRef<HTMLDivElement | null>(null);

  return (
    <SelectContext.Provider
      value={{
        isOpen,
        openSelect,
        closeSelect,
        triggerRef,
        focusedIndex,
        setFocusedIndex,
        itemsRef,
        innerValue,
        setValue,
      }}
    >
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child)) {
          switch (child.type) {
            case SelectTrigger:
            case SelectContent:
              return child;
            default:
              return null;
          }
        }
      })}
    </SelectContext.Provider>
  );
};

// ----------------------------------------------------------------------------
// SelectTrigger
// ----------------------------------------------------------------------------
interface SelectTriggerProps extends React.HTMLAttributes<HTMLButtonElement> {
  asChild?: boolean;
}

const SelectTrigger = React.forwardRef<HTMLButtonElement, SelectTriggerProps>(
  ({ className, children, asChild = false, ...props }, ref) => {
    const context = useContext(SelectContext);
    if (!context) throw new Error('SelectContent must be used within Select');

    const { openSelect, triggerRef } = context;

    if (asChild && React.isValidElement(children)) {
      const mergeChildProps = {
        ...children.props,
        onClick: (e: React.MouseEvent) => {
          children.props.onClick?.(e);
          openSelect();
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
        openSelect();
      },
    };

    return (
      <button
        ref={triggerRef as React.MutableRefObject<HTMLButtonElement>}
        className={cn(
          'flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1',
          className
        )}
        {...mergeProps}
      >
        {React.Children.map(children, (child) => {
          if (React.isValidElement(child)) {
            switch (child.type) {
              case SelectValue:
                return child;
              default:
                return null;
            }
          }
        })}
        <ChevronDownIcon className="size-4 opacity-50" />
      </button>
    );
  }
);

// ----------------------------------------------------------------------------
// SelectContent
// ----------------------------------------------------------------------------
interface SelectContentProps extends React.HTMLAttributes<HTMLDivElement> {
  side?: SelectSideType;
  align?: SelectAlignType;
  sideOffset?: number;
  onEscapeKeyDown?: () => void;
  onPointerDownOutside?: () => void;
  position?: 'item-aligned' | 'popper';
}

const SelectContent = ({
  children,
  className,
  side = DEFAULT_SIDE,
  align = DEFAULT_ALIGN,
  sideOffset = DEFAULT_SIDE_OFFSET,
  onEscapeKeyDown,
  onPointerDownOutside,
  position = 'item-aligned',
  ...props
}: SelectContentProps) => {
  const context = useContext(SelectContext);
  if (!context) throw new Error('SelectContent must be used within Select');

  const {
    isOpen,
    closeSelect,
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

      const newIndex = isArrowUp
        ? (focusedIndex - 1 + itemCount) % itemCount
        : (focusedIndex + 1) % itemCount;

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
            closeSelect();
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
    [closeSelect, handleArrawNavigation, isOpen, onEscapeKeyDown]
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
      closeSelect();
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
    // triggerとなる要素からSelectを表示する座標を計算する
    // （style属性に指定する文字列作成）
    if (triggerRef.current) {
      const { left, top, right, bottom, width, height } =
        triggerRef.current.getBoundingClientRect();

      const getOffset = (align: SelectAlignType, size: number) => {
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
        case SelectItem:
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
                'relative z-50 max-h-96 min-w-[8rem] overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2',
                'fill-mode-both',
                position === 'popper' &&
                  'data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1',
                className
              )}
              style={{ minWidth: `${triggerRef.current?.offsetWidth}px` }}
              data-state={isOpen ? 'open' : 'closed'}
              data-side={side}
              {...mergeProps}
            >
              <div
                className={cn(
                  'p-1',
                  position === 'popper' &&
                    'h-[var(--radix-select-trigger-height)] w-full min-w-[var(--radix-select-trigger-width)]'
                )}
              >
                {innerChildren}
              </div>
            </div>
          </div>
        </>
      )}
    </>,
    document.body
  );
};

// ----------------------------------------------------------------------------
// SelectItem
// ----------------------------------------------------------------------------
interface SelectItemProps extends React.HTMLAttributes<HTMLButtonElement> {
  index?: number;
  value?: string;
}
const SelectItem = ({
  className,
  children,
  index = 0,
  value,
  ...props
}: SelectItemProps) => {
  const context = useContext(SelectContext);
  if (!context) throw new Error('SelectItem must be used within Select');

  const { innerValue, itemsRef, setFocusedIndex, setValue, closeSelect } =
    context;

  useEffect(() => {
    if (innerValue === value) {
      itemsRef.current[index].focus();
      setFocusedIndex(index);
    }
  }, [index, innerValue, itemsRef, setFocusedIndex, value]);

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
      setValue(value ?? '');
      closeSelect();
    },
  };

  return (
    <button
      ref={(el) => (itemsRef.current[index] = el as HTMLButtonElement)}
      className={cn(
        'relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
        className
      )}
      tabIndex={-1}
      {...mergeProps}
    >
      <span className="absolute left-2 flex size-3.5 items-center justify-center">
        {innerValue === value && <CheckIcon className="size-4" />}
      </span>
      {children}
    </button>
  );
};
// ----------------------------------------------------------------------------
// SelectSeparator
// ----------------------------------------------------------------------------
type SelectSeparatorProps = React.HTMLAttributes<HTMLDivElement>;
const SelectSeparator = React.forwardRef<HTMLDivElement, SelectSeparatorProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('-mx-1 my-1 h-px bg-muted', className)}
      {...props}
    />
  )
);

// ----------------------------------------------------------------------------
// SelectLabel
// ----------------------------------------------------------------------------
type SelectLabelProps = React.HTMLAttributes<HTMLDivElement>;
const SelectLabel = React.forwardRef<HTMLDivElement, SelectLabelProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('py-1.5 pl-8 pr-2 text-sm font-semibold', className)}
      {...props}
    />
  )
);

// ----------------------------------------------------------------------------
// SelectValue
// ----------------------------------------------------------------------------
interface SelectValueProps extends React.HTMLAttributes<HTMLDivElement> {
  placeholder?: string;
}
const SelectValue = React.forwardRef<HTMLDivElement, SelectValueProps>(
  ({ className, placeholder, ...props }, ref) => {
    const context = useContext(SelectContext);
    if (!context) throw new Error('SelectValue must be used within Select');

    const { innerValue } = context;

    return (
      <span ref={ref} className={cn('', className)} {...props}>
        {innerValue || placeholder}
      </span>
    );
  }
);

export {
  Select,
  SelectContent,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
};
