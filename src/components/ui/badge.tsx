import React from 'react'
import { cn } from '../../lib/utils'

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 
    | 'default' 
    | 'secondary' 
    | 'success' 
    | 'warning' 
    | 'danger' 
    | 'outline' 
    | 'peach' 
    | 'gold'
    | 'sprout'
  size?: 'sm' | 'md'
}

export function Badge({ 
  className, 
  variant = 'default', 
  size = 'sm', 
  children, 
  ...props 
}: BadgeProps) {
  const variants = {
    default: 'bg-primary/10 text-primary border-primary/20',
    secondary: 'bg-secondary text-secondary-foreground border-transparent',
    success: 'bg-[var(--success-subtle)] text-[var(--success-foreground)] border-green-200 dark:border-green-900/50',
    warning: 'bg-[var(--warning-subtle)] text-[var(--warning-foreground)] border-amber-200 dark:border-amber-900/50',
    danger: 'bg-[var(--danger-subtle)] text-[var(--danger-foreground)] border-red-200 dark:border-red-900/50',
    outline: 'border border-border text-foreground bg-transparent',
    peach: 'bg-[var(--accent-peach)] text-[var(--accent-peach-text)] border-orange-200 dark:border-orange-900/40',
    gold: 'bg-[var(--accent-gold)] text-[var(--accent-gold-text)] border-yellow-200 dark:border-yellow-900/40',
    sprout: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800'
  }

  const sizes = {
    sm: 'text-xs px-2.5 py-0.5 rounded-full font-medium',
    md: 'text-sm px-3 py-1 rounded-full font-medium'
  }

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 border transition-colors select-none',
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {children}
    </span>
  )
}
