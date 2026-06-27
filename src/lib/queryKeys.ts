import type { GetCoursesParams } from '@/services/course.service';

export const queryKeys = {
	creators: {
		all: ['creators'] as const,
		list: (params?: GetCoursesParams) =>
			['creators', 'list', params ?? null] as const,
		detail: (id: string) => ['creators', 'detail', id] as const,
		holders: (creatorId: string) =>
			['creators', creatorId, 'holders'] as const,
	},
	wallet: {
		holdings: (address: string) => ['wallet', address, 'holdings'] as const,
		activity: (address: string) => ['wallet', address, 'activity'] as const,
	},
};
