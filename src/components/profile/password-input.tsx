import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { EyeIcon, EyeOffIcon } from 'lucide-react';
import React, { useState } from 'react';

const PasswordInput = React.forwardRef<
  HTMLInputElement,
  React.ComponentProps<'input'>
>(({ className, ...props }, ref) => {
  const [isShownPassword, setIsShownPassword] = useState(false);

  return (
    <div className="relative">
      <Input
        ref={ref}
        className={className}
        type={isShownPassword ? 'text' : 'password'}
        {...props}
      />
      <Button
        className="absolute right-0 top-0 rounded-full hover:bg-transparent hover:text-foreground"
        variant="ghost"
        size="icon"
        aria-label={isShownPassword ? 'パスワードを非表示' : 'パスワードを表示'}
        type="button"
        onClick={() => setIsShownPassword(!isShownPassword)}
      >
        {isShownPassword ? (
          <EyeIcon className="size-4" />
        ) : (
          <EyeOffIcon className="size-4" />
        )}
      </Button>
    </div>
  );
});

export default PasswordInput;
