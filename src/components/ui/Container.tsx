import type { HTMLAttributes, ReactNode } from 'react';
import { cn } from '@/lib/cn';

interface ContainerProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  size?: 'default' | 'narrow' | 'wide';
}

/**
 * Wrapper max-width BISOU avec padding responsive.
 * - `narrow` : 840px (articles blog, pages texte)
 * - `default` : 1200px (layout standard boutique)
 * - `wide` : 1400px (hero sections)
 */
export function Container({ children, size = 'default', className, ...props }: ContainerProps) {
  const sizeClass =
    size === 'narrow' ? 'max-w-[840px]'
    : size === 'wide' ? 'max-w-[1400px]'
    : 'max-w-content';

  return (
    <div
      className={cn('mx-auto w-full px-4 sm:px-6 lg:px-8', sizeClass, className)}
      {...props}
    >
      {children}
    </div>
  );
}

export default Container;
