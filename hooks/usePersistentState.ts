import { useState, useEffect, useCallback } from 'react';

/**
 * Custom hook that automatically persists state to localStorage
 */
export function usePersistentState<T>(
  key: string,
  initialValue: T,
  saveFunction: (value: T) => void,
  loadFunction: (fallback: T) => T
) {
  // Load initial state from localStorage or use provided initial value
  const [state, setState] = useState<T>(() => {
    return loadFunction(initialValue);
  });

  // Auto-save whenever state changes
  useEffect(() => {
    saveFunction(state);
  }, [state, saveFunction]);

  // Provide a way to reset to initial value
  const resetState = useCallback(() => {
    setState(initialValue);
  }, [initialValue]);

  return [state, setState, resetState] as const;
}

/**
 * Debounced version for frequently changing data
 */
export function useDebouncedPersistentState<T>(
  key: string,
  initialValue: T,
  saveFunction: (value: T) => void,
  loadFunction: (fallback: T) => T,
  delay: number = 500
) {
  const [state, setState] = useState<T>(() => {
    return loadFunction(initialValue);
  });

  // Debounced save effect
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      saveFunction(state);
    }, delay);

    return () => clearTimeout(timeoutId);
  }, [state, saveFunction, delay]);

  const resetState = useCallback(() => {
    setState(initialValue);
  }, [initialValue]);

  return [state, setState, resetState] as const;
}