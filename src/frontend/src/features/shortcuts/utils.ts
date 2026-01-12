import { isMacintosh } from '@/utils/livekit'
import { Shortcut } from '@/features/shortcuts/types'

export const CTRL = 'ctrl'

export const formatShortcutKey = (shortcut: Shortcut) => {
  const parts = []
  if (shortcut.ctrlKey) parts.push(CTRL)
  if (shortcut.altKey) parts.push('alt')
  if (shortcut.shiftKey) parts.push('shift')
  parts.push(shortcut.key.toUpperCase())
  return parts.join('+')
}

export const appendShortcutLabel = (label: string, shortcut: Shortcut) => {
  if (!shortcut.key) return
  let formattedKeyLabel = shortcut.key.toLowerCase()
  if (shortcut.ctrlKey) {
    formattedKeyLabel = `${isMacintosh() ? '⌘' : 'Ctrl'}+${formattedKeyLabel}`
  }
  if (shortcut.altKey) {
    formattedKeyLabel = `${isMacintosh() ? '⌥' : 'Alt'}+${formattedKeyLabel}`
  }
  if (shortcut.shiftKey) {
    formattedKeyLabel = `Shift+${formattedKeyLabel}`
  }
  return `${label} (${formattedKeyLabel})`
}
