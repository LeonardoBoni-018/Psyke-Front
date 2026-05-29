import { useEffect } from 'react'

type KeyHandler = (event: KeyboardEvent) => void

export function useKeyboard(key: string, handler: KeyHandler) {
  useEffect(() => {
    const listener = (event: KeyboardEvent) => {
      if (event.key.toLowerCase() === key.toLowerCase()) {
        handler(event)
      }
    }

    window.addEventListener('keydown', listener)
    return () => window.removeEventListener('keydown', listener)
  }, [key, handler])
}
