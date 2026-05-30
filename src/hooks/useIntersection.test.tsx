import { renderHook, act } from '@testing-library/react'
import { useIntersection } from './useIntersection'

let lastObserverInstance: { callback: (entries: Partial<IntersectionObserverEntry>[]) => void; disconnect: () => void; observe: (el: Element) => void }

describe('useIntersection', () => {
  beforeEach(() => {
    class MockIntersectionObserver {
      constructor(callback: (entries: Partial<IntersectionObserverEntry>[]) => void) {
        lastObserverInstance = {
          callback,
          disconnect: vi.fn(),
          observe: vi.fn(),
        }
      }

      disconnect() { lastObserverInstance.disconnect() }
      observe(el: Element) { lastObserverInstance.observe(el) }
      unobserve = vi.fn()
      get thresholds() { return [] }
      get root() { return null }
      get rootMargin() { return '0px' }
    }

    Object.defineProperty(window, 'IntersectionObserver', {
      value: MockIntersectionObserver,
      writable: true,
      configurable: true,
    })
  })

  it('returns false initially', () => {
    const element = document.createElement('div')
    const { result } = renderHook(() => useIntersection(element))
    expect(result.current).toBe(false)
  })

  it('returns true when element becomes visible', () => {
    const element = document.createElement('div')
    const { result } = renderHook(() => useIntersection(element))

    act(() => { lastObserverInstance.callback([{ isIntersecting: true }]) })
    expect(result.current).toBe(true)
  })

  it('returns false when element is not visible', () => {
    const element = document.createElement('div')
    const { result } = renderHook(() => useIntersection(element))

    act(() => { lastObserverInstance.callback([{ isIntersecting: false }]) })
    expect(result.current).toBe(false)
  })

  it('observe is called on render', () => {
    const element = document.createElement('div')
    renderHook(() => useIntersection(element))

    expect(lastObserverInstance.observe).toHaveBeenCalledWith(element)
  })

  it('returns false when element is null', () => {
    const { result } = renderHook(() => useIntersection(null))
    expect(result.current).toBe(false)
  })

  it('disconnects observer on unmount', () => {
    const element = document.createElement('div')
    const { unmount } = renderHook(() => useIntersection(element))

    unmount()
    expect(lastObserverInstance.disconnect).toHaveBeenCalled()
  })
})
