import { useState, useEffect } from 'react';

export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    // Actualiza el valor debounced después del retraso especificado
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Cancela el timeout si el valor cambia (el usuario sigue escribiendo)
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}