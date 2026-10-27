import { useEffect } from 'react';

interface UseExecutionKeyboardShortcutsOptions {
  totalSteps: number;
  setIsPlaying: (playing: boolean) => void;
  setStepIndex: React.Dispatch<React.SetStateAction<number>>;
  onRunToggle: () => void;
}

/**
 * Registers global keyboard shortcuts for stepping through the execution trace:
 * - ArrowRight: Next step
 * - ArrowLeft: Previous step
 * - Space: Play / Pause execution
 */
export function useExecutionKeyboardShortcuts({
  totalSteps,
  setIsPlaying,
  setStepIndex,
  onRunToggle
}: UseExecutionKeyboardShortcutsOptions) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const activeTag = (document.activeElement as HTMLElement)?.tagName;
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes(activeTag)) return;

      if (e.key === 'ArrowRight') {
        e.preventDefault();
        setIsPlaying(false);
        setStepIndex((s) => Math.min(totalSteps - 1, s + 1));
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        setIsPlaying(false);
        setStepIndex((s) => Math.max(0, s - 1));
      } else if (e.code === 'Space') {
        e.preventDefault();
        onRunToggle();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [totalSteps, setIsPlaying, setStepIndex, onRunToggle]);
}
