import { useEffect } from 'react'
import { keyboardShortcutsStore } from '@/stores/keyboardShortcuts'
import { formatShortcutKey } from '@/features/shortcuts/utils'
import { Shortcut } from '@/features/shortcuts/types'
import { ShortcutId } from './catalog'
import { getOverride, loadShortcutOverrides } from '@/stores/shortcutOverrides'

export type useRegisterKeyboardShortcutProps = {
  shortcut?: Shortcut
  shortcutId?: ShortcutId
  fallbackShortcut?: Shortcut
  handler: () => Promise<void | boolean | undefined> | void
  isDisabled?: boolean
}

export const useRegisterKeyboardShortcut = ({
  shortcut,
  shortcutId,
  fallbackShortcut,
  handler,
  isDisabled = false,
}: useRegisterKeyboardShortcutProps) => {
  useEffect(() => {
    loadShortcutOverrides()
    const effectiveShortcut =
      (shortcutId ? getOverride(shortcutId) : undefined) ||
      fallbackShortcut ||
      shortcut
    if (!effectiveShortcut) return
    const formattedKey = formatShortcutKey(effectiveShortcut)
    if (isDisabled) {
      keyboardShortcutsStore.shortcuts.delete(formattedKey)
    } else {
      keyboardShortcutsStore.shortcuts.set(formattedKey, handler)
    }
  }, [handler, shortcutId, shortcut, fallbackShortcut, isDisabled])
}
