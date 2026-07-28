import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Copy, Check, Share2, Pencil } from 'lucide-react';
import showToast from '@/utils/toast.util';
import appendUtmParams from '@/utils/utm.utils';
import { copyTextToClipboard } from '@/utils/clipboard.utils';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import VerifiedBadge from '@/components/common/VerifiedBadge';
import CreatorInitialsAvatar from '@/components/common/CreatorInitialsAvatar';
import CreatorBio from '@/components/common/CreatorBio';
import { formatCreatorHandle } from '@/utils/handleDisplay.utils';
import { normalizeCreatorDisplayName } from '@/utils/creatorDisplayName.utils';
import { CREATOR_CARD_MEDIA_RADIUS_CLASS } from '@/utils/creatorCardTokens';
import { isOwnWallet } from '@/utils/isOwnWallet';

interface CreatorProfileHeaderProps {
	name: string;
	handle: string;
	creatorId?: string | number | null;
	avatarUrl?: string;
	isVerified?: boolean;
	bio?: string | null;
	className?: string;
	connectedWalletAddress?: string | null;
}

const CREATOR_PROFILE_SUBTITLE_WRAP_CLASS_NAME =
	'max-w-full whitespace-normal break-words [overflow-wrap:anywhere]';

const CreatorProfileHeader: React.FC<CreatorProfileHeaderProps> = ({
	name,
	handle,
	creatorId,
	avatarUrl,
	isVerified,
	bio,
	className,
	connectedWalletAddress,
}) => {
	const [copied, setCopied] = useState(false);
	const [isScrolled, setIsScrolled] = useState(false);

	useEffect(() => {
		const handleScroll = () => {
			setIsScrolled(window.scrollY > 20);
		};
		window.addEventListener('scroll', handleScroll, { passive: true });
		return () => window.removeEventListener('scroll', handleScroll);
	}, []);

	// Display-normalised handle; raw `handle` is preserved for any equality /
	// URL construction the caller might do via the prop.
	const displayHandle = formatCreatorHandle(handle);
	const displayName = normalizeCreatorDisplayName(name) || 'Unnamed creator';
	const normalizedCreatorId =
	creatorId == null ? creatorId : String(creatorId);

const own = isOwnWallet(connectedWalletAddress, normalizedCreatorId);

	const handleShare = async () => {
		let url = window.location.href;

		// Append UTM params when configured (no-op if none configured)
		url = appendUtmParams(url);

		if (navigator.share) {
			try {
				await navigator.share({
					title: `${displayName} (${displayHandle || `@${handle}`}) on Access Layer`,
					url,
				});
			} catch (err) {
				// User cancelled the share dialog — not an error worth surfacing
				if (err instanceof Error && err.name !== 'AbortError') {
					showToast.error('Failed to share profile');
				}
			}
			return;
		}

		// Fallback: copy to clipboard
		try {
			await copyTextToClipboard(url);
			setCopied(true);
			showToast.success('Profile link copied to clipboard!');
			setTimeout(() => setCopied(false), 2000);
		} catch {
			showToast.error(
				'Could not copy the profile link. Please copy it manually.'
			);
		}
	};

	const canNativeShare = typeof navigator !== 'undefined' && !!navigator.share;

	return (
		<div
			className={cn(
				'sticky top-0 z-30 -mx-6 px-6 py-4 transition-all duration-300 md:-mx-12 md:px-12',
				isScrolled
					? 'bg-slate-950/80 shadow-lg backdrop-blur-md py-3'
					: 'bg-transparent',
				className
			)}
		>
			<div className="mx-auto max-w-7xl flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
				<div className="flex items-center gap-4 md:gap-6">
					<motion.div
						animate={{
							scale: isScrolled ? 0.6 : 1,
						}}
						transition={{ duration: 0.3, ease: 'easeInOut' }}
						className={cn(
							'overflow-hidden border-2 border-white/10 shadow-xl shrink-0',
							isScrolled ? 'size-12 md:size-16' : 'size-24 md:size-32',
							CREATOR_CARD_MEDIA_RADIUS_CLASS
						)}
					>
						<CreatorInitialsAvatar
							name={displayName}
							creatorId={creatorId}
							imageSrc={avatarUrl}
						/>
					</motion.div>
					<div className="min-w-0 space-y-0.5">
						<div className="flex items-center gap-2 overflow-hidden">
							<motion.h1
								id="creator-profile-name"
								animate={{
									fontSize: isScrolled ? '1.25rem' : '1.875rem',
								}}
								className={cn(
									'truncate font-grotesque font-black tracking-tight text-white transition-all duration-300',
									isScrolled
										? 'text-xl md:text-2xl'
										: 'text-3xl md:text-4xl'
								)}
							>
								{displayName}
							</motion.h1>
							{isVerified && (
								<div className="shrink-0">
									<VerifiedBadge verified={true} />
								</div>
							)}
						</div>
						{!isScrolled ? (
							<div className="animate-in fade-in slide-in-from-top-1 duration-300">
								<p
									className={cn(
										'font-jakarta text-lg text-white/50',
										CREATOR_PROFILE_SUBTITLE_WRAP_CLASS_NAME
									)}
								>
									{displayHandle || `@${handle}`}
								</p>
								<CreatorBio
									bio={bio}
									variant="profile"
									collapsible
									className="mt-2 max-w-md"
								/>
							</div>
						) : (
							<p className="font-jakarta text-xs text-white/50 truncate">
								{displayHandle || `@${handle}`}
							</p>
						)}
					</div>
				</div>

			<div
				className={cn(
					'flex items-center gap-3 transition-transform duration-300',
					isScrolled ? 'scale-90' : 'scale-100'
				)}
			>
				{own && (
					<>
						<Button
							aria-label="Edit bio"
							variant="outline"
							className={cn(
								'rounded-xl border-white/10 bg-white/5 font-bold text-white transition-all hover:border-amber-500/30 hover:bg-amber-500/10 active:scale-95',
								isScrolled ? 'h-9 px-3 text-xs' : 'h-11 px-4 text-sm'
							)}
						>
							<Pencil className="mr-2 size-4 text-amber-500" />
							<span className="hidden sm:inline">Edit Bio</span>
							<span className="sm:hidden">Edit</span>
						</Button>
						<Button
							aria-label="Change avatar"
							variant="outline"
							className={cn(
								'rounded-xl border-white/10 bg-white/5 font-bold text-white transition-all hover:border-amber-500/30 hover:bg-amber-500/10 active:scale-95',
								isScrolled ? 'h-9 px-3 text-xs' : 'h-11 px-4 text-sm'
							)}
						>
							<Pencil className="mr-2 size-4 text-amber-500" />
							<span className="hidden sm:inline">Change Avatar</span>
							<span className="sm:hidden">Avatar</span>
						</Button>
					</>
				)}
				<Button
						onClick={handleShare}
						variant="outline"
						className={cn(
							'rounded-xl border-white/10 bg-white/5 font-bold text-white transition-all hover:border-amber-500/30 hover:bg-amber-500/10 active:scale-95',
							isScrolled ? 'h-9 px-3 text-xs' : 'h-11 px-4 text-sm'
						)}
					>
						{copied ? (
							<Check className="mr-2 size-4 text-emerald-400" />
						) : canNativeShare ? (
							<Share2 className="mr-2 size-4 text-amber-500" />
						) : (
							<Copy className="mr-2 size-4 text-amber-500" />
						)}
						<span className="hidden sm:inline">
							{copied
								? 'Copied!'
								: canNativeShare
									? 'Share Profile'
									: 'Copy Profile Link'}
						</span>
						<span className="sm:hidden">
							{copied ? 'Copied' : canNativeShare ? 'Share' : 'Copy'}
						</span>
					</Button>
				</div>
			</div>
		</div>
	);
};

export default CreatorProfileHeader;
