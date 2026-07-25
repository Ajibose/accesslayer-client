import { useQuery, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/lib/queryKeys';
import type { GetCoursesParams } from '@/services/course.service';

export function useCreatorList(params?: GetCoursesParams) {
	return useQuery({
		queryKey: queryKeys.creators.list(params),
		queryFn: async () => [],
	});
}

export function useCreatorDetail(id: string) {
	const queryClient = useQueryClient();

	return useQuery({
		queryKey: queryKeys.creators.detail(id),
		queryFn: async () => {
			const key = queryKeys.creators.detail(id);
			const cached = queryClient.getQueryData(key);
			const isCacheMiss = cached === undefined;

			if (isCacheMiss && typeof process !== 'undefined' && process.env?.NODE_ENV !== 'test') {
				const startMs = Date.now();
				const result = await Promise.resolve(null);
				const duration_ms = Date.now() - startMs;

				console.debug('[creator-profile]', {
					creator_id: id,
					cache_status: 'miss',
					duration_ms,
				});

				return result;
			}

			return null;
		},
		enabled: !!id,
	});
}
