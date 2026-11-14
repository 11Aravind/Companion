import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

const buttonVariants = cva(
  'inline-flex items-center justify-center whitespace-nowrap rounded-full text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 select-none active:scale-[0.98]',
  {
    variants: {
      variant: {
        default: 'bg-black text-white hover:bg-neutral-800 shadow-none',
        primary: 'bg-black text-white hover:bg-neutral-800 shadow-none',
        accent: 'bg-black text-white hover:bg-neutral-800 shadow-none',
        yellow: 'bg-black text-white hover:bg-neutral-800 shadow-none',
        emerald: 'bg-black text-white hover:bg-neutral-800 shadow-none',
        destructive: 'bg-rose-600 text-white hover:bg-rose-700 shadow-none',
        danger: 'bg-rose-600 text-white hover:bg-rose-700 shadow-none',
        outline: 'border border-neutral-300 bg-white text-black hover:bg-[#F6F6F6]',
        secondary: 'bg-[#F6F6F6] text-black hover:bg-[#EEEEEE] border-transparent',
        ghost: 'text-black hover:bg-[#F6F6F6]',
        link: 'text-black underline-offset-4 hover:underline font-medium',
      },
      size: {
        default: 'h-11 px-5 py-2.5',
        sm: 'h-9 rounded-full px-3.5 text-xs font-medium',
        lg: 'h-13 rounded-full px-7 text-base font-medium',
        icon: 'h-10 w-10 rounded-full',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  isLoading?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, isLoading, children, disabled, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin text-current" />}
        {children}
      </button>
    );
  }
);
Button.displayName = 'Button';

export { Button, buttonVariants };
