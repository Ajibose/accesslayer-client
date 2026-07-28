import { useInfiniteCreatorMarketplace } from '@/hooks/useInfiniteCreatorMarketplace';
import { useInfiniteScroll } from '@/hooks/useInfiniteScroll';
import CreatorCard from '@/components/common/CreatorCard';
import { CreatorGridSkeleton } from '@/components/common/CreatorSkeleton';
import type { GetCoursesParams } from '@/services/course.service';

export interface CreatorMarketplaceInfiniteListProps {
	params?: Omit<GetCoursesParams, 'page'>;
}

/**
 * Creator key marketplace listing with IntersectionObserver-driven infinite
 * scroll (#685): fetches the first page on mount, then automatically fetches
 * subsequent pages via useInfiniteQuery as the user scrolls the sentinel
 * element into view. Shows a skeleton row while the next page is loading and
 * stops fetching once the backend reports no more pages.
 */
export default function CreatorMarketplaceInfiniteList({
	params,
}: CreatorMarketplaceInfiniteListProps) {
	const {
		creators,
		hasMore,
		isLoadingFirstPage,
		isFetchingNextPage,
		isRefreshing,
		fetchNextPage,
	} = useInfiniteCreatorMarketplace(params);

	const sentinelRef = useInfiniteScroll<HTMLDivElement>({
		enabled: !isLoadingFirstPage && !isFetchingNextPage,
		hasMore: Boolean(hasMore),
		onLoadMore: () => {
			void fetchNextPage();
		},
	});

	if (isLoadingFirstPage) {
		return (
			<div data-testid="creator-marketplace-initial-skeleton">
				<CreatorGridSkeleton />
			</div>
		);
	}

	return (
		<div data-testid="creator-marketplace-infinite-list">
			{isRefreshing && (
				<div
					data-testid="creator-marketplace-refreshing-indicator"
					role="status"
					aria-live="polite"
					className="mb-3 text-xs text-muted-foreground"
				>
					Refreshing…
				</div>
			)}
			<div className="grid w-full grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
				{creators.map(creator => (
					<CreatorCard key={creator.id} creator={creator} />
				))}
			</div>

			{isFetchingNextPage && (
				<div data-testid="creator-marketplace-next-page-skeleton" className="mt-6">
					<CreatorGridSkeleton count={3} />
				</div>
			)}

			{hasMore && (
				<div ref={sentinelRef} data-testid="creator-marketplace-sentinel" aria-hidden="true" />
			)}
		</div>
	);
}
