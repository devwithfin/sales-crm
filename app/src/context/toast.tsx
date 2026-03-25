import { createContext, useCallback, useContext, useMemo, useRef, useState, type ReactNode } from "react"
import { AlertCircle, CheckCircle2, X } from "lucide-react"
import { cn } from "@/lib/utils"

type ToastType = "success" | "error"

type Toast = {
    id: number
    type: ToastType
    message: string
    duration: number
}

type ToastContextValue = {
    showToast: (options: { type: ToastType; message: string; duration?: number }) => void
}

const ToastContext = createContext<ToastContextValue | undefined>(undefined)
const DEFAULT_TOAST_DURATION = 4000

export function ToastProvider({ children }: { children: ReactNode }) {
    const [toasts, setToasts] = useState<Toast[]>([])
    const timersRef = useRef<Record<number, ReturnType<typeof setTimeout>>>({})

    const dismissToast = useCallback((id: number) => {
        if (timersRef.current[id]) {
            clearTimeout(timersRef.current[id])
            delete timersRef.current[id]
        }
        setToasts(prev => prev.filter(toast => toast.id !== id))
    }, [])

    const showToast = useCallback(({ message, type, duration = DEFAULT_TOAST_DURATION }: { type: ToastType; message: string; duration?: number }) => {
        const id = Date.now()
        setToasts(prev => [...prev, { id, message, type, duration }])

        timersRef.current[id] = setTimeout(() => {
            dismissToast(id)
        }, duration)
    }, [dismissToast])

    const value = useMemo(() => ({ showToast }), [showToast])

    return (
        <ToastContext.Provider value={value}>
            {children}
            <div className="pointer-events-none fixed top-4 right-4 z-[9999] flex w-full max-w-xs flex-col gap-3 sm:max-w-sm">
                {toasts.map(toast => (
                    <div
                        key={toast.id}
                        className={cn(
                            "pointer-events-auto relative flex w-full items-start gap-3 overflow-hidden rounded-2xl border p-4 shadow-2xl ring-1 ring-black/5 backdrop-blur-md transition-all",
                            toast.type === "success"
                                ? "border-emerald-200/70 bg-emerald-50/90 text-emerald-900"
                                : "border-red-200/70 bg-red-50/90 text-red-900"
                        )}>
                        <div
                            className={cn(
                                "rounded-full p-1.5",
                                toast.type === "success" ? "bg-emerald-100 text-emerald-600" : "bg-red-100 text-red-600"
                            )}>
                            {toast.type === "success" ? <CheckCircle2 className="size-4.5" /> : <AlertCircle className="size-4.5" />}
                        </div>
                        <div className="flex-1 text-sm font-medium leading-relaxed">{toast.message}</div>
                        <button
                            type="button"
                            aria-label="Dismiss notification"
                            onClick={() => dismissToast(toast.id)}
                            className="text-slate-400 transition-colors hover:text-slate-700">
                            <X className="size-4" />
                        </button>
                        <div className="absolute bottom-0 left-0 right-0 h-1 bg-current/10">
                            <span
                                className="toast-progress block h-full bg-current/50"
                                style={{ animationDuration: `${toast.duration}ms` }}
                            />
                        </div>
                    </div>
                ))}
            </div>
        </ToastContext.Provider>
    )
}

export function useToast() {
    const context = useContext(ToastContext)
    if (!context) {
        throw new Error("useToast must be used within a ToastProvider")
    }
    return context
}
