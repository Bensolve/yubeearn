'use client';

import { Button } from '@/components/ui/button';
import { giveCreatorBalanceAction } from '@/lib/actions/test-balance';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function TestBalanceButton({ userId }: { userId: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const handleAddBalance = async () => {
    setLoading(true);
    await giveCreatorBalanceAction(userId);
    setDone(true);
    setLoading(false);
    router.refresh(); // Refresh page to show new balance
  };

  if (done) {
    return <p className="text-earn font-bold text-sm">✅ GHS 1000 added! Refresh the page.</p>;
  }

  return (
    <Button
      onClick={handleAddBalance}
      disabled={loading}
      className="bg-earn hover:bg-earn/90 text-white font-bold text-xs h-8"
    >
      {loading ? '⚙️ Adding...' : '🧪 Add Test Balance (GHS 1000)'}
    </Button>
  );
}