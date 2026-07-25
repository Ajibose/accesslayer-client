import { describe, it, expect } from 'vitest';
import { formatXlm, useFormatXlm } from '@/hooks/useFormatXlm';
import { renderHook } from '@testing-library/react';

describe('useFormatXlm', () => {
	describe('default decimal precision (2 places)', () => {
		it('formats a standard stroop amount with 2 decimal places', () => {
			// 15_000_000 stroops = 1.5 XLM → "1.50"
			expect(formatXlm(15_000_000)).toBe('1.50');
		});

		it('formats zero input as 0.00', () => {
			expect(formatXlm(0)).toBe('0.00');
		});

		it('formats exactly 1 XLM (10_000_000 stroops) as 1.00', () => {
			expect(formatXlm(10_000_000)).toBe('1.00');
		});

		it('formats a sub-XLM value with 2 decimal places', () => {
			// 500_000 stroops = 0.05 XLM → "0.05"
			expect(formatXlm(500_000)).toBe('0.05');
		});
	});

	describe('decimal override', () => {
		it('formats with 0 decimal places when decimals=0', () => {
			// 10_000_000 stroops = 1 XLM → "1"
			expect(formatXlm(10_000_000, { decimals: 0 })).toBe('1');
		});

		it('formats zero with 0 decimal places', () => {
			expect(formatXlm(0, { decimals: 0 })).toBe('0');
		});

		it('formats with 7 decimal places when decimals=7', () => {
			// 10_000_000 stroops = 1 XLM → "1.0000000"
			expect(formatXlm(10_000_000, { decimals: 7 })).toBe('1.0000000');
		});

		it('formats a partial XLM value with 7 decimal places', () => {
			// 1 stroop = 0.0000001 XLM
			expect(formatXlm(1, { decimals: 7 })).toBe('0.0000001');
		});
	});

	describe('thousands separator', () => {
		it('includes a thousands separator for values above 1 000 XLM', () => {
			// 10_001_000_000 stroops = 1_000.1 XLM
			const result = formatXlm(10_001_000_000);
			// The formatted string should contain a thousands separator character
			// between the thousands and hundreds position (locale-dependent).
			// We verify by checking that 1000 XLM renders as a 5+ char string.
			expect(result.length).toBeGreaterThan(4); // at least "1,000" or "1 000"
			// Must contain the numeric value 1000 with a separator
			expect(result).toMatch(/1.000/); // separator can be , or . or space
		});

		it('does not include a thousands separator for values below 1 000 XLM', () => {
			// 9_990_000_000 stroops = 999 XLM → "999.00"
			const result = formatXlm(9_990_000_000);
			expect(result).toBe('999.00');
		});
	});

	describe('large values', () => {
		it('formats 10_000_000 stroops (1 XLM) without scientific notation', () => {
			const result = formatXlm(10_000_000);
			expect(result).not.toMatch(/e/i);
			expect(result).toBe('1.00');
		});

		it('formats a large value (100_000_000_000_000 stroops = 10,000,000 XLM) without scientific notation', () => {
			const result = formatXlm(100_000_000_000_000);
			expect(result).not.toMatch(/e/i);
			// Should contain the numeric value 10000000 with formatting
			expect(result).toMatch(/10/);
		});

		it('formats 70_000_000_000 stroops (7000 XLM) without scientific notation', () => {
			const result = formatXlm(70_000_000_000);
			expect(result).not.toMatch(/e/i);
			// 7000.00 formatted
			expect(result).toMatch(/7/);
		});
	});

	describe('hook interface', () => {
		it('exposes a format function', () => {
			const { result } = renderHook(() => useFormatXlm());
			expect(typeof result.current.format).toBe('function');
		});

		it('format function produces the same output as the standalone formatXlm', () => {
			const { result } = renderHook(() => useFormatXlm());
			expect(result.current.format(15_000_000)).toBe(formatXlm(15_000_000));
		});

		it('format function respects decimals option', () => {
			const { result } = renderHook(() => useFormatXlm());
			expect(result.current.format(10_000_000, { decimals: 0 })).toBe('1');
		});
	});
});
