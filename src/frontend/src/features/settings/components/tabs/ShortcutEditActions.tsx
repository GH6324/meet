/**
 * Edit and reset feature, not used yet
 *
 * This component handles edit and reset actions for keyboard shortcuts.
 * To use it, uncomment the import and usage in ShortcutTab.tsx
 */

import { useCallback, useState } from 'react'
import { Shortcut } from '@/features/shortcuts/types'
import { css } from '@/styled-system/css'
import { useTranslation } from 'react-i18next'
import { buttonRecipe } from '@/primitives/buttonRecipe'
import { removeOverride, setOverride } from '@/stores/shortcutOverrides'

const buttonLink = buttonRecipe({ variant: 'secondary', size: 'sm' })

export interface ShortcutEditActionsProps {
  shortcutId: string
  actionLabel: string
  srShortcut: string
  hasOverride: boolean
  onConfirmationChange?: (message: string) => void
}

export const ShortcutEditActions = ({
  shortcutId,
  actionLabel,
  srShortcut,
  hasOverride,
  onConfirmationChange,
}: ShortcutEditActionsProps) => {
  const { t } = useTranslation(['settings'])
  const [editingId, setEditingId] = useState<string | null>(null)

  const handleStartEdit = useCallback(() => {
    setEditingId(shortcutId)
  }, [shortcutId])

  const handleReset = useCallback(() => {
    removeOverride(shortcutId)
    const message = t('shortcutsEditor.resetConfirmation', {
      defaultValue: 'Shortcut reset',
    })
    onConfirmationChange?.(message)
    setTimeout(() => onConfirmationChange?.(''), 3000)
  }, [shortcutId, t, onConfirmationChange])

  const handleKeyCapture = useCallback(
    (e: React.KeyboardEvent<HTMLButtonElement>) => {
      e.preventDefault()
      const { key, ctrlKey, shiftKey, altKey } = e
      // Ignore modifier-only keys
      if (
        !key ||
        key === 'Control' ||
        key === 'Meta' ||
        key === 'Shift' ||
        key === 'Alt' ||
        key === 'Tab' ||
        key === 'Escape'
      )
        return
      const normalized: Shortcut = {
        key,
        ctrlKey,
        shiftKey,
        altKey,
      }
      setOverride(shortcutId, normalized)
      setEditingId(null)
      const message = t('shortcutsEditor.modifiedConfirmation', {
        defaultValue: 'Shortcut modified',
      })
      onConfirmationChange?.(message)
      setTimeout(() => onConfirmationChange?.(''), 3000)
    },
    [shortcutId, t, onConfirmationChange]
  )

  const handleEditButtonKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLButtonElement>) => {
      // If already in edit mode, capture the key
      if (editingId === shortcutId) {
        handleKeyCapture(e)
        return
      }
      // Otherwise, if it's Enter or Space, start edit mode (like a click)
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault()
        handleStartEdit()
      }
    },
    [editingId, shortcutId, handleKeyCapture, handleStartEdit]
  )

  const editButtonLabel =
    editingId === shortcutId
      ? t('shortcutsEditor.capture')
      : t('shortcutsEditor.edit')
  const editButtonAriaLabel =
    editingId === shortcutId
      ? t('shortcutsEditor.captureAria', {
          defaultValue: 'Press keys to set shortcut for {{action}}',
          action: actionLabel,
        })
      : t('shortcutsEditor.editAria', {
          defaultValue: 'Edit shortcut for {{action}}',
          action: actionLabel,
        })
  const resetButtonAriaLabel = t('shortcutsEditor.resetAria', {
    defaultValue: 'Reset shortcut for {{action}}',
    action: actionLabel,
  })

  return (
    <div
      role="group"
      aria-label={t('shortcutsEditor.actionsGroupAria', {
        defaultValue: 'Actions for {{action}}',
        action: actionLabel,
      })}
      className={css({
        display: 'flex',
        gap: '0.35rem',
        justifyContent: 'flex-end',
      })}
    >
      <button
        type="button"
        className={buttonLink}
        onKeyDown={handleEditButtonKeyDown}
        onClick={handleStartEdit}
        aria-pressed={editingId === shortcutId}
        aria-label={editButtonAriaLabel}
        aria-describedby={`shortcut-${shortcutId}-description`}
      >
        {editButtonLabel}
      </button>
      <button
        type="button"
        className={buttonLink}
        onClick={handleReset}
        aria-disabled={!hasOverride}
        disabled={!hasOverride}
        aria-label={resetButtonAriaLabel}
        aria-describedby={`shortcut-${shortcutId}-description`}
        style={{ opacity: !hasOverride ? 0.5 : 1 }}
      >
        {t('shortcutsEditor.reset')}
      </button>
      <span id={`shortcut-${shortcutId}-description`} className="sr-only">
        {t('shortcutsEditor.currentShortcut', {
          defaultValue: 'Current shortcut: {{shortcut}}',
          shortcut: srShortcut,
        })}
      </span>
    </div>
  )
}
