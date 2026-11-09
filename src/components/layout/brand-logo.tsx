import { Sprout } from 'lucide-react'
import { cn } from '../../lib/utils'

export function BrandLogo({ className, iconOnly = false }: { className?: string; iconOnly?: boolean }) {
  return (
    <div className={cn('flex items-center gap-3 select-none', className)}>
      <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-600 via-emerald-700 to-teal-800 text-white shadow-md shadow-emerald-900/20 group">
        <Sprout className="w-5 h-5 text-emerald-100 group-hover:scale-110 transition-transform duration-300 animate-sprout" />
        <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-amber-400 rounded-full border-2 border-background animate-pulse" />
      </div>
      {!iconOnly && (
        <div className="flex flex-col">
          <div className="flex items-center gap-1.5">
            <span className="font-bold text-lg tracking-tight text-foreground font-sans">
              Growlytics
            </span>
            <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded-md bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
              MVP
            </span>
          </div>
          <span className="text-[11px] text-muted-foreground font-medium -mt-0.5">
            Internship Growth Journal
          </span>
        </div>
      )}
    </div>
  )
}
