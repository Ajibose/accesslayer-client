import React from 'react';
import ReferralLinkPanel from '@/components/common/ReferralLinkPanel';
import { useProfileStore } from '@/hooks/useProfileStore';

export default function ProfilePage() {
  const profile = useProfileStore(state => state.profile);

  // For demo purposes, generate some mock keys. In a real app these would
  // come from the backend (the user's keys / most traded key etc.).
  const keys = [
    { id: 'alpha', label: 'Alpha Key' },
    { id: 'beta', label: 'Beta Key' },
    { id: 'gamma', label: 'Gamma Key' },
  ];

  return (
    <main className="min-h-screen bg-[#06111f] px-6 py-16 text-white md:px-12">
      <div className="mx-auto max-w-7xl space-y-6">
        <h1 className="text-2xl font-black">My Profile</h1>
        <p className="text-sm text-white/60">{profile?.firstName} {profile?.lastName}</p>

        <ReferralLinkPanel initialKeyId={keys[0].id} keys={keys} />
      </div>
    </main>
  );
}
