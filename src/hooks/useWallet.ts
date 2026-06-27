import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@/lib/queryKeys';

export function useWalletHoldings(address: string) {
	return useQuery({
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
