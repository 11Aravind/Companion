import * as React from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

export interface LogoProps extends Omit<React.SVGProps<SVGSVGElement>, 'href'> {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'dark' | 'light' | 'monochrome';
  showText?: boolean;
  href?: string | false;
  className?: string;
}

const SIZE_MAP = {
  sm: { icon: 28, text: 'text-lg' },
  md: { icon: 34, text: 'text-xl' },
  lg: { icon: 42, text: 'text-2xl' },
  xl: { icon: 52, text: 'text-3xl' },
};

export function CompanionLogo({
  size = 'md',
  variant = 'light',
  showText = true,
  href,
  className,
  ...props
}: LogoProps) {
  const { icon: iconSize, text: textSize } = SIZE_MAP[size];

  // variant 'dark': on black background (white logo + white text)
  // variant 'light': on white/light background (black logo + black text)
  const isDarkBg = variant === 'dark';

  const content = (
    <div className={cn('inline-flex items-center gap-2.5 select-none cursor-pointer', className)}>
      {/* Geometric Vector Emblem */}
      <svg
        width={iconSize}
        height={iconSize}
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="shrink-0 transition-transform group-hover:scale-105"
        {...props}
      >
        {/* Outer Squircle Container */}
        <rect
          width="48"
          height="48"
          rx="12"
          fill={isDarkBg ? '#FFFFFF' : '#000000'}
        />

        {/* Minimalist Interlocking Companion Emblem (C-loop + Connected Twin Journey Nodes) */}
        {/* Dynamic Journey Arc */}
        <path
          d="M34 15 C30.5 12 26 11 21 11 C13.5 11 8 16.5 8 24 C8 31.5 13.5 37 21 37 C26.5 37 31 34.5 34 30.5"
          stroke={isDarkBg ? '#000000' : '#FFFFFF'}
          strokeWidth="4.2"
          strokeLinecap="round"
        />

        {/* Lead Traveler Node */}
        <circle
          cx="20"
          cy="28"
          r="3.2"
          fill={isDarkBg ? '#000000' : '#FFFFFF'}
        />

        {/* Accompanying Companion Node */}
        <circle
          cx="28"
          cy="19"
          r="3.2"
          fill={isDarkBg ? '#000000' : '#FFFFFF'}
        />

        {/* Mutual Connection Link */}
        <path
          d="M20 28 L28 19"
          stroke={isDarkBg ? '#000000' : '#FFFFFF'}
          strokeWidth="3.2"
          strokeLinecap="round"
        />
      </svg>

      {/* Typography Wordmark */}
      {showText && (
        <span
          className={cn(
            'font-bold tracking-tight font-uber leading-none',
            textSize,
            isDarkBg ? 'text-white' : 'text-black'
          )}
        >
          Companion
        </span>
      )}
    </div>
  );

  if (href) {
    return (
      <Link href={href} className="inline-flex items-center group transition-opacity hover:opacity-90">
        {content}
      </Link>
    );
  }

  return content;
}

