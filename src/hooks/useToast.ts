import { useCallback, useRef, useState } from 'react'
import { TOAST_MS } from '../constants'

export function useToast() {
  const [toast, setToast] = useState<string | null>(null)
  const timer = useRef<number | undefined>(undefined)

  const showToast = useCallback((msg: string) => {
    setToast(msg)
    window.clearTimeout(timer.current)
    timer.current = window.setTimeout(() => setToast(null), TOAST_MS)
  }, [])

  return { toast, showToast }
}
