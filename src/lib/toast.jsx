import { createContext, useCallback, useContext, useRef, useState } from 'react'

const ToastContext = createContext(() => {})
export const useToast = () => useContext(ToastContext)

export function ToastProvider({ children }) {
  const [message, setMessage] = useState('')
  const timer = useRef()

  const show = useCallback((text) => {
    clearTimeout(timer.current)
    setMessage(text)
    timer.current = setTimeout(() => setMessage(''), 3500)
  }, [])

  return (
    <ToastContext value={show}>
      {children}
      {/* The live region is always mounted so screen readers announce changes to it. */}
      <div className="toast" role="status" aria-live="polite" data-open={message ? '' : undefined}>
        {message}
      </div>
    </ToastContext>
  )
}
