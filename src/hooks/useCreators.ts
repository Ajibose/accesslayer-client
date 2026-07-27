import { useQuery, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/lib/queryKeys';
import {
	courseService,
	type GetCoursesParams,
} from '@/services/course.service';

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
		queryFn: () => courseService.getCourse(id),
		enabled: !!id,
	});
}
