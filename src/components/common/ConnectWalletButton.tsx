import { useState } from 'react';
import { useAccount, useConnect, useDisconnect } from 'wagmi';
import { Copy, Check } from 'lucide-react';
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { shortenAddress } from '@/lib/web3/format';
import {
	WALLET_CONNECTION_AD_BLOCKER_MESSAGE,
	useWalletConnectionStallDetection,
} from '@/hooks/useWalletConnectionStallDetection';
import { useCopySuccessAnnouncement } from '@/hooks/useCopySuccessAnnouncement';
import CopySuccessAnnouncement from '@/components/common/CopySuccessAnnouncement';

function ConnectWalletButton() {
	const [showDisconnectDialog, setShowDisconnectDialog] = useState(false);
	const [copied, setCopied] = useState(false);
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
			await navigator.clipboard.writeText(address);
			announceCopySuccess('Wallet address copied.');
			setCopied(true);
			window.setTimeout(() => setCopied(false), 2000);
		} catch {
			setCopied(false);
		}
	};

	if (isConnected && address) {
		return (
			<>
				<div className="flex items-center gap-1.5">
					<Dialog
						open={showDisconnectDialog}
						onOpenChange={setShowDisconnectDialog}
					>
						<DialogTrigger asChild>
							<button
								type="button"
								className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
							>
								{shortenAddress(address)}
							</button>
						</DialogTrigger>
						<DialogContent>
							<DialogHeader>
								<DialogTitle>Disconnect wallet?</DialogTitle>
								<DialogDescription>
									Disconnecting clears your current wallet session and any
									pending wallet state. You will need to reconnect to
									continue.
								</DialogDescription>
							</DialogHeader>
							<DialogFooter>
								<DialogClose asChild>
									<Button variant="outline">Cancel</Button>
								</DialogClose>
								<Button
									type="button"
									variant="destructive"
									onClick={() => {
										disconnect();
										setShowDisconnectDialog(false);
									}}
								>
									Disconnect
								</Button>
							</DialogFooter>
						</DialogContent>
					</Dialog>
					<button
						type="button"
						onClick={handleCopyAddress}
						aria-label={copied ? 'Wallet address copied' : 'Copy wallet address'}
						className="inline-flex size-8 shrink-0 items-center justify-center rounded-md bg-white/5 text-white/40 transition-colors hover:bg-white/10 hover:text-white"
					>
						{copied ? (
							<Check className="size-4 text-emerald-400" aria-hidden="true" />
						) : (
							<Copy className="size-4" aria-hidden="true" />
						)}
					</button>
					{copied && (
						<span className="text-xs font-medium text-emerald-400" aria-hidden="true">
							Copied!
						</span>
					)}
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
