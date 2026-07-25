import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router';

interface NavigationTiming {
	route: string;
	dom_content_loaded_ms: number;
	load_event_ms: number;
	time_to_first_byte_ms: number;
}

function readNavigationTiming(): {
	timing: NavigationTiming;
	startTime: number;
} | null {
	const entries = performance.getEntriesByType('navigation');
	if (!entries.length) return null;

	const nav = entries[0] as PerformanceNavigationTiming;

	return {
		timing: {
			route: window.location.pathname,
			dom_content_loaded_ms: Math.round(
				nav.domContentLoadedEventEnd - nav.startTime
			),
			load_event_ms: Math.round(nav.loadEventEnd - nav.startTime),
			time_to_first_byte_ms: Math.round(
				nav.responseStart - nav.requestStart
			),
		},
		startTime: nav.startTime,
	};
}

export function useNavigationTiming() {
	const location = useLocation();
	const loggedStartTime = useRef<number | null>(null);

	useEffect(() => {
		function emit() {
			const result = readNavigationTiming();
			if (!result) return;
			if (loggedStartTime.current === result.startTime) return;

			loggedStartTime.current = result.startTime;
			console.debug('[navigation-timing]', result.timing);
		}

		if (document.readyState === 'complete') {
			emit();
		} else {
			window.addEventListener('load', emit, { once: true });
			return () => window.removeEventListener('load', emit);
		}
	}, [location]);
}
