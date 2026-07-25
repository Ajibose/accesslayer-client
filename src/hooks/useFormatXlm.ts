import { STROOPS_PER_XLM } from '@/constants/stellar';

export interface FormatXlmOptions {
	/** Number of decimal places to display. Defaults to 2. */
	decimals?: number;
}

/**
 * Converts a stroop amount to a formatted XLM string.
 *
 * @param stroops - Amount in stroops (1 XLM = 10,000,000 stroops)
 * @param options - Formatting options
 * @returns Formatted XLM string, e.g. "1.50" for 15,000,000 stroops
 *
 * @example
 * formatXlm(10_000_000)           // "1.00"
 * formatXlm(10_000_000, { decimals: 0 })  // "1"
 * formatXlm(15_000_000, { decimals: 7 })  // "1.5000000"
 */
export function formatXlm(
	stroops: number,
	options: FormatXlmOptions = {}
): string {
	const { decimals = 2 } = options;
	const xlm = stroops / STROOPS_PER_XLM;

	return new Intl.NumberFormat(undefined, {
		minimumFractionDigits: decimals,
		maximumFractionDigits: decimals,
		useGrouping: true,
	}).format(xlm);
}

/**
 * Hook that exposes a formatXlm formatter bound to the app locale.
 *
 * Returns a stable `format` function that converts a stroop amount to a
 * locale-aware XLM string.
 *
 * @example
 * const { format } = useFormatXlm();
 * format(10_000_000)              // "1.00"
 * format(10_000_000, { decimals: 0 })  // "1"
 */
export function useFormatXlm() {
	return { format: formatXlm };
}
