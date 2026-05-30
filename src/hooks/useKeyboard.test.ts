import { renderHook } from '@testing-library/react'
import { useKeyboard } from './useKeyboard'

describe('useKeyboard', () => {
  it('calls handler when matching key is pressed', () => {
    const handler = vi.fn()
    renderHook(() => useKeyboard('Escape', handler))

    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }))
    expect(handler).toHaveBeenCalledTimes(1)
  })

  it('does not call handler for non-matching key', () => {
    const handler = vi.fn()
    renderHook(() => useKeyboard('Escape', handler))

    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }))
    expect(handler).not.toHaveBeenCalled()
  })

  it('is case-insensitive', () => {
    const handler = vi.fn()
    renderHook(() => useKeyboard('escape', handler))

    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }))
    expect(handler).toHaveBeenCalledTimes(1)
  })

  it('passes the keyboard event to handler', () => {
    const handler = vi.fn()
    renderHook(() => useKeyboard('Enter', handler))

    const event = new KeyboardEvent('keydown', { key: 'Enter' })
    window.dispatchEvent(event)
    expect(handler).toHaveBeenCalledWith(event)
  })

  it('cleans up event listener on unmount', () => {
    const handler = vi.fn()
    const { unmount } = renderHook(() => useKeyboard('Escape', handler))

    unmount()
    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }))
    expect(handler).not.toHaveBeenCalled()
  })
})
