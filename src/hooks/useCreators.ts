import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@/lib/queryKeys';
import type { GetCoursesParams } from '@/services/course.service';

export function useCreatorList(params?: GetCoursesParams) {
	return useQuery({
		queryKey: queryKeys.creators.list(params),
		queryFn: async () => [],
	});
}

export function useCreatorDetail(id: string) {
	return useQuery({
		queryKey: queryKeys.creators.detail(id),
		queryFn: async () => null,
		enabled: !!id,
	});
}
