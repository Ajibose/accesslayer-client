import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/lib/queryKeys';
import type { HeldKeyPosition } from '@/utils/portfolioValue.utils';
import showToast from '@/utils/toast.util';
import { getSignatureErrorMessage } from '@/utils/errorHandling.utils';

export function useWalletHoldings(address: string) {
	return useQuery<HeldKeyPosition[]>({
		queryKey: queryKeys.wallet.holdings(address),
		queryFn: async () => [],
		enabled: !!address,
	});
}

export function useWalletActivity(address: string) {
	return useQuery({
		queryKey: queryKeys.wallet.activity(address),
		queryFn: async () => [],
		enabled: !!address,
	});
}

export interface TradeVariables {
	creatorId: string;
	amount: number;
	priceStroops: number | null | undefined;
	price: number | null | undefined;
}

export function useTradeMutation(address: string) {
	const queryClient = useQueryClient();

	const mutation = useMutation({
		mutationKey: ['trade', address],
		mutationFn: async ({ creatorId: _creatorId, amount: _amount }: TradeVariables) => {
			await new Promise<void>(resolve => window.setTimeout(resolve, 900));
			return { success: true as const };
		},
		onMutate: async ({ creatorId, amount, priceStroops, price }: TradeVariables) => {
			const queryKey = queryKeys.wallet.holdings(address);

			await queryClient.cancelQueries({ queryKey });

			const previousHoldings = queryClient.getQueryData<HeldKeyPosition[]>(queryKey) ?? [];

			queryClient.setQueryData<HeldKeyPosition[]>(queryKey, (old = []) => {
				const existing = old.find(h => h.creatorId === creatorId);
				if (existing) {
					return old.map(h =>
						h.creatorId === creatorId
							? { ...h, quantity: (h.quantity ?? 0) + amount, pending: true }
							: h
					);
				}
				return [
					...old,
					{
						creatorId,
						quantity: amount,
						priceStroops: priceStroops ?? null,
						price: price ?? null,
						pending: true,
					},
				];
			});

			return { previousHoldings };
		},
		onError: (error, _variables, context) => {
			if (context?.previousHoldings) {
				queryClient.setQueryData(
					queryKeys.wallet.holdings(address),
					context.previousHoldings
				);
			}
			showToast.error(getSignatureErrorMessage(error));
		},
		onSuccess: (_data, variables) => {
			queryClient.setQueryData<HeldKeyPosition[]>(
				queryKeys.wallet.holdings(address),
				(old = []) =>
					old.map(h =>
						h.creatorId === variables.creatorId
							? { ...h, pending: false }
							: h
					)
			);
			showToast.transactionSuccess(
				'Trade confirmed',
				`Holdings refreshed: +${variables.amount} keys.`
			);
		},
		onSettled: () => {
			queryClient.invalidateQueries({ queryKey: queryKeys.wallet.holdings(address) });
		},
	});

	return mutation;
}
