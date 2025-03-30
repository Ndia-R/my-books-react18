import { cn } from '@/lib/utils';
import React, { useContext, useEffect, useState } from 'react';

interface AvatarContextType {
  imageError: boolean;
  setImageError: (value: boolean) => void;
}

const AvatarContext = React.createContext<AvatarContextType | undefined>(
  undefined
);

// ----------------------------------------------------------------------------
// Avatar
// ----------------------------------------------------------------------------
type AvatarProps = React.HTMLAttributes<HTMLDivElement>;

const Avatar = React.forwardRef<HTMLDivElement, AvatarProps>(
  ({ children, className, ...props }, ref) => {
    const [imageError, setImageError] = useState(false);

    useEffect(() => {
      // AvatarImageがなければ画像読み込みエラーとする
      const image = React.Children.toArray(children).find(
        (child) => React.isValidElement(child) && child.type === AvatarImage
      );
      if (!image) setImageError(true);
    }, [children]);

    return (
      <AvatarContext.Provider value={{ imageError, setImageError }}>
        <div
          ref={ref}
          className={cn(
            'relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full',
            className
          )}
          {...props}
        >
          {React.Children.map(children, (child) => {
            if (React.isValidElement(child)) {
              switch (child.type) {
                case AvatarImage:
                case AvatarFallback:
                  return child;
                default:
                  return null;
              }
            }
          })}
        </div>
      </AvatarContext.Provider>
    );
  }
);

// ----------------------------------------------------------------------------
// AvatarImage
// ----------------------------------------------------------------------------
interface AvatarImageProps extends React.HTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
}

const AvatarImage = React.forwardRef<HTMLImageElement, AvatarImageProps>(
  ({ className, ...props }, ref) => {
    const context = useContext(AvatarContext);
    if (!context) throw new Error('AvatarImage must be used within Avatar');

    const { imageError, setImageError } = context;

    if (imageError) return null;

    return (
      <img
        ref={ref}
        className={cn('aspect-square h-full w-full', className)}
        {...props}
        onError={() => setImageError(true)}
      />
    );
  }
);

// ----------------------------------------------------------------------------
// AvatarFallback
// ----------------------------------------------------------------------------
type AvatarFallbackProps = React.HTMLAttributes<HTMLDivElement>;

const AvatarFallback = React.forwardRef<HTMLDivElement, AvatarFallbackProps>(
  ({ className, ...props }, ref) => {
    const context = useContext(AvatarContext);
    if (!context) throw new Error('AvatarFallback must be used within Avatar');

    const { imageError } = context;

    if (!imageError) return null;

    return (
      <div
        ref={ref}
        className={cn(
          'flex h-full w-full items-center justify-center rounded-full bg-primary/50',
          className
        )}
        {...props}
      />
    );
  }
);

export { Avatar, AvatarFallback, AvatarImage };
