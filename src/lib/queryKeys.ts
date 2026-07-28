/**
 * Centralized React Query key factory.
 *
 * Using factory functions keeps key shapes consistent and makes it
 * trivial to invalidate a whole family of queries (e.g. all creator
 * profile queries with `queryClient.invalidateQueries({ queryKey:
 * queryKeys.creatorProfile.all() })`).
 */
export const queryKeys = {
	creatorProfile: {
		all: () => ['creatorProfile'] as const,
		byId: (creatorId: string) => ['creatorProfile', creatorId] as const,
	},
} as const;
