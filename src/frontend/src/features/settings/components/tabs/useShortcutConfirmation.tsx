import { useState } from 'react'
import { text } from '@/primitives/Text'

/**
 * Hook to manage confirmation messages for edit/reset actions
 * Use in the parent component to display confirmation messages
 */
export const useShortcutConfirmation = () => {
  const [confirmationMessage, setConfirmationMessage] = useState<string>('')

  const ConfirmationMessage = () => {
    if (!confirmationMessage) return null

    return (
      <div
        role="status"
        aria-live="polite"
        aria-atomic="true"
        className={text({ variant: 'smNote' })}
      >
        {confirmationMessage}
      </div>
    )
  }

  return {
    confirmationMessage,
    setConfirmationMessage,
    ConfirmationMessage,
  }
}
