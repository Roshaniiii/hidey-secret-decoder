export const TALLY_FORM_ID = "GxOpVk";
const COOKIE_NAME = "hidey_feedback_seen";

declare global {
  interface Window {
    Tally?: {
      openPopup: (formId: string, options?: Record<string, unknown>) => void;
      closePopup?: (formId: string) => void;
    };
  }
}

export function hasSeenFeedback(): boolean {
  if (typeof document === "undefined") return true;
  return document.cookie.split("; ").some((c) => c.startsWith(`${COOKIE_NAME}=1`));
}

export function markFeedbackSeen() {
  if (typeof document === "undefined") return;
  const oneYear = 60 * 60 * 24 * 365;
  document.cookie = `${COOKIE_NAME}=1; path=/; max-age=${oneYear}; SameSite=Lax`;
}

function waitForTally(cb: () => void, attempts = 40) {
  if (window.Tally) return cb();
  if (attempts <= 0) return;
  setTimeout(() => waitForTally(cb, attempts - 1), 250);
}

export function openFeedbackPopup(options?: { markSeen?: boolean }) {
  waitForTally(() => {
    window.Tally?.openPopup(TALLY_FORM_ID, {
      emoji: { text: "💌", animation: "none" },
      autoClose: 0,
      onClose: () => options?.markSeen && markFeedbackSeen(),
      onSubmit: () => options?.markSeen && markFeedbackSeen(),
    });
  });
}

/** Opens the popup only once ever per user (cookie-remembered). */
export function openFeedbackPopupOnce() {
  if (hasSeenFeedback()) return;
  openFeedbackPopup({ markSeen: true });
}
