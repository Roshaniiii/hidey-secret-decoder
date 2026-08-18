export function FeedbackButton() {
  return (
    <button
      type="button"
      aria-label="Send feedback"
      data-tally-open="GxOpVk"
      data-tally-emoji-text="💌"
      data-tally-emoji-animation="none"
      data-tally-auto-close="0"
      className="fixed bottom-4 right-4 z-50 flex items-center gap-2 rounded-full bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground shadow-lg transition-all hover:shadow-xl hover:bg-primary/90"
    >
      <span aria-hidden="true">💌</span>
      <span className="hidden sm:inline">Feedback</span>
    </button>
  );
}
