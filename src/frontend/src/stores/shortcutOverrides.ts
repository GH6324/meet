import { proxy } from 'valtio'
import { Shortcut } from '@/features/shortcuts/types'

const STORAGE_KEY = 'shortcuts:overrides'

type State = {
  overrides: Map<string, Shortcut>
  isLoaded: boolean
}

export const shortcutOverridesStore = proxy<State>({
  overrides: new Map<string, Shortcut>(),
  isLoaded: false,
})

export const loadShortcutOverrides = () => {
  if (shortcutOverridesStore.isLoaded) return
  shortcutOverridesStore.isLoaded = true
  if (typeof window === 'undefined') return
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return
    const parsed = JSON.parse(raw) as Record<string, Shortcut>
    Object.entries(parsed).forEach(([id, value]) => {
      shortcutOverridesStore.overrides.set(id, value)
    })
  } catch (e) {
    console.warn('Failed to load shortcut overrides', e)
  }
}

export const getOverride = (id: string): Shortcut | undefined => {
  return shortcutOverridesStore.overrides.get(id)
}
