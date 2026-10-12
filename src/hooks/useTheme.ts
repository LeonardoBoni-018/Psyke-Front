import { useCallback, useSyncExternalStore } from 'react'

export type ThemePreference = 'light' | 'dark' | 'system'

const KEY = 'psyke-theme'
const listeners = new Set<() => void>()

function read(): ThemePreference {
  try {
    const v = localStorage.getItem(KEY)
    return v === 'light' || v === 'dark' ? v : 'system'
  } catch {
    return 'system'
  }
}

function systemPrefersDark() {
  return window.matchMedia('(prefers-color-scheme: dark)').matches
}

function apply(pref: ThemePreference, animate: boolean) {
  const dark = pref === 'dark' || (pref === 'system' && systemPrefersDark())
  const root = document.documentElement
  if (animate) {
    root.classList.add('theme-transition')
    window.setTimeout(() => root.classList.remove('theme-transition'), 260)
  }
  root.setAttribute('data-theme', dark ? 'dark' : 'light')
  document.querySelector('meta[name="theme-color"]')?.setAttribute('content', dark ? '#0d1210' : '#f3f5f2')
}

function subscribe(cb: () => void) {
  listeners.add(cb)
  // Follow the OS while the preference is "system".
  const mq = window.matchMedia('(prefers-color-scheme: dark)')
  const onSystem = () => {
    if (read() === 'system') {
      apply('system', true)
      cb()
    }
  }
  mq.addEventListener('change', onSystem)
  return () => {
    listeners.delete(cb)
    mq.removeEventListener('change', onSystem)
  }
}

export function useTheme() {
  const preference = useSyncExternalStore(subscribe, read, () => 'system' as ThemePreference)

  const setPreference = useCallback((next: ThemePreference) => {
    try {
      localStorage.setItem(KEY, next)
    } catch {
      /* storage blocked: the choice only lasts for this session */
    }
    apply(next, true)
    listeners.forEach((l) => l())
  }, [])

  const resolved: 'light' | 'dark' =
    preference === 'dark' || (preference === 'system' && typeof window !== 'undefined' && systemPrefersDark())
      ? 'dark'
      : 'light'

  return { preference, resolved, setPreference }
}
