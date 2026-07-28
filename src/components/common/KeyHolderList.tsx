import { formatHolderCount, formatPercent } from '@/utils/numberFormat.utils';
import { rankKeyHolders, type KeyHolder } from '@/utils/keyHolderRanking.utils';

export interface KeyHolderListProps {
	holders: KeyHolder[];
}

/**
 * Ranks investors by key count and shows each holder's share of the total
 * supply held across the list (#697). Sorting and rank/share math live in
 * `rankKeyHolders` (utils/keyHolderRanking.utils.ts) so they're covered by
 * pure-function unit tests independent of rendering.
 */
const KeyHolderList: React.FC<KeyHolderListProps> = ({ holders }) => {
	const ranked = rankKeyHolders(holders);

	if (ranked.length === 0) {
		return (
			<p className="py-8 text-center text-sm text-white/50" data-testid="key-holder-list-empty">
				No holders yet.
			</p>
		);
	}

	return (
		<ol className="divide-y divide-white/5" data-testid="key-holder-list">
			{ranked.map(holder => (
				<li
					key={holder.id}
					className="flex items-center justify-between gap-3 py-3"
					data-testid="key-holder-row"
				>
					<div className="flex items-center gap-3">
						<span
							className="inline-flex size-7 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/[0.06] text-xs font-bold text-white/70"
							data-testid="key-holder-rank"
							aria-label={`Rank ${holder.rank}`}
						>
							{holder.rank}
						</span>
						<span className="text-sm font-medium text-white">{holder.displayName}</span>
					</div>
					<div className="flex items-center gap-3 text-right">
						<span className="text-sm text-white/70" data-testid="key-holder-key-count">
							{formatHolderCount(holder.keyCount)} keys
						</span>
						<span
							className="w-16 shrink-0 text-sm font-semibold text-amber-300/90 tabular-nums"
							data-testid="key-holder-share"
						>
							{formatPercent(holder.sharePercent, { maximumFractionDigits: 1 })}
						</span>
					</div>
				</li>
			))}
		</ol>
	);
};

export default KeyHolderList;
