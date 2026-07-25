import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { PriceSparkline } from '../PriceSparkline';

describe('PriceSparkline', () => {
	it('renders an SVG path for 7 data points', () => {
		const { container } = render(
			<PriceSparkline
				dataPoints={[10, 20, 15, 25, 30, 22, 35]}
			/>
		);

		const svg = container.querySelector('svg');
		expect(svg).toBeInTheDocument();

		const path = container.querySelector('path');
		expect(path).toBeInTheDocument();
		expect(path).toHaveAttribute('d');
	});

	it('renders without error for 1 data point and does not produce a line path', () => {
		const { container } = render(
			<PriceSparkline dataPoints={[42]} />
		);

		const svg = container.querySelector('svg');
		expect(svg).toBeInTheDocument();

		const path = container.querySelector('path');
		expect(path).not.toBeInTheDocument();
	});

	it('renders nothing for 0 data points', () => {
		const { container } = render(
			<PriceSparkline dataPoints={[]} />
		);

		expect(container.innerHTML).toBe('');
	});

	it('applies green line colour when the last value is higher than the first', () => {
		const { container } = render(
			<PriceSparkline dataPoints={[10, 20, 30]} />
		);

		const path = container.querySelector('path');
		expect(path).toHaveAttribute('stroke', '#34d399');
	});
});
