import { getLoggedInUserAction } from '@/lib/auth';
import { getCreatorCampaignsAction } from '@/lib/actions/campaigns';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { formatAmount } from '@/lib/utils';
import { TrendingUp, Video, Users, BarChart3, Zap, ArrowRight, Plus } from 'lucide-react';
// ✅ CORRECT
import TestBalanceButton from '@/components/test-balance-button';
import Image from 'next/image';

export default async function CreatorDashboard() {
  const user = await getLoggedInUserAction();

  if (!user || user.role !== 'creator') {
    redirect('/login');
  }

  const campaigns = await getCreatorCampaignsAction(user.id);

  const totalSpent = campaigns.reduce((sum, c) => sum + c.spent, 0);
  const activeCampaigns = campaigns.filter(c => c.status === 'active').length;
  const totalCompletions = campaigns.reduce((sum, c) => sum + c.completions, 0);
  const totalWatchHours = campaigns.reduce((sum, c) => sum + c.watchHours, 0);

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto px-6 py-8">

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2 flex items-center gap-2">
                <Video className="w-8 h-8 text-trust" />
                Creator Dashboard
              </h1>
              <p className="text-muted-foreground">
                Manage your campaigns and grow your YouTube channel
              </p>
            </div>
            <Link href="/dashboard/creator/campaigns/new" className="shrink-0">
              <Button className="bg-trust hover:bg-trust/90 text-white font-bold">
                <Plus className="w-4 h-4 mr-2" />
                New Campaign
              </Button>
            </Link>
          </div>

          {user.balance === 0 && (
            <div className="mt-4">
              <TestBalanceButton userId={user.id} />
            </div>
          )}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="bg-trust/5 border-trust/20 p-6 hover:border-trust/50 transition">
            <div className="flex items-start justify-between mb-4">
              <div className="w-10 h-10 bg-trust/10 rounded-lg flex items-center justify-center">
                <Zap className="w-5 h-5 text-trust" />
              </div>
              <Badge className="bg-trust/20 text-trust border-trust/30 shrink-0">Budget</Badge>
            </div>
            <p className="text-xs text-muted-foreground mb-1 font-bold">Unspent Balance</p>
            <p className="text-3xl font-bold text-trust">GHS {formatAmount(user.balance || 0)}</p>
            <p className="text-xs text-muted-foreground mt-2">Ready to spend</p>
          </Card>

          <Card className="bg-caution/5 border-caution/20 p-6 hover:border-caution/50 transition">
            <div className="flex items-start justify-between mb-4">
              <div className="w-10 h-10 bg-caution/10 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-caution" />
              </div>
              <Badge className="bg-caution/20 text-caution border-caution/30 shrink-0">Spent</Badge>
            </div>
            <p className="text-xs text-muted-foreground mb-1 font-bold">Total Spent</p>
            <p className="text-3xl font-bold text-caution">GHS {formatAmount(totalSpent)}</p>
            <p className="text-xs text-muted-foreground mt-2">All-time spend</p>
          </Card>

          <Card className="bg-reward/5 border-reward/20 p-6 hover:border-reward/50 transition">
            <div className="flex items-start justify-between mb-4">
              <div className="w-10 h-10 bg-reward/10 rounded-lg flex items-center justify-center">
                <Video className="w-5 h-5 text-reward" />
              </div>
              <Badge className="bg-reward/20 text-reward border-reward/30 shrink-0">Active</Badge>
            </div>
            <p className="text-xs text-muted-foreground mb-1 font-bold">Active Campaigns</p>
            <p className="text-3xl font-bold text-reward">{activeCampaigns}</p>
            <p className="text-xs text-muted-foreground mt-2">Running now</p>
          </Card>

          <Card className="bg-earn/5 border-earn/20 p-6 hover:border-earn/50 transition">
            <div className="flex items-start justify-between mb-4">
              <div className="w-10 h-10 bg-earn/10 rounded-lg flex items-center justify-center">
                <Users className="w-5 h-5 text-earn" />
              </div>
              <Badge className="bg-earn/20 text-earn border-earn/30 shrink-0">Completions</Badge>
            </div>
            <p className="text-xs text-muted-foreground mb-1 font-bold">Total Completions</p>
            <p className="text-3xl font-bold text-earn">{totalCompletions}</p>
            <p className="text-xs text-muted-foreground mt-2">Real watch hours</p>
          </Card>
        </div>

        {/* Performance Metrics */}
        <Card className="bg-card border-border p-6 mb-8">
          <h2 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-trust" />
            Performance Metrics
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-4 bg-muted/50 rounded-lg">
              <p className="text-xs text-muted-foreground font-bold mb-1">Total Watch Hours</p>
              <p className="text-2xl font-bold text-earn">{totalWatchHours.toFixed(1)}h</p>
              <p className="text-xs text-muted-foreground mt-2">Real YouTube hours delivered</p>
            </div>
            <div className="p-4 bg-muted/50 rounded-lg">
              <p className="text-xs text-muted-foreground font-bold mb-1">Cost Per View</p>
              <p className="text-2xl font-bold text-trust">GHS 100</p>
              <p className="text-xs text-muted-foreground mt-2">Fixed by platform</p>
            </div>
            <div className="p-4 bg-muted/50 rounded-lg">
              <p className="text-xs text-muted-foreground font-bold mb-1">Total Campaigns</p>
              <p className="text-2xl font-bold text-reward">{campaigns.length}</p>
              <p className="text-xs text-muted-foreground mt-2">All time</p>
            </div>
          </div>
        </Card>

        {/* Campaigns with thumbnails */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
              <Video className="w-6 h-6 text-reward" />
              Your Campaigns
            </h2>
            <Badge className="bg-reward/20 text-reward">{campaigns.length} Total</Badge>
          </div>

          {campaigns.length > 0 ? (
            <div className="space-y-4">
              {campaigns.map((campaign) => (
                <Card key={campaign.id} className="bg-card border-border hover:border-trust/50 hover:shadow-lg transition overflow-hidden">
                  <div className="flex flex-col md:flex-row">

                    {/* ✅ YouTube Thumbnail */}
                    <div className="relative w-full md:w-56 h-40 shrink-0 bg-muted">
                      <Image
                        src={`https://img.youtube.com/vi/${campaign.youtubeId}/maxresdefault.jpg`}
                        alt={campaign.videoTitle}
                        fill
                        sizes="(max-width: 768px) 100vw, 224px"
                        className="object-cover"
                      />
                      <div className="absolute top-2 left-2">
                        <Badge className={campaign.status === 'active'
                          ? 'bg-earn text-white'
                          : 'bg-muted text-muted-foreground'
                        }>
                          {campaign.status === 'active' ? '🔴 Live' : campaign.status}
                        </Badge>
                      </div>
                      <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded font-bold">
                        {campaign.daysLeft}d left
                      </div>
                    </div>

                    {/* Campaign Info */}
                    <div className="flex-1 p-4">
                      <div className="flex items-start justify-between gap-2 mb-3">
                        <h3 className="text-lg font-bold text-foreground leading-tight">
                          {campaign.videoTitle}
                        </h3>
                        <ArrowRight className="w-5 h-5 text-muted-foreground shrink-0" />
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        <div className="p-2 bg-muted/50 rounded">
                          <p className="text-xs text-muted-foreground">Completions</p>
                          <p className="text-lg font-bold text-earn">{campaign.completions}</p>
                        </div>
                        <div className="p-2 bg-muted/50 rounded">
                          <p className="text-xs text-muted-foreground">Spent</p>
                          <p className="text-lg font-bold text-caution">GHS {formatAmount(campaign.spent)}</p>
                        </div>
                        <div className="p-2 bg-muted/50 rounded">
                          <p className="text-xs text-muted-foreground">Watch Hours</p>
                          <p className="text-lg font-bold text-trust">{campaign.watchHours.toFixed(1)}h</p>
                        </div>
                        <div className="p-2 bg-muted/50 rounded">
                          <p className="text-xs text-muted-foreground">Reward/View</p>
                          <p className="text-lg font-bold text-reward">GHS {campaign.rewardAmount}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="bg-card border-border p-12 text-center">
              <div className="text-5xl mb-4">🎬</div>
              <h3 className="text-2xl font-bold text-foreground mb-2">No campaigns yet</h3>
              <p className="text-muted-foreground mb-8 max-w-sm mx-auto">
                Create your first campaign to start promoting your YouTube videos
              </p>
              <Link href="/dashboard/creator/campaigns/new">
                <Button className="bg-trust hover:bg-trust/90 text-white font-bold">
                  <Plus className="w-4 h-4 mr-2" />
                  Create Your First Campaign
                </Button>
              </Link>
            </Card>
          )}
        </div>

        {/* Info Box */}
        <Card className="bg-trust/10 border-trust/20 p-6">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 bg-trust/10 rounded-lg flex items-center justify-center shrink-0">
              <Zap className="w-5 h-5 text-trust" />
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-foreground mb-2">How It Works</h3>
              <p className="text-sm text-muted-foreground">
                Create a campaign for your YouTube video. Real viewers watch and earn money.
                You pay GHS 100 per viewer — real watch hours, real growth.
              </p>
            </div>
          </div>
        </Card>

      </div>
    </div>
  );
}