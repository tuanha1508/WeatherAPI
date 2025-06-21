import { X, CheckCircle, XCircle } from 'lucide-react'
import { cn } from '@/lib/utils'

interface AlertProps {
  message: string
  type: 'success' | 'error'
  onClose: () => void
}

export default function Alert({ message, type, onClose }: AlertProps) {
  return (
    <div className={cn(
      "relative px-4 py-3 rounded-lg border mb-4 animate-in slide-in-from-top-2 duration-300",
      type === 'success' 
        ? "bg-green-50 border-green-200 text-green-800" 
        : "bg-red-50 border-red-200 text-red-800"
    )}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {type === 'success' ? (
            <CheckCircle className="h-4 w-4" />
          ) : (
            <XCircle className="h-4 w-4" />
          )}
          <span className="text-sm font-medium">{message}</span>
        </div>
        
        <button
          onClick={onClose}
          className={cn(
            "p-1 rounded hover:bg-opacity-20 transition-colors",
            type === 'success' ? "hover:bg-green-600" : "hover:bg-red-600"
          )}
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
} 