import { Dialog } from '../ui/dialog'
import { Button } from '../ui/button'
import { AlertTriangle } from 'lucide-react'

interface DeleteConfirmModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  projectTitle: string
}

export function DeleteConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  projectTitle
}: DeleteConfirmModalProps) {
  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      title="Delete Project?"
      description="This action cannot be undone."
      maxWidth="sm"
    >
      <div className="space-y-4 pt-1">
        <div className="flex items-start gap-3 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-xs text-red-700 dark:text-red-300">
          <AlertTriangle className="w-5 h-5 shrink-0 text-red-600 dark:text-red-400 mt-0.5" />
          <div className="space-y-1">
            <p className="font-bold">Are you sure you want to delete this project?</p>
            <p>
              Removing <strong className="font-semibold text-foreground">"{projectTitle}"</strong> will permanently delete its milestone progress and recorded proof.
            </p>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 pt-2 border-t border-border">
          <Button variant="ghost" onClick={onClose} size="sm">
            Cancel
          </Button>
          <Button
            variant="danger"
            size="sm"
            onClick={() => {
              onConfirm()
              onClose()
            }}
          >
            Yes, Delete Project
          </Button>
        </div>
      </div>
    </Dialog>
  )
}
