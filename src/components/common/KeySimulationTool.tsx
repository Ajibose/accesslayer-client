import React, { useEffect, useRef, useState } from 'react';
import { courseService } from '@/services/course.service';
import {
	calculatePriceImpact,
	formatPriceImpact,
} from '@/utils/priceImpact.utils';

export interface KeySimulationToolProps {
	/** Key identifier used for GET /keys/:keyId/simulate?quantity=N */
	keyId: string;
	/** Current spot price in the same unit as simulated_price (e.g. XLM or stroops) */
	spotPrice: number;
	/** Optional initial quantity */
	initialQuantity?: number;
}

interface SimulateResult {
	simulated_price?: number;
	simulatedPrice?: number;
	spot_price?: number;
	spotPrice?: number;
}

/**
 * Key price simulation tool (#887).
 *
 * Lets the user enter a custom quantity, debounces the input by 300ms,
 * fetches GET /keys/:keyId/simulate?quantity=N, computes price impact as
 * (simulated_price - spot_price) / spot_price * 100 and displays it.
 *
 * Loading shows a skeleton, fetch errors show 'Unable to simulate price'
 * and hide the impact value.
 */
const KeySimulationTool: React.FC<KeySimulationToolProps> = ({
	keyId,
	spotPrice,
	initialQuantity = 1,
}) => {
	const [quantityInput, setQuantityInput] = useState(
		String(initialQuantity)
	);
	const [simulatedPrice, setSimulatedPrice] = useState<number | null>(null);
	const [resolvedSpotPrice, setResolvedSpotPrice] = useState<number>(spotPrice);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

	// Keep spot price in sync when prop changes
	useEffect(() => {
		setResolvedSpotPrice(spotPrice);
	}, [spotPrice]);

	useEffect(() => {
		const quantity = Number(quantityInput);
		// Empty or invalid quantity: clear simulation
		if (quantityInput.trim() === '' || isNaN(quantity) || quantity <= 0) {
			setSimulatedPrice(null);
			setError(null);
			setLoading(false);
			return;
		}

		if (debounceRef.current) clearTimeout(debounceRef.current);

		setLoading(true);
		setError(null);

		debounceRef.current = setTimeout(async () => {
			try {
				const result: SimulateResult =
					await courseService.simulateBuy(keyId, quantity);
				// Support both snake_case and camelCase shapes
				const sim =
					result.simulated_price ?? result.simulatedPrice ?? null;
				const spot =
					result.spot_price ?? result.spotPrice ?? spotPrice;
				if (sim != null) {
					setSimulatedPrice(sim);
					if (spot != null) setResolvedSpotPrice(spot);
					setError(null);
				} else {
					setSimulatedPrice(null);
				}
			} catch {
				setError('Unable to simulate price');
				setSimulatedPrice(null);
			} finally {
				setLoading(false);
			}
		}, 300);

		return () => {
			if (debounceRef.current) clearTimeout(debounceRef.current);
		};
	}, [quantityInput, keyId, spotPrice]);

	const impact =
		simulatedPrice != null
			? calculatePriceImpact(simulatedPrice, resolvedSpotPrice)
			: null;

	return (
		<div className="space-y-4" data-testid="key-simulation-tool">
			<div className="space-y-1.5">
				<label
					htmlFor="simulation-quantity"
					className="text-xs font-bold uppercase tracking-[0.18em] text-white/50"
				>
					Quantity
				</label>
				<input
					id="simulation-quantity"
					data-testid="simulation-quantity-input"
					aria-label="Custom quantity"
					type="number"
					inputMode="numeric"
					min={1}
					value={quantityInput}
					onChange={e => setQuantityInput(e.target.value)}
					className="w-full rounded-md border border-white/10 bg-white/[0.04] px-3 py-2 text-sm text-white placeholder:text-white/30 outline-none"
					placeholder="Enter quantity"
				/>
			</div>

			{loading && (
				<div
					data-testid="simulation-skeleton"
					aria-label="Loading simulation"
					className="h-6 w-32 animate-pulse rounded bg-white/10"
				/>
			)}

			{!loading && error && (
				<p
					role="alert"
					data-testid="simulation-error"
					className="text-sm text-red-400"
				>
					{error}
				</p>
			)}

			{!loading && !error && impact != null && (
				<p
					data-testid="price-impact"
					className="text-sm font-bold text-white"
				>
					{formatPriceImpact(impact)}
				</p>
			)}
		</div>
	);
};

export default KeySimulationTool;
