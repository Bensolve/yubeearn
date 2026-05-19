import { getLoggedInUserAction } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Link from 'next/link';
import CampaignCard from '@/components/campaign-card';
import { Plus, Video } from 'lucide-react';

export default async function CampaignsPage() {
  const user = await getLoggedInUserAction();

  if (!user || user.role !== 'creator') {
    redirect('/login');
  }

  // Mock campaigns - replace with Firebase query later
  const campaigns = [
    {
      id: '1',
      videoTitle: 'How to Make Money Online 2026',
      youtubeUrl: 'https://youtube.com/watch?v=dQw4w9WgXcQ',
      youtubeId: 'dQw4w9WgXcQ',
      status: 'active' as const,
      completions: 42,
      watchHours: 3.5,
      spent: 4200,
      daysLeft: 3,
      rewardAmount: 100,
    },
    {
      id: '2',
      videoTitle: 'JavaScript Tutorial for Beginners',
      youtubeUrl: 'https://youtube.com/watch?v=dQw4w9WgXcQ',
      youtubeId: 'dQw4w9WgXcQ',
      status: 'active' as const,
      completions: 28,
      watchHours: 2.3,
      spent: 2800,
      daysLeft: 5,
      rewardAmount: 100,
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2 flex items-center gap-2">
              <Video className="w-8 h-8 text-reward" />
              All Campaigns
            </h1>
            <p className="text-muted-foreground">
              Manage and monitor your YouTube promotion campaigns
            </p>
          </div>
          <Link href="/dashboard/creator/campaigns/new">
            <Button className="bg-trust hover:bg-trust-light text-white font-bold">
              <Plus className="w-4 h-4 mr-2" />
              New Campaign
            </Button>
          </Link>
        </div>

        {/* Campaigns Grid */}
        {campaigns.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {campaigns.map((campaign) => (
              <CampaignCard key={campaign.id} {...campaign} />
            ))}
          </div>
        ) : (
          <Card className="bg-card border-border p-12 text-center">
            <div className="text-5xl mb-4">🎬</div>
            <h3 className="text-2xl font-bold text-foreground mb-2">
              No campaigns yet
            </h3>
            <p className="text-muted-foreground mb-8">
              Create your first campaign to start promoting your YouTube videos
            </p>
            <Link href="/dashboard/creator/campaigns/new">
              <Button className="bg-trust hover:bg-trust-light text-white font-bold">
                <Plus className="w-4 h-4 mr-2" />
                Create Campaign
              </Button>
            </Link>
          </Card>
        )}
      </div>
    </div>
  );
}