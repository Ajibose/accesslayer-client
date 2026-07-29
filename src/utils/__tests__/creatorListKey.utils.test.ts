import { describe, expect, it } from 'vitest';
import { creatorListKey } from '@/utils/creatorListKey.utils';

describe('creatorListKey', () => {
	it.each([
		[1, 'creator-1'],
		[42, 'creator-42'],
		[9_999, 'creator-9999'],
	])('returns a stable creator key for creator id %i', (creatorId, key) => {
		expect(creatorListKey(creatorId)).toBe(key);
	});
});
