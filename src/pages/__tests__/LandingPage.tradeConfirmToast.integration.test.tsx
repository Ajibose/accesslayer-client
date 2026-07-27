import type { ComponentProps, ReactNode } from 'react';
import { cleanup, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import LandingPage from '@/pages/LandingPage';
import { courseService } from '@/services/course.service';
import showToast from '@/utils/toast.util';

vi.mock('@/services/course.service', () => ({
	courseService: { getCourses: vi.fn() },
}));

vi.mock('@/utils/toast.util', () => ({
	default: {
		message: vi.fn(),
		success: vi.fn(),
		error: vi.fn(),
		loading: vi.fn(),
		transactionSuccess: vi.fn(),
	},
}));

vi.mock('@/hooks/useNetworkMismatch', () => ({
	useNetworkMismatch: () => ({
		isMismatch: false,
		expectedChainName: 'Stellar Testnet',
	}),
}));

vi.mock('@/hooks/useStaleData', () => ({
	useStaleData: () => ({
		stale: false,
		ageMs: 0,
		msUntilStale: 60_000,
		revalidate: vi.fn(),
	}),
}));

vi.mock('@/components/common/StellarConnectionQualityBadge', async () => {
	const React = await import('react');

	return {
		default: () => React.createElement('div', { role: 'status' }, 'RPC good'),
	};
});

vi.mock('@/components/common/CreatorCard', async () => {
	const React = await import('react');

	return {
		default: ({ creator }: { creator: { title: string } }) =>
			React.createElement(
				'article',
				{ 'aria-label': `Creator ${creator.title}` },
				creator.title
			),
	};
});

vi.mock('framer-motion', async () => {
	const React = await import('react');
	type MotionDivProps = ComponentProps<'div'> & {
		layout?: boolean;
		transition?: unknown;
	};

	return {
		AnimatePresence: ({ children }: { children: ReactNode }) =>
			React.createElement(React.Fragment, null, children),
		LayoutGroup: ({ children }: { children: ReactNode }) =>
			React.createElement(React.Fragment, null, children),
		motion: {
			div: ({ children, ...props }: MotionDivProps) => {
				const { layout, transition, ...divProps } = props;
				void layout;
				void transition;

				return React.createElement('div', divProps, children);
			},
			h1: ({ children, ...props }: ComponentProps<'h1'>) =>
				React.createElement('h1', props, children),
			button: ({ children, ...props }: ComponentProps<'button'>) =>
				React.createElement('button', props, children),
		},
	};
});

const mockGetCourses = vi.mocked(courseService.getCourses);
const mockShowToast = vi.mocked(showToast);

const mockMatchMedia = () => {
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
};

describe('LandingPage trade confirmation toast (#540)', () => {
	beforeEach(() => {
		mockMatchMedia();
		window.localStorage.clear();
		window.sessionStorage.clear();
		mockGetCourses.mockReset();
		vi.clearAllMocks();
	});

	afterEach(() => {
		cleanup();
	});

	it('shows a success toast with quantity and creator name after a confirmed buy', async () => {
		mockGetCourses.mockResolvedValue([]);
		const user = userEvent.setup();
		render(
			<MemoryRouter>
				<LandingPage />
			</MemoryRouter>
		);

		const buyButtons = await screen.findAllByRole('button', {
			name: 'Buy',
			hidden: true,
		});
		await user.click(buyButtons[0]);

		const amountInput = await screen.findByTestId('trade-dialog-amount');
		await user.clear(amountInput);
		await user.type(amountInput, '5');

		await user.click(screen.getByTestId('trade-dialog-confirm'));

		await waitFor(
			() =>
				expect(mockShowToast.transactionSuccess).toHaveBeenCalledTimes(1),
			{ timeout: 3000 }
		);
		expect(mockShowToast.transactionSuccess).toHaveBeenCalledWith(
			'Trade confirmed',
			expect.stringMatching(/^Bought 5 keys from .+$/)
		);
	});

	it('shows a success toast with quantity and creator name after a confirmed sell', async () => {
		mockGetCourses.mockResolvedValue([]);
		const user = userEvent.setup();
		render(
			<MemoryRouter>
				<LandingPage />
			</MemoryRouter>
		);

		const sellButtons = await screen.findAllByRole('button', {
			name: 'Sell',
			hidden: true,
		});
		await user.click(sellButtons[0]);

		const amountInput = await screen.findByTestId('trade-dialog-amount');
		await user.clear(amountInput);
		await user.type(amountInput, '1');

		await user.click(screen.getByTestId('trade-dialog-confirm'));

		await waitFor(
			() =>
				expect(mockShowToast.transactionSuccess).toHaveBeenCalledTimes(1),
			{ timeout: 3000 }
		);
		expect(mockShowToast.transactionSuccess).toHaveBeenCalledWith(
			'Trade confirmed',
			expect.stringMatching(/^Sold 1 key from .+$/)
		);
	});
});
