import { useState, useEffect } from 'react';

/**
 * Debounce a value by the specified delay in ms.
 * Useful for search inputs to avoid excessive API calls.
 */
export const useDebounce = (value, delay = 400) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);

  return debouncedValue;
};
