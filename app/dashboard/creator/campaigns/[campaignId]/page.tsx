import { getLoggedInUserAction } from '@/lib/auth';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { formatAmount } from '@/lib/utils';
import { ArrowLeft, TrendingUp, Users, Clock, Zap, AlertTriangle, Share2, Pause } from 'lucide-react';

export default async function CampaignAnalytics({
  params,
}: {
  params: { campaignId: string };
}) {
  const user = await getLoggedInUserAction();

  if (!user || user.role !== 'creator') {
    redirect('/login');
  }

  // Mock data - replace with real Firebase data
  const campaign = {
    id: params.campaignId,
    videoTitle: 'How to Make Money Online 2026',
    youtubeUrl: 'https://youtube.com/watch?v=dQw4w9WgXcQ',
    videoThumbnail: 'https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg',
    status: 'active' as const,
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
    expiresAt: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000), // 4 days left
    rewardAmount: 100,
    stats: {
      completions: 42,
      spent: 4200,
      watchHours: 3.5,
      avgWatchTime: 8.3, // minutes
      fraudDetections: 2,
      conversionRate: 85, // %
    },
  };

  const daysLeft = Math.ceil(
    (campaign.expiresAt.getTime() - Date.now()) / (24 * 60 * 60 * 1000)
  );

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Header with back button */}
        <Link href="/dashboard/creator" className="inline-flex items-center gap-2 text-trust font-bold mb-6 hover:text-trust-light transition">
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </Link>

        {/* Campaign Title & Status */}
        <div className="flex items-start justify-between mb-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
              {campaign.videoTitle}
            </h1>
            <div className="flex items-center gap-2">
              {campaign.status === 'active' && (
                <Badge className="bg-earn/20 text-earn">🔴 Live</Badge>
              )}
              <p className="text-sm text-muted-foreground">
                Created {campaign.createdAt.toLocaleDateString()}
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 shrink-0">
            <Button variant="outline" className="border-trust text-trust hover:bg-trust/5">
              <Share2 className="w-4 h-4 mr-2" />
              Share
            </Button>
            <Button variant="outline" className="border-caution text-caution hover:bg-caution/5">
              <Pause className="w-4 h-4 mr-2" />
              Pause
            </Button>
          </div>
        </div>

        {/* Performance Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          {/* Completions - EARN (green) */}
          <Card className="bg-earn/5 border-earn/20 p-6 hover:border-earn/50 transition">
            <div className="flex items-start justify-between mb-4">
              <div className="w-10 h-10 bg-earn/10 rounded-lg flex items-center justify-center">
                <Users className="w-5 h-5 text-earn" />
              </div>
              <Badge className="bg-earn/20 text-earn shrink-0">Views</Badge>
            </div>
            <p className="text-xs text-muted-foreground mb-1 font-bold">Completions</p>
            <p className="text-3xl font-bold text-earn">{campaign.stats.completions}</p>
            <p className="text-xs text-muted-foreground mt-2">Real watch count</p>
          </Card>

          {/* Total Spent - CAUTION (red) */}
          <Card className="bg-caution/5 border-caution/20 p-6 hover:border-caution/50 transition">
            <div className="flex items-start justify-between mb-4">
              <div className="w-10 h-10 bg-caution/10 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-caution" />
              </div>
              <Badge className="bg-caution/20 text-caution shrink-0">Spent</Badge>
            </div>
            <p className="text-xs text-muted-foreground mb-1 font-bold">Total Spent</p>
            <p className="text-3xl font-bold text-caution">GHS {formatAmount(campaign.stats.spent)}</p>
            <p className="text-xs text-muted-foreground mt-2">Cost per view: GHS {campaign.rewardAmount}</p>
          </Card>

          {/* Watch Hours - TRUST (blue) */}
          <Card className="bg-trust/5 border-trust/20 p-6 hover:border-trust/50 transition">
            <div className="flex items-start justify-between mb-4">
              <div className="w-10 h-10 bg-trust/10 rounded-lg flex items-center justify-center">
                <Clock className="w-5 h-5 text-trust" />
              </div>
              <Badge className="bg-trust/20 text-trust shrink-0">Hours</Badge>
            </div>
            <p className="text-xs text-muted-foreground mb-1 font-bold">Watch Hours</p>
            <p className="text-3xl font-bold text-trust">{campaign.stats.watchHours}h</p>
            <p className="text-xs text-muted-foreground mt-2">Towards 4,000 hour goal</p>
          </Card>

          {/* Time Remaining - REWARD (gold) */}
          <Card className="bg-reward/5 border-reward/20 p-6 hover:border-reward/50 transition">
            <div className="flex items-start justify-between mb-4">
              <div className="w-10 h-10 bg-reward/10 rounded-lg flex items-center justify-center">
                <Zap className="w-5 h-5 text-reward" />
              </div>
              <Badge className="bg-reward/20 text-reward shrink-0">Time</Badge>
            </div>
            <p className="text-xs text-muted-foreground mb-1 font-bold">Days Left</p>
            <p className="text-3xl font-bold text-reward">{daysLeft}</p>
            <p className="text-xs text-muted-foreground mt-2">Campaign auto-expires</p>
          </Card>
        </div>

        {/* Detailed Analytics */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Metrics Card */}
          <Card className="bg-card border-border p-6">
            <h2 className="text-xl font-bold text-foreground mb-4">Detailed Metrics</h2>
            <div className="space-y-4">
              <div className="flex justify-between items-center pb-3 border-b border-border">
                <div>
                  <p className="text-sm text-muted-foreground">Avg Watch Time</p>
                  <p className="text-xs text-muted-foreground mt-1">Per completed task</p>
                </div>
                <p className="text-lg font-bold text-earn">{campaign.stats.avgWatchTime}m</p>
              </div>

              <div className="flex justify-between items-center pb-3 border-b border-border">
                <div>
                  <p className="text-sm text-muted-foreground">Conversion Rate</p>
                  <p className="text-xs text-muted-foreground mt-1">Task completion rate</p>
                </div>
                <p className="text-lg font-bold text-trust">{campaign.stats.conversionRate}%</p>
              </div>

              <div className="flex justify-between items-center pb-3 border-b border-border">
                <div>
                  <p className="text-sm text-muted-foreground">Fraud Detections</p>
                  <p className="text-xs text-muted-foreground mt-1">Suspicious completions</p>
                </div>
                <p className="text-lg font-bold text-caution">{campaign.stats.fraudDetections}</p>
              </div>

              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-muted-foreground">Estimated YouTube Views</p>
                  <p className="text-xs text-muted-foreground mt-1">Real watch hours</p>
                </div>
                <p className="text-lg font-bold text-reward">{Math.round(campaign.stats.watchHours * 60)}</p>
              </div>
            </div>
          </Card>

          {/* Campaign Info */}
          <Card className="bg-card border-border p-6">
            <h2 className="text-xl font-bold text-foreground mb-4">Campaign Details</h2>
            <div className="space-y-4">
              <div>
                <p className="text-xs text-muted-foreground font-bold">YouTube URL</p>
                <a
                  href={campaign.youtubeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-trust hover:text-trust-light font-bold mt-1 break-all"
                >
                  {campaign.youtubeUrl}
                </a>
              </div>

              <div>
                <p className="text-xs text-muted-foreground font-bold">Reward Per View</p>
                <p className="text-sm text-foreground mt-1">GHS {campaign.rewardAmount}</p>
              </div>

              <div>
                <p className="text-xs text-muted-foreground font-bold">Campaign Duration</p>
                <p className="text-sm text-foreground mt-1">
                  {campaign.createdAt.toLocaleDateString()} to {campaign.expiresAt.toLocaleDateString()}
                </p>
              </div>

              <div>
                <p className="text-xs text-muted-foreground font-bold">Status</p>
                <Badge className="bg-earn/20 text-earn mt-2">Active & Running</Badge>
              </div>
            </div>
          </Card>
        </div>

        {/* Info Box - How to Improve */}
        <Card className="bg-trust/10 border-trust/20 p-6">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 bg-trust/10 rounded-lg flex items-center justify-center shrink-0">
              <Zap className="w-5 h-5 text-trust" />
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-foreground mb-2">Tips to Improve Performance</h3>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>✓ Engaging thumbnails attract more clicks</li>
                <li>✓ Clear titles help viewers understand content</li>
                <li>✓ First 10 seconds are critical for watch time</li>
                <li>✓ Quality content gets more completions</li>
              </ul>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}