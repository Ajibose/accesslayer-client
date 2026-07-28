import { useInfiniteQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import { courseService, type Course, type GetCoursesParams } from '@/services/course.service';
import { queryKeys } from '@/lib/queryKeys';

const FIRST_PAGE = 1;

/**
 * Cursor-based (page-number) infinite pagination over the creator key
 * marketplace listing, backed by React Query's useInfiniteQuery (#685).
 *
 * Replaces "load everything up front, reveal more client-side" with real
 * paged fetches: only the first page loads initially, later pages fetch on
 * demand via `fetchNextPage` (wire this to a useInfiniteScroll sentinel),
 * and fetching stops once the last page reports `hasMore: false`.
 */
export function useInfiniteCreatorMarketplace(params?: Omit<GetCoursesParams, 'page'>) {
	const query = useInfiniteQuery({
		queryKey: queryKeys.creators.infiniteList(params),
		queryFn: ({ pageParam }) => courseService.getCoursesPage(pageParam, params),
		initialPageParam: FIRST_PAGE,
		getNextPageParam: lastPage => (lastPage.hasMore ? lastPage.page + 1 : undefined),
	});

	// De-duplicate creators across pages by id -- a creator that shifts
	// position between page fetches (e.g. sort order changing as data
	// updates) should never be rendered twice.
	const creators = useMemo<Course[]>(() => {
		const seen = new Set<string>();
		const result: Course[] = [];
		for (const page of query.data?.pages ?? []) {
			for (const creator of page.items) {
				if (seen.has(creator.id)) continue;
				seen.add(creator.id);
				result.push(creator);
			}
		}
		return result;
	}, [query.data]);

	return {
		creators,
		hasMore: query.hasNextPage,
		isLoadingFirstPage: query.isLoading,
		isFetchingNextPage: query.isFetchingNextPage,
		fetchNextPage: query.fetchNextPage,
		error: query.error,
	};
}
