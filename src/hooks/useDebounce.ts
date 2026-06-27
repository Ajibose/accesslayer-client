import { useEffect, useState } from 'react';

/**
 * Returns a debounced copy of `value` that updates after `delayMs` of stability.
 */
export function useDebounce<T>(value: T, delayMs: number): T {
	const [debouncedValue, setDebouncedValue] = useState(value);

	useEffect(() => {
		const timer = window.setTimeout(() => {
			setDebouncedValue(value);
		}, delayMs);

		return () => window.clearTimeout(timer);
	}, [value, delayMs]);

	return debouncedValue;
}
