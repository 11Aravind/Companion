import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

const buttonVariants = cva(
  'inline-flex items-center justify-center whitespace-nowrap rounded-xl text-sm font-semibold ring-offset-background transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-navy-900 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 select-none active:scale-[0.98]',
  {
    variants: {
      variant: {
        default: 'bg-navy-900 text-white hover:bg-navy-800 shadow-subtle',
        primary: 'bg-navy-900 text-white hover:bg-navy-800 shadow-subtle',
        accent: 'bg-accent text-white hover:bg-accent-hover shadow-subtle',
        emerald: 'bg-accent text-white hover:bg-accent-hover shadow-subtle',
        destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90 shadow-subtle',
        danger: 'bg-rose-600 text-white hover:bg-rose-700 shadow-subtle',
        outline: 'border border-charcoal-border bg-white text-charcoal hover:bg-navy-50 hover:border-navy-200',
        secondary: 'bg-navy-50 text-navy-900 hover:bg-navy-100 border border-charcoal-border',
        ghost: 'text-charcoal hover:bg-navy-50 hover:text-navy-900',
        link: 'text-navy-900 underline-offset-4 hover:underline font-semibold',
      },
      size: {
        default: 'h-10 px-4 py-2',
        sm: 'h-8 rounded-lg px-3 text-xs',
        lg: 'h-12 rounded-xl px-6 text-base font-bold',
        icon: 'h-10 w-10',
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
