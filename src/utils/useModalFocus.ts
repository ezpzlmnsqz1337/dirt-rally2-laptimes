import { onBeforeUnmount, onMounted, ref, watch, type Ref } from 'vue'

const FOCUSABLE = [
  'a[href]',
  'button:not([disabled])',
  'input:not([disabled])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])'
].join(',')

const isVisible = (el: HTMLElement) => el.offsetParent !== null || el.getClientRects().length > 0

/**
 * Dialog keyboard model shared by the dirt2 modals: focus moves into the
 * dialog, Tab is trapped, Escape closes, and focus returns to the trigger.
 *
 * `isActive` must mirror the dialog's visibility: the stacked modals stay
 * mounted under `v-show`, so mounting alone cannot drive the focus move.
 */
export function useModalFocus(
  dialogRef: Ref<HTMLElement | null>,
  onClose: () => void,
  isActive: Ref<boolean> = ref(true)
) {
  let lastFocused: HTMLElement | null = null

  const onKeydown = (e: KeyboardEvent) => {
    if (!isActive.value) return
    if (e.key === 'Escape') {
      // Every dialog listens on window: only a shared immediate stop keeps the
      // dialog underneath the top one open.
      e.stopImmediatePropagation()
      onClose()
      return
    }
    if (e.key !== 'Tab') return
    const root = dialogRef.value
    if (!root) return
    const items = Array.from(root.querySelectorAll<HTMLElement>(FOCUSABLE)).filter(isVisible)
    if (items.length === 0) return
    const first = items[0]
    const last = items[items.length - 1]
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault()
      last.focus()
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault()
      first.focus()
    }
  }

  const enter = () => {
    lastFocused = document.activeElement instanceof HTMLElement ? document.activeElement : null
    window.addEventListener('keydown', onKeydown)
    const root = dialogRef.value
    if (!root) return
    const target = root.querySelector<HTMLElement>(FOCUSABLE)
    ;(target ?? root).focus()
  }

  const leave = () => {
    window.removeEventListener('keydown', onKeydown)
    const trigger = lastFocused
    lastFocused = null
    if (trigger?.isConnected) trigger.focus()
  }

  onMounted(() => {
    if (isActive.value) enter()
  })

  // Post-flush: a `v-show` dialog is only focusable once the DOM has updated.
  watch(isActive, active => (active ? enter() : leave()), { flush: 'post' })

  onBeforeUnmount(leave)
}
