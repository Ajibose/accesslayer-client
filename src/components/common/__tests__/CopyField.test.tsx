import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';

import CopyField from '@/components/common/CopyField';

vi.mock('@/utils/toast.util', () => ({
	default: { success: vi.fn() },
}));

const FULL_ADDRESS = 'GBUKOFF6RS5OTIHMGMH4MOVKPAS4JJIZGYXS4DOVZDNBH5YXKJXFNEC';

function setupClipboard() {
	const writeText = vi.fn().mockResolvedValue(undefined);
	Object.defineProperty(navigator, 'clipboard', {
		value: { writeText },
		configurable: true,
		writable: true,
	});
	return { writeText };
}

describe('CopyField clipboard integration', () => {
	beforeEach(() => {
		setupClipboard();
	});

	it('copies the full unmasked address to clipboard on button click', async () => {
		const { writeText } = setupClipboard();
		const user = userEvent.setup();

		render(<CopyField value={FULL_ADDRESS} label="Wallet address" />);

		const copyBtn = screen.getByRole('button', { name: /copy wallet address/i });
		await user.click(copyBtn);

		expect(writeText).toHaveBeenCalledOnce();
		expect(writeText).toHaveBeenCalledWith(FULL_ADDRESS);
	});

	it('displays the full address in the input field', () => {
		render(<CopyField value={FULL_ADDRESS} label="Wallet address" />);

		const input = screen.getByRole('textbox', { name: /wallet address/i });
		expect(input).toHaveValue(FULL_ADDRESS);
	});

	it('shows copied state after clicking copy', async () => {
		setupClipboard();
		const user = userEvent.setup();

		render(<CopyField value={FULL_ADDRESS} label="Wallet address" />);

		await user.click(screen.getByRole('button', { name: /copy wallet address/i }));

		expect(screen.getByRole('button', { name: /wallet address copied/i })).toBeInTheDocument();
	});
});
