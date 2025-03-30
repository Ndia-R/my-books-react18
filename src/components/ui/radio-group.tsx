import { cn } from '@/lib/utils';
import { Circle } from 'lucide-react';
import React, {
  ButtonHTMLAttributes,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';

interface RadioGroupContextType {
  checkedId: string | undefined;
  setCheckedId: (value: string | undefined) => void;
  innerValue: string;
  setValue: (value: string) => void;
}

const RadioGroupContext = React.createContext<
  RadioGroupContextType | undefined
>(undefined);

interface RadioGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  value?: string;
  onValueChange?: (value: string) => void;
  defaultValue?: string;
}

const RadioGroup = ({
  className,
  children,
  value,
  onValueChange,
  ...props
}: RadioGroupProps) => {
  // 外部からの状態を優先し、指定がない場合は内部状態を利用
  const [innerValue, setInnerValue] = useState(value ?? '');

  // propsが更新されたら内部状態も更新
  useEffect(() => {
    if (value !== undefined) {
      setInnerValue(value);
    }
  }, [value]);

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

  const [checkedId, setCheckedId] = useState<string | undefined>(undefined);

  return (
    <RadioGroupContext.Provider
      value={{
        checkedId,
        setCheckedId,
        innerValue,
        setValue,
      }}
    >
      <div className={cn('grid gap-2', className)} {...props}>
        {children}
      </div>
    </RadioGroupContext.Provider>
  );
};

type RadioGroupItemProps = ButtonHTMLAttributes<HTMLButtonElement>;

const RadioGroupItem = React.forwardRef<HTMLButtonElement, RadioGroupItemProps>(
  ({ className, ...props }, ref) => {
    const context = useContext(RadioGroupContext);
    if (!context) throw new Error('DialogTrigger must be used within Dialog');

    const { setCheckedId, setValue, innerValue } = context;

    const handleClick = () => {
      setCheckedId(props.id);

      const value = typeof props.value === 'string' ? props.value : '';
      setValue(value);
    };

    return (
      <button
        ref={ref}
        className={cn(
          'aspect-square h-4 w-4 rounded-full border border-primary text-primary ring-offset-background focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
          className
        )}
        type="button"
        {...props}
        onClick={handleClick}
      >
        {innerValue === props.value && (
          <span className="flex items-center justify-center">
            <Circle className="size-2.5 fill-current text-current" />
          </span>
        )}
      </button>
    );
  }
);

export { RadioGroup, RadioGroupItem };
