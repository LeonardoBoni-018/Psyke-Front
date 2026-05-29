import { useEffect, useState } from 'react'

export function useIntersection<T extends Element>(element: T | null, rootMargin = '0px') {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    if (!element) return

    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { rootMargin },
    )

    observer.observe(element)
    return () => observer.disconnect()
  }, [element, rootMargin])

  return isVisible
}
