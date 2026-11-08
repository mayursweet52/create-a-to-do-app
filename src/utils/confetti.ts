import confetti from 'canvas-confetti';

export function fireConfetti(enabled = true) {
  if (!enabled) return;

  try {
    confetti({
      particleCount: 70,
      spread: 60,
      origin: { y: 0.8 },
      colors: ['#6366f1', '#10b981', '#f59e0b', '#ec4899', '#3b82f6'],
      ticks: 200,
    });
  } catch {
    // Ignore if canvas-confetti fails
  }
}

export function fireCelebrationShower(enabled = true) {
  if (!enabled) return;

  try {
    const end = Date.now() + 1.2 * 1000;
    const colors = ['#6366f1', '#10b981', '#f59e0b', '#ec4899', '#38bdf8'];

    (function frame() {
      confetti({
        particleCount: 4,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: colors
      });
      confetti({
        particleCount: 4,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: colors
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    }());
  } catch {
    // Ignore
  }
}
