import { describe, expect, it } from 'vitest';
import {
	calculatePortfolioValue,
	formatPortfolioValueDisplay,
	getPortfolioValueHelperText,
	calculatePositionTotalValue,
	sortHoldingsByTotalValue,
} from '../portfolioValue.utils';

describe('calculatePortfolioValue', () => {
	it('sums each held key quantity against its current price', () => {
		const result = calculatePortfolioValue([
			{ creatorId: 'alex', quantity: 3, priceStroops: 500_000 },
			{ creatorId: 'sarah', quantity: 2, priceStroops: 1_200_000 },
		]);

		expect(result).toMatchObject({
			status: 'ready',
			totalStroops: 3_900_000,
			heldPositionCount: 2,
		});
		expect(formatPortfolioValueDisplay(result)).toBe('0.39 XLM');
		expect(getPortfolioValueHelperText(result)).toBe(
			'Across 2 held creator positions.'
		);
	});

	it('returns a zero total for zero holdings without requiring price data', () => {
		const result = calculatePortfolioValue([
			{ creatorId: 'alex', quantity: 0, priceStroops: null },
			{ creatorId: 'sarah', quantity: -1, priceStroops: 1_200_000 },
		]);

		expect(result).toMatchObject({
			status: 'ready',
			totalStroops: 0,
			heldPositionCount: 0,
		});
		expect(formatPortfolioValueDisplay(result)).toBe('0 XLM');
		expect(getPortfolioValueHelperText(result)).toBe(
			'No held creator keys yet.'
		);
	});

	it('shows loading instead of a partial total while prices refresh', () => {
		const result = calculatePortfolioValue([
			{ creatorId: 'alex', quantity: 3, priceStroops: 500_000 },
			{
				creatorId: 'sarah',
				quantity: 2,
				priceStroops: 1_200_000,
				isPriceLoading: true,
			},
		]);

		expect(result).toMatchObject({
			status: 'loading',
			totalStroops: null,
			heldPositionCount: 2,
		});
		expect(formatPortfolioValueDisplay(result)).toBe('Loading prices…');
	});

	it('marks totals unavailable when a held position is missing price data', () => {
		const result = calculatePortfolioValue([
			{ creatorId: 'alex', quantity: 3, priceStroops: 500_000 },
			{ creatorId: 'marcus', quantity: 1, priceStroops: null, price: null },
		]);

		expect(result).toMatchObject({
			status: 'unavailable',
			totalStroops: null,
			missingPriceCount: 1,
		});
		expect(formatPortfolioValueDisplay(result)).toBe('Unavailable');
		expect(getPortfolioValueHelperText(result)).toBe(
			'One or more held positions is missing current price data.'
		);
	});

	it('marks totals unavailable when a held position has stale price data', () => {
		const result = calculatePortfolioValue([
			{
				creatorId: 'alex',
				quantity: 3,
				priceStroops: 500_000,
				isPriceStale: true,
			},
		]);

		expect(result).toMatchObject({
			status: 'unavailable',
			totalStroops: null,
			stalePriceCount: 1,
		});
		expect(getPortfolioValueHelperText(result)).toBe(
			'One or more held positions has stale price data. Refresh prices to show the total.'
		);
	});
});

describe('calculatePositionTotalValue', () => {
	it('calculates total value for a position with valid price and quantity', () => {
		const result = calculatePositionTotalValue({
			creatorId: 'alex',
			quantity: 5,
			priceStroops: 1_000_000,
		});

		expect(result).toBe(5_000_000);
	});

	it('returns null when price is missing', () => {
		const result = calculatePositionTotalValue({
			creatorId: 'alex',
			quantity: 5,
			priceStroops: null,
			price: null,
		});

		expect(result).toBeNull();
	});

	it('returns null when quantity is zero', () => {
		const result = calculatePositionTotalValue({
			creatorId: 'alex',
			quantity: 0,
			priceStroops: 1_000_000,
		});

		expect(result).toBeNull();
	});

	it('returns null when quantity is null', () => {
		const result = calculatePositionTotalValue({
			creatorId: 'alex',
			quantity: null,
			priceStroops: 1_000_000,
		});

		expect(result).toBeNull();
	});
});

describe('sortHoldingsByTotalValue', () => {
	it('sorts holdings in descending order by total value', () => {
		const positions = [
			{ creatorId: 'alex', quantity: 5, priceStroops: 100_000 }, // 500,000
			{ creatorId: 'sarah', quantity: 12, priceStroops: 100_000 }, // 1,200,000
			{ creatorId: 'marcus', quantity: 3, priceStroops: 100_000 }, // 300,000
		];

		const sorted = sortHoldingsByTotalValue(positions);

		expect(sorted[0].creatorId).toBe('sarah'); // 1,200,000
		expect(sorted[1].creatorId).toBe('alex'); // 500,000
		expect(sorted[2].creatorId).toBe('marcus'); // 300,000
	});

	it('updates order when data changes', () => {
		const positions = [
			{ creatorId: 'alex', quantity: 5, priceStroops: 100_000 }, // 500,000
			{ creatorId: 'sarah', quantity: 12, priceStroops: 100_000 }, // 1,200,000
			{ creatorId: 'marcus', quantity: 3, priceStroops: 100_000 }, // 300,000
		];

		const sorted = sortHoldingsByTotalValue(positions);
		expect(sorted[0].creatorId).toBe('sarah'); // 1,200,000

		// Update marcus to have higher value
		const updatedPositions = [
			{ creatorId: 'alex', quantity: 5, priceStroops: 100_000 }, // 500,000
			{ creatorId: 'sarah', quantity: 12, priceStroops: 100_000 }, // 1,200,000
			{ creatorId: 'marcus', quantity: 15, priceStroops: 100_000 }, // 1,500,000
		];

		const resorted = sortHoldingsByTotalValue(updatedPositions);
		expect(resorted[0].creatorId).toBe('marcus'); // 1,500,000
		expect(resorted[1].creatorId).toBe('sarah'); // 1,200,000
		expect(resorted[2].creatorId).toBe('alex'); // 500,000
	});

	it('maintains stable secondary sort by creator ID for equal values', () => {
		const positions = [
			{ creatorId: 'alex', quantity: 10, priceStroops: 100_000 }, // 1,000,000
			{ creatorId: 'sarah', quantity: 10, priceStroops: 100_000 }, // 1,000,000
			{ creatorId: 'marcus', quantity: 10, priceStroops: 100_000 }, // 1,000,000
		];

		const sorted = sortHoldingsByTotalValue(positions);

		// All have same value, should be sorted alphabetically by creator ID
		expect(sorted[0].creatorId).toBe('alex');
		expect(sorted[1].creatorId).toBe('marcus');
		expect(sorted[2].creatorId).toBe('sarah');
	});

	it('handles positions with missing prices by treating them as zero value', () => {
		const positions = [
			{ creatorId: 'alex', quantity: 5, priceStroops: 100_000 }, // 500,000
			{ creatorId: 'sarah', quantity: 10, priceStroops: null, price: null }, // null -> 0
			{ creatorId: 'marcus', quantity: 3, priceStroops: 100_000 }, // 300,000
		];

		const sorted = sortHoldingsByTotalValue(positions);

		expect(sorted[0].creatorId).toBe('alex'); // 500,000
		expect(sorted[1].creatorId).toBe('marcus'); // 300,000
		expect(sorted[2].creatorId).toBe('sarah'); // 0 (missing price)
	});

	it('handles positions with zero quantity by treating them as zero value', () => {
		const positions = [
			{ creatorId: 'alex', quantity: 5, priceStroops: 100_000 }, // 500,000
			{ creatorId: 'sarah', quantity: 0, priceStroops: 100_000 }, // 0
			{ creatorId: 'marcus', quantity: 3, priceStroops: 100_000 }, // 300,000
		];

		const sorted = sortHoldingsByTotalValue(positions);

		expect(sorted[0].creatorId).toBe('alex'); // 500,000
		expect(sorted[1].creatorId).toBe('marcus'); // 300,000
		expect(sorted[2].creatorId).toBe('sarah'); // 0 (zero quantity)
	});

	it('does not mutate the original array', () => {
		const positions = [
			{ creatorId: 'alex', quantity: 5, priceStroops: 100_000 },
			{ creatorId: 'sarah', quantity: 12, priceStroops: 100_000 },
			{ creatorId: 'marcus', quantity: 3, priceStroops: 100_000 },
		];

		const originalOrder = positions.map(p => p.creatorId);
		sortHoldingsByTotalValue(positions);

		expect(positions.map(p => p.creatorId)).toEqual(originalOrder);
	});
});
