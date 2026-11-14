import * as React from 'react';
import { cn } from '@/lib/utils';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  icon?: React.ReactNode;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, icon, ...props }, ref) => {
    if (icon) {
      return (
        <div className="relative flex items-center w-full">
          <div className="absolute left-3.5 text-charcoal-muted pointer-events-none flex items-center justify-center">
            {icon}
          </div>
          <input
            type={type}
            className={cn(
              'flex h-11 w-full rounded-xl border border-charcoal-border bg-white pl-10 pr-3.5 py-2 text-sm text-charcoal ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-charcoal-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-navy-900 focus-visible:border-transparent disabled:cursor-not-allowed disabled:opacity-50 transition-all shadow-subtle',
              className
            )}
            ref={ref}
            {...props}
          />
        </div>
      );
    }

    return (
      <input
        type={type}
        className={cn(
          'flex h-11 w-full rounded-xl border border-charcoal-border bg-white px-3.5 py-2 text-sm text-charcoal ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-charcoal-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-navy-900 focus-visible:border-transparent disabled:cursor-not-allowed disabled:opacity-50 transition-all shadow-subtle',
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = 'Input';

export { Input };
