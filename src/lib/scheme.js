// Two-state colour-scheme override on top of the system preference.
// The stored value is reflected into <meta name="color-scheme">; CSS maps it to `color-scheme`.
import { useSyncExternalStore } from 'react'

const KEY = 'color-scheme'
const system = matchMedia('(prefers-color-scheme: dark)')
const meta = document.querySelector('meta[name="color-scheme"]')
const listeners = new Set()

let override = (() => {
  try { return localStorage.getItem(KEY) } catch { return null }
})()

const systemScheme = () => (system.matches ? 'dark' : 'light')
const current = () => override ?? systemScheme()
const notify = () => listeners.forEach((fn) => fn())

function apply(value) {
  override = value
  meta.content = value ?? 'light dark'
  notify()
}

system.addEventListener('change', notify)
addEventListener('storage', (e) => e.key === KEY && apply(e.newValue))

export function toggleScheme() {
  const target = current() === 'dark' ? 'light' : 'dark'
  // Matching the system means "undo my override", so forget it instead of pinning it.
  const next = target === systemScheme() ? null : target
  try {
    if (next) localStorage.setItem(KEY, next)
    else localStorage.removeItem(KEY)
  } catch { /* still applied for this visit */ }
  apply(next)
}

export function useScheme() {
  return useSyncExternalStore((fn) => {
    listeners.add(fn)
    return () => listeners.delete(fn)
  }, current)
}
