import { cn } from '../../lib/utils'

export interface ProgressProps {
  value: number
  max?: number
  className?: string
  indicatorClassName?: string
  showLabel?: boolean
  label?: string
  colorVariant?: 'primary' | 'success' | 'amber' | 'emerald' | 'lavender'
}

export function Progress({
  value,
  max = 100,
  className,
  indicatorClassName,
  showLabel = false,
  label,
  colorVariant = 'primary'
}: ProgressProps) {
  const percentage = Math.min(100, Math.max(0, Math.round((value / max) * 100)))

  const colors = {
    primary: 'bg-primary',
    success: 'bg-emerald-600 dark:bg-emerald-500',
    amber: 'bg-amber-500 dark:bg-amber-400',
    emerald: 'bg-emerald-500',
    lavender: 'bg-purple-600 dark:bg-purple-400'
  }

  return (
    <div className={cn('w-full', className)}>
      {showLabel && (
        <div className="flex justify-between items-center text-xs font-medium text-muted-foreground mb-1.5">
          <span>{label || 'Progress'}</span>
          <span className="font-semibold text-foreground">{percentage}%</span>
        </div>
      )}
      <div 
        className="h-2.5 w-full overflow-hidden rounded-full bg-muted border border-border/50 relative"
        role="progressbar"
        aria-valuenow={percentage}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <div
          className={cn(
            'h-full rounded-full transition-all duration-700 ease-out',
            colors[colorVariant],
            indicatorClassName
          )}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  )
}
