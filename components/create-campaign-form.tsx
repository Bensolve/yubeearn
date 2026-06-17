'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, CheckCircle2, Zap, DollarSign, Play, AlertTriangle } from 'lucide-react';
import { createCampaignAction } from '@/lib/actions/campaigns';
import type { User } from '@/types';

interface CreateCampaignProps {
  user: User;
}

function extractYouTubeId(url: string): string | null {
  const regex = /(?:youtube\.com\/watch\?v=|youtu\.be\/)([\w-]+)/;
  const match = url.match(regex);
  return match ? match[1] : null;
}

async function fetchYouTubeTitle(url: string): Promise<string> {
  try {
    const oEmbedUrl = `https://www.youtube.com/oembed?url=${encodeURIComponent(url)}&format=json`;
    const res = await fetch(oEmbedUrl);
    if (!res.ok) throw new Error('Failed');
    const data = await res.json();
    return data.title || 'YouTube Video';
  } catch {
    return 'YouTube Video';
  }
}

export default function CreateCampaignForm({ user }: CreateCampaignProps) {
  const router = useRouter();
  const [videoUrl, setVideoUrl] = useState('');
  const [videoTitle, setVideoTitle] = useState('');
  const [youtubeId, setYoutubeId] = useState('');
  const [rewardAmount, setRewardAmount] = useState(100);
  const [loading, setLoading] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [verified, setVerified] = useState(false);
  const [error, setError] = useState('');

  const userBalance = user.balance || 0;
  const EARNER_EARNING = Math.round(rewardAmount * 0.85);
  const PLATFORM_CUT = Math.round(rewardAmount * 0.15);

  const handleVideoUrlChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const url = e.target.value;
    setVideoUrl(url);
    setVerified(false);
    setVideoTitle('');
    setError('');

    const id = extractYouTubeId(url);
    if (id) {
      setYoutubeId(id);
      setVerifying(true);
      const title = await fetchYouTubeTitle(url);
      setVideoTitle(title);
      setVerified(true);
      setVerifying(false);
    } else if (url.length > 10) {
      setYoutubeId('');
      setError('Please enter a valid YouTube URL');
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');

    if (!youtubeId || !verified) {
      setError('Please enter a valid YouTube URL');
      return;
    }

    if (rewardAmount < 10 || rewardAmount > 500) {
      setError('Reward must be between GHS 10 - 500');
      return;
    }

    if (rewardAmount > userBalance) {
      setError(`Insufficient balance. You have GHS ${userBalance} but need GHS ${rewardAmount}.`);
      return;
    }

    setLoading(true);
    try {
      const result = await createCampaignAction(
        user.id,
        videoUrl,
        youtubeId,
        videoTitle,
        rewardAmount
      );

      if (result.success) {
        window.location.href = '/dashboard/creator';
      } else {
        setError(result.error || 'Failed to create campaign');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create campaign');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-2xl mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2 flex items-center gap-2">
            <Play className="w-8 h-8 text-trust" />
            Create Campaign
          </h1>
          <p className="text-muted-foreground">
            Promote your YouTube video and reach real viewers
          </p>
        </div>

        {userBalance === 0 && (
          <Card className="bg-caution/10 border-caution/30 p-4 mb-6">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-caution shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-bold text-caution">Your balance is GHS 0</p>
                <p className="text-xs text-caution/80 mt-1">
                  Top up your account before creating a campaign.
                </p>
              </div>
            </div>
          </Card>
        )}

        {error && (
          <Card className="bg-caution/10 border-caution/30 p-4 mb-6">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-caution shrink-0 mt-0.5" />
              <p className="text-sm font-bold text-caution">{error}</p>
            </div>
          </Card>
        )}

        <Card className="bg-card border-border p-8 mb-6">
          <form className="space-y-6" onSubmit={handleSubmit}>

            {/* YouTube URL */}
            <div className="space-y-2">
              <label className="block text-sm font-bold text-foreground flex items-center gap-2">
                <Play className="w-4 h-4 text-muted-foreground" />
                YouTube Video URL
              </label>
              <Input
                type="url"
                value={videoUrl}
                onChange={handleVideoUrlChange}
                placeholder="https://youtube.com/watch?v=..."
                className="h-10 border-border bg-background"
                disabled={loading}
              />

              {verifying && (
                <p className="text-xs text-trust font-bold flex items-center gap-1">
                  <Zap className="w-3 h-3 animate-spin" /> Fetching video title...
                </p>
              )}

              {/* Video title */}
              {verified && videoTitle && (
                <div className="p-3 bg-earn/10 border border-earn/20 rounded-lg">
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-earn shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs text-muted-foreground">Video found:</p>
                      <p className="text-sm font-bold text-foreground">{videoTitle}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* ✅ Thumbnail preview - so creator sees before paying */}
              {verified && youtubeId && (
                <div className="rounded-lg overflow-hidden border border-earn/20 mt-2">
                  <img
                    src={`https://img.youtube.com/vi/${youtubeId}/maxresdefault.jpg`}
                    alt={videoTitle}
                    className="w-full object-cover"
                  />
                  <div className="p-2 bg-earn/10">
                    <p className="text-xs text-earn font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" />
                      This is how your video appears to earners
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Reward Amount */}
            {verified && (
              <div className="space-y-2">
                <label className="block text-sm font-bold text-foreground flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-muted-foreground" />
                  Reward Per View (GHS)
                </label>
                <Input
                  type="number"
                  value={rewardAmount}
                  onChange={(e) => setRewardAmount(Number(e.target.value))}
                  min={10}
                  max={500}
                  step={10}
                  className="h-10 border-border bg-background"
                  disabled={loading}
                />
                <p className="text-xs text-muted-foreground">Min: GHS 10 | Max: GHS 500</p>

                <Card className="bg-trust/10 border-trust/20 p-4 mt-2">
                  <p className="text-xs font-bold text-muted-foreground mb-3">Per view breakdown:</p>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">You pay:</span>
                      <span className="font-bold text-caution">GHS {rewardAmount}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Earner gets:</span>
                      <span className="font-bold text-earn">GHS {EARNER_EARNING}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Platform fee (15%):</span>
                      <span className="font-bold text-reward">GHS {PLATFORM_CUT}</span>
                    </div>
                  </div>
                </Card>

                {rewardAmount > userBalance && (
                  <div className="flex items-start gap-2 p-3 bg-caution/10 border border-caution/30 rounded">
                    <AlertTriangle className="w-4 h-4 text-caution shrink-0 mt-0.5" />
                    <p className="text-xs font-bold text-caution">
                      Not enough balance. You have GHS {userBalance}, need GHS {rewardAmount}.
                    </p>
                  </div>
                )}
              </div>
            )}

            {verified && (
              <Button
                type="submit"
                className="w-full h-11 bg-trust hover:bg-trust/90 text-white font-bold"
                disabled={loading || rewardAmount > userBalance}
              >
                {loading ? (
                  <><span className="animate-spin mr-2">⚙️</span> Creating...</>
                ) : (
                  <><Zap className="w-4 h-4 mr-2" /> Create Campaign</>
                )}
              </Button>
            )}
          </form>
        </Card>

        {/* Balance */}
        <Card className="bg-card border-border p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground font-bold">Your Balance</p>
              <p className="text-xl font-bold text-trust">GHS {userBalance}</p>
            </div>
            <Badge className={userBalance > 0 ? 'bg-earn/20 text-earn' : 'bg-caution/20 text-caution'}>
              {userBalance > 0 ? 'Ready' : 'Top Up Needed'}
            </Badge>
          </div>
        </Card>
      </div>
    </div>
  );
}