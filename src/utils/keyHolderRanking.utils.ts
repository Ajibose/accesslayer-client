export interface KeyHolder {
	id: string;
	displayName: string;
	keyCount: number;
}

export interface RankedKeyHolder extends KeyHolder {
	rank: number;
	sharePercent: number;
}

/**
 * Ranks holders descending by key count and computes each holder's share of
 * the total supply held across the list.
 *
 * Ranks are competition-style ("1224"): holders tied on key count share the
 * same rank, and the next distinct count resumes at its 1-indexed position
 * rather than incrementing by 1 — e.g. two holders tied for 1st both get
 * rank 1, and the following holder gets rank 3, not rank 2.
 */
export function rankKeyHolders(holders: KeyHolder[]): RankedKeyHolder[] {
	const sorted = [...holders].sort((a, b) => b.keyCount - a.keyCount);
	const totalKeys = sorted.reduce((sum, holder) => sum + holder.keyCount, 0);

	let currentRank = 0;
	let previousKeyCount: number | null = null;

	return sorted.map((holder, index) => {
		if (holder.keyCount !== previousKeyCount) {
			currentRank = index + 1;
			previousKeyCount = holder.keyCount;
		}

		return {
			...holder,
			rank: currentRank,
			sharePercent: totalKeys > 0 ? (holder.keyCount / totalKeys) * 100 : 0,
		};
	});
}
