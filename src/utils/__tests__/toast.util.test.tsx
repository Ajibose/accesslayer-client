import { render, screen, act } from '@testing-library/react';
import { Toaster } from 'react-hot-toast';
import toast from 'react-hot-toast';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import showToast from '../toast.util';

describe('toast util auto-dismiss and manual close', () => {
	beforeEach(() => {
		vi.useFakeTimers();
		Object.defineProperty(window, 'matchMedia', {
			writable: true,
			value: vi.fn().mockImplementation((query: string) => ({
				matches: false,
				media: query,
				onchange: null,
				addEventListener: vi.fn(),
				removeEventListener: vi.fn(),
				addListener: vi.fn(),
				removeListener: vi.fn(),
				dispatchEvent: vi.fn(),
			})),
		});
	});

	afterEach(() => {
		toast.remove();
		vi.useRealTimers();
	});

	it('toast visible immediately after render', () => {
		render(<Toaster />);

		act(() => {
			showToast.success('Success message');
		});

		expect(screen.getByText('Success message')).toBeInTheDocument();
	});

	it('toast still visible before auto-dismiss fires', () => {
		render(<Toaster />);

		act(() => {
			showToast.success('Success message');
		});

		expect(screen.getByText('Success message')).toBeInTheDocument();

		act(() => {
			vi.advanceTimersByTime(3999);
		});

		expect(screen.getByText('Success message')).toBeInTheDocument();
	});

	it('toast removed after auto-dismiss and remove delay', () => {
		render(<Toaster />);

		act(() => {
			showToast.success('Success message');
		});

		expect(screen.getByText('Success message')).toBeInTheDocument();

		act(() => {
			vi.advanceTimersByTime(4000);
		});

		act(() => {
			vi.advanceTimersByTime(1000);
		});

		expect(screen.queryByText('Success message')).not.toBeInTheDocument();
	});

	it('manual close removes the toast before the auto-dismiss timer fires', () => {
		render(<Toaster />);

		act(() => {
			showToast.success('Success message');
		});

		expect(screen.getByText('Success message')).toBeInTheDocument();

		act(() => {
			toast.dismiss();
		});

		act(() => {
			vi.advanceTimersByTime(1000);
		});

		expect(screen.queryByText('Success message')).not.toBeInTheDocument();
	});
});
