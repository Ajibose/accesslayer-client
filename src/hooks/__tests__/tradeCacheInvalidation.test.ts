/**
 * Unit test for structured cache invalidation log after a confirmed trade (#636).
 */
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react';
import React from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useTradeMutation } from '../useWallet';

vi.mock('@/utils/toast.util', () => ({
	default: {
		message: vi.fn(),
		success: vi.fn(),
		error: vi.fn(),
		loading: vi.fn(),
		transactionSuccess: vi.fn(),
	},
}));

function createWrapper() {
	const queryClient = new QueryClient({
		defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
	});
	return function Wrapper({ children }: { children: React.ReactNode }) {
		return React.createElement(QueryClientProvider, { client: queryClient }, children);
	};
}

describe('useTradeMutation cache invalidation log (#636)', () => {
	it('emits a structured debug log after trade settlement in non-test environment', async () => {
		const originalEnv = process.env.NODE_ENV;
		process.env.NODE_ENV = 'development';
		const debugSpy = vi.spyOn(console, 'debug').mockImplementation(() => {});

		const wrapper = createWrapper();
		const { result } = renderHook(() => useTradeMutation('GWALLET'), { wrapper });

		result.current.mutate({
			creatorId: 'creator-1',
			amount: 3,
			priceStroops: 1_000_000,
			price: 0.1,
		});

		await waitFor(() => expect(result.current.isSuccess).toBe(true), { timeout: 3000 });

		expect(debugSpy).toHaveBeenCalledWith(
			'[cache-invalidation]',
			expect.objectContaining({
				invalidated_keys: expect.arrayContaining([expect.any(String)]),
				trigger: 'buy',
				creator_id: 'creator-1',
				invalidated_at: expect.any(String),
			}),
		);

		debugSpy.mockRestore();
		process.env.NODE_ENV = originalEnv;
	});

	it('does not emit the log in test environment', async () => {
		const debugSpy = vi.spyOn(console, 'debug').mockImplementation(() => {});

		const wrapper = createWrapper();
		const { result } = renderHook(() => useTradeMutation('GWALLET'), { wrapper });

		result.current.mutate({
			creatorId: 'creator-2',
			amount: -1,
			priceStroops: 500_000,
			price: 0.05,
		});

		await waitFor(() => expect(result.current.isSuccess).toBe(true), { timeout: 3000 });

		expect(debugSpy).not.toHaveBeenCalled();

		debugSpy.mockRestore();
	});
});
