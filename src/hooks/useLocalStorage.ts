import { useEffect, useState } from 'react';

/**
 * useState that persists to localStorage (JSON). Falls back to `initial`
 * when nothing is stored or parsing fails.
 */
export function useLocalStorage<T>(key: string, initial: T) {
  const [value, setValue] = useState<T>(() => {
    try {
      const raw = localStorage.getItem(key);
      return raw === null ? initial : (JSON.parse(raw) as T);
    } catch {
      return initial;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {
      // ignore storage errors (private mode, quota, ...)
    }
  }, [key, value]);

  return [value, setValue] as const;
}
