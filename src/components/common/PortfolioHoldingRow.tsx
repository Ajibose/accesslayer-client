import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import LockupCountdown from '@/components/common/LockupCountdown';
import { computeRemainingLockupSeconds } from '@/utils/lockupCountdown.utils';
import { formatNumber } from '@/utils/numberFormat.utils';
import { formatDisplayKeyPrice, resolveCreatorKeyPriceStroops } from '@/utils/keyPriceDisplay.utils';
import type { HeldKeyPosition } from '@/utils/portfolioValue.utils';
import type { Course } from '@/services/course.service';
import { cn } from '@/lib/utils';

export interface PortfolioHoldingRowProps {
	position: HeldKeyPosition;
	creator?: Course;
	onBuy?: (creatorId: string) => void;
	onSell?: (creatorId: string) => void;
	isSubmitting?: boolean;
	isNetworkMismatch?: boolean;
}

export const PortfolioHoldingRow: React.FC<PortfolioHoldingRowProps> = ({
	position,
	creator,
	onBuy,
	onSell,
	isSubmitting = false,
	isNetworkMismatch = false,
}) => {
	const initialRemaining = computeRemainingLockupSeconds(position.last_buy_timestamp);
	const [isLocked, setIsLocked] = useState(initialRemaining > 0);

	return (
		<div
			className={cn(
				'flex flex-col gap-3 rounded-2xl border border-white/10 bg-white/[0.03] p-4 transition-opacity sm:flex-row sm:items-center sm:justify-between',
				position.pending && 'opacity-60'
			)}
			data-testid="portfolio-holding-row"
		>
			<div className="min-w-0 flex-1">
				<div className="flex items-center gap-2">
					<span className="truncate text-sm font-bold text-white">
						{creator?.title ?? 'Unknown creator'}
					</span>
					{position.pending && (
						<span className="inline-flex items-center gap-1 rounded-full bg-amber-400/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-amber-400">
							<span className="size-2.5 animate-spin rounded-full border-2 border-amber-400/30 border-t-amber-400" />
							Pending
						</span>
					)}
				</div>
				<div className="mt-1 text-xs text-white/55">
					{formatNumber(position.quantity)} keys ·{' '}
					{position.isPriceLoading
						? 'Refreshing price'
						: position.isPriceStale
							? 'Price stale'
							: formatDisplayKeyPrice(resolveCreatorKeyPriceStroops(position))}
				</div>
			</div>

			<div className="flex items-center gap-3 shrink-0">
				<LockupCountdown
					lastBuyTimestamp={position.last_buy_timestamp}
					onExpire={() => setIsLocked(false)}
				/>

				<div className="flex items-center gap-2">
					{onBuy && (
						<Button
							size="sm"
							className="rounded-xl"
							onClick={() => onBuy(position.creatorId)}
							disabled={isNetworkMismatch || isSubmitting}
							data-testid="holding-buy-button"
						>
							Buy
						</Button>
					)}
					{onSell && (
						<Button
							size="sm"
							variant="outline"
							className="rounded-xl"
							onClick={() => onSell(position.creatorId)}
							disabled={isLocked || isNetworkMismatch || isSubmitting}
							data-testid="holding-sell-button"
						>
							Sell
						</Button>
					)}
				</div>
			</div>
		</div>
	);
};

export default PortfolioHoldingRow;
