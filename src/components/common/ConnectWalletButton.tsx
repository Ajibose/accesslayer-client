import { useEffect, useRef, useState } from 'react';
import { useAccount, useConnect, useDisconnect } from 'wagmi';
import { Copy, Check } from 'lucide-react';
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from '@/components/ui/popover';
import { shortenAddress } from '@/lib/web3/format';
import {
	WALLET_CONNECTION_AD_BLOCKER_MESSAGE,
	useWalletConnectionStallDetection,
} from '@/hooks/useWalletConnectionStallDetection';
import { useCopySuccessAnnouncement } from '@/hooks/useCopySuccessAnnouncement';
import CopySuccessAnnouncement from '@/components/common/CopySuccessAnnouncement';
import showToast from '@/utils/toast.util';
import { copyTextToClipboard } from '@/utils/clipboard.utils';
import { logWalletDisconnectSession } from '@/lib/walletSessionLog';

function ConnectWalletButton() {
	const [showAddressPopover, setShowAddressPopover] = useState(false);
	const [copied, setCopied] = useState(false);
	const connectedAtRef = useRef<number | null>(null);
	const { address, isConnected } = useAccount();
	const { connect, connectors, error, isPending } = useConnect();
	const { disconnect } = useDisconnect();
	const { announcement, announceCopySuccess } = useCopySuccessAnnouncement();

	const primaryConnector = connectors[0];
	const showAdBlockerSuggestion = useWalletConnectionStallDetection({
		isAwaitingWalletResponse: isPending,
		hasWalletResponse: isConnected || Boolean(error),
	});

	const handleCopyAddress = async () => {
		if (!address) return;
		try {
			await copyTextToClipboard(address);
			announceCopySuccess('Wallet address copied.');
			setCopied(true);
			window.setTimeout(() => setCopied(false), 2000);
		} catch {
			setCopied(false);
			showToast.error(
				'Could not copy the wallet address. Please copy it manually.'
			);
		}
	};

	useEffect(() => {
		if (isConnected && address && connectedAtRef.current == null) {
			connectedAtRef.current = Date.now();
			return;
		}

		if (!isConnected) {
			connectedAtRef.current = null;
		}
	}, [address, isConnected]);

	if (isConnected && address) {
		return (
			<>
				<div className="flex items-center gap-1.5">
					<Popover
						open={showAddressPopover}
						onOpenChange={setShowAddressPopover}
					>
						<PopoverTrigger asChild>
							<button
								type="button"
								className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
							>
								{shortenAddress(address)}
							</button>
						</PopoverTrigger>
						<PopoverContent className="w-80">
							<div className="space-y-3">
								<div className="space-y-1">
									<p className="text-xs font-medium text-muted-foreground">
										Wallet address
									</p>
									<p className="break-all font-mono text-sm">{address}</p>
								</div>
								<div className="flex items-center gap-2">
									<button
										type="button"
										onClick={handleCopyAddress}
										className="inline-flex items-center gap-1.5 rounded-md bg-blue-600 px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-blue-700"
									>
										{copied ? (
											<Check className="size-3.5" aria-hidden="true" />
										) : (
											<Copy className="size-3.5" aria-hidden="true" />
										)}
										{copied ? 'Copied' : 'Copy address'}
									</button>
									<button
										type="button"
										onClick={() => {
											if (connectedAtRef.current != null) {
												logWalletDisconnectSession(
													address,
													connectedAtRef.current
												);
											}
											disconnect();
											connectedAtRef.current = null;
											setShowAddressPopover(false);
										}}
										className="rounded-md px-3 py-1.5 text-xs font-medium text-red-600 transition-colors hover:bg-red-50"
									>
										Disconnect
									</button>
								</div>
							</div>
						</PopoverContent>
					</Popover>
				</div>
				<CopySuccessAnnouncement message={announcement} />
			</>
		);
	}

	return (
		<div className="flex flex-col gap-2">
			<button
				type="button"
				onClick={() =>
					primaryConnector && connect({ connector: primaryConnector })
				}
				disabled={!primaryConnector || isPending}
				className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-300"
			>
				{isPending ? 'Connecting...' : 'Connect Wallet'}
			</button>
			{error ? (
				<p className="text-sm text-red-600">{error.message}</p>
			) : null}
			{showAdBlockerSuggestion ? (
				<p role="status" className="max-w-sm text-sm text-amber-700">
					{WALLET_CONNECTION_AD_BLOCKER_MESSAGE}
				</p>
			) : null}
		</div>
	);
}

export default ConnectWalletButton;
