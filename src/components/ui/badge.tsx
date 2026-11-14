import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const badgeVariants = cva(
  'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
  {
    variants: {
      variant: {
        default: 'border-transparent bg-navy-900 text-white',
        primary: 'border-transparent bg-navy-900 text-white',
        secondary: 'border-charcoal-border bg-navy-50 text-navy-900',
        destructive: 'border-transparent bg-destructive text-destructive-foreground',
        danger: 'border-rose-200 bg-rose-50 text-rose-700',
        outline: 'text-charcoal border-charcoal-border bg-white',
        success: 'border-accent/20 bg-accent-light text-accent font-semibold',
        accent: 'border-transparent bg-accent text-white font-semibold',
        warning: 'border-amber-200 bg-amber-50 text-amber-800',
        info: 'border-[#2583E8]/20 bg-[#2583E8]/10 text-[#2583E8]',
        purple: 'border-purple-200 bg-purple-50 text-purple-800',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
