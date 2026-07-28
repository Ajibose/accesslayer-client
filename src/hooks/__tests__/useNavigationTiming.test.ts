/**
 * Unit tests for useNavigationTiming — logs TTFB/DCL/load-complete via the
 * Navigation Timing API after each mount of the marketplace and creator
 * profile pages (#693).
 */
import { renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { useNavigationTiming } from '../useNavigationTiming';

function mockNavigationEntry(overrides: Partial<PerformanceNavigationTiming> = {}) {
	const entry = {
		requestStart: 10,
		responseStart: 60,
		startTime: 0,
		domContentLoadedEventEnd: 200,
		loadEventEnd: 350,
		...overrides,
	} as PerformanceNavigationTiming;

	vi.spyOn(performance, 'getEntriesByType').mockReturnValue([entry]);
	return entry;
}

describe('useNavigationTiming', () => {
	let originalReadyState: string;

	beforeEach(() => {
		originalReadyState = document.readyState;
	});

	afterEach(() => {
		vi.restoreAllMocks();
		vi.unstubAllEnvs();
		Object.defineProperty(document, 'readyState', {
			value: originalReadyState,
			configurable: true,
		});
	});

	function setProd(value: boolean) {
		vi.stubEnv('PROD', value);
	}

	function setReadyState(value: DocumentReadyState) {
		Object.defineProperty(document, 'readyState', { value, configurable: true });
	}

	it('does not log when not in production mode', () => {
		setProd(false);
		setReadyState('complete');
		mockNavigationEntry();
		const infoSpy = vi.spyOn(console, 'info').mockImplementation(() => {});

		renderHook(() => useNavigationTiming('marketplace'));

		expect(infoSpy).not.toHaveBeenCalled();
	});

	it('logs ttfb, dcl, load_complete, and page_name in production mode', () => {
		setProd(true);
		setReadyState('complete');
		mockNavigationEntry({
			requestStart: 10,
			responseStart: 60,
			startTime: 0,
			domContentLoadedEventEnd: 200,
			loadEventEnd: 350,
		});
		const infoSpy = vi.spyOn(console, 'info').mockImplementation(() => {});

		renderHook(() => useNavigationTiming('marketplace'));

		expect(infoSpy).toHaveBeenCalledWith('[page-load-perf]', {
			page_name: 'marketplace',
			ttfb: 50,
			dcl: 200,
			load_complete: 350,
		});
	});

	it('logs after the load event when the document has not finished loading yet', () => {
		setProd(true);
		setReadyState('loading');
		mockNavigationEntry();
		const infoSpy = vi.spyOn(console, 'info').mockImplementation(() => {});

		renderHook(() => useNavigationTiming('creator_profile'));

		expect(infoSpy).not.toHaveBeenCalled();

		window.dispatchEvent(new Event('load'));

		expect(infoSpy).toHaveBeenCalledWith(
			'[page-load-perf]',
			expect.objectContaining({ page_name: 'creator_profile' })
		);
	});

	it('logs only once per mount even if the hook re-renders', () => {
		setProd(true);
		setReadyState('complete');
		mockNavigationEntry();
		const infoSpy = vi.spyOn(console, 'info').mockImplementation(() => {});

		const { rerender } = renderHook(({ page }) => useNavigationTiming(page), {
			initialProps: { page: 'marketplace' },
		});

		rerender({ page: 'marketplace' });
		rerender({ page: 'marketplace' });

		expect(infoSpy).toHaveBeenCalledTimes(1);
	});

	it('does nothing when no navigation timing entry is available', () => {
		setProd(true);
		setReadyState('complete');
		vi.spyOn(performance, 'getEntriesByType').mockReturnValue([]);
		const infoSpy = vi.spyOn(console, 'info').mockImplementation(() => {});

		renderHook(() => useNavigationTiming('marketplace'));

		expect(infoSpy).not.toHaveBeenCalled();
	});
});
