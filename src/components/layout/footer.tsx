import { BrandLogo } from './brand-logo'

export function Footer() {
  return (
    <footer className="w-full border-t border-border/80 bg-background/50 mt-auto py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <BrandLogo iconOnly />
            <div className="text-left">
              <p className="text-xs font-bold text-foreground">
                Growlytics
              </p>
              <p className="text-[11px] text-muted-foreground">
                Grow your skills. Build your proof. Track your progress.
              </p>
            </div>
          </div>

          <div className="text-xs text-muted-foreground text-center md:text-right space-y-1">
            <p className="flex items-center justify-center md:justify-end gap-1">
              Crafted for college students preparing for technical internship interviews
            </p>
            <p className="text-[10px] text-muted-foreground/80">
              Built with React 19, TypeScript, Vite & Tailwind CSS • Local-first MVP with transparent scoring
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
