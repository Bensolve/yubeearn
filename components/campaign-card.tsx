"use client";

import Image from "next/image";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatAmount } from "@/lib/utils";
import { TrendingUp, Users, Clock, MoreVertical, Eye } from "lucide-react";

interface CampaignCardProps {
  id: string;
  videoTitle: string;
  youtubeUrl: string;
  youtubeId: string;
  status: "active" | "expired" | "cancelled";
  completions: number;
  watchHours: number;
  spent: number;
  daysLeft?: number;
  rewardAmount: number;
}

// Get YouTube thumbnail
function getYouTubeThumbnail(videoId: string): string {
  return `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
}

export default function CampaignCard({
  id,
  videoTitle,
  youtubeUrl,
  youtubeId,
  status,
  completions,
  watchHours,
  spent,
  daysLeft,
  rewardAmount,
}: CampaignCardProps) {
  const thumbnailUrl = getYouTubeThumbnail(youtubeId);

  const statusColors = {
    active: "bg-earn/20 text-earn",
    expired: "bg-caution/20 text-caution",
    cancelled: "bg-muted text-muted-foreground",
  };

  const statusLabels = {
    active: "🔴 Active",
    expired: "⏱️ Expired",
    cancelled: "⊘ Cancelled",
  };

  return (
    <Link href={`/dashboard/creator/campaigns/${id}`}>
      <Card className="overflow-hidden bg-card border-border hover:border-trust/50 hover:shadow-lg transition cursor-pointer h-full">
        {/* Thumbnail */}
        <div className="relative w-full h-40 bg-muted">
          <Image
            src={thumbnailUrl}
            alt={videoTitle}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover"
            priority
          />
          {/* Status Badge Overlay */}
          <div className="absolute top-2 left-2">
            <Badge className={statusColors[status]}>
              {statusLabels[status]}
            </Badge>
          </div>

          {/* Days Left (if active) */}
          {status === "active" && daysLeft && (
            <div className="absolute bottom-2 right-2 bg-black/70 text-white px-2 py-1 rounded text-xs font-bold">
              {daysLeft}d left
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-4 space-y-4">
          {/* Title */}
          <div>
            <h3 className="text-sm font-bold text-foreground line-clamp-2">
              {videoTitle}
            </h3>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-2">
            {/* Completions - EARN (green) */}
            <div className="p-2 bg-earn/10 rounded-lg border border-earn/20">
              <div className="flex items-center gap-1 mb-1">
                <Users className="w-3 h-3 text-earn" />
                <p className="text-xs text-muted-foreground">Completions</p>
              </div>
              <p className="text-sm font-bold text-earn">{completions}</p>
            </div>

            {/* Watch Hours - TRUST (blue) */}
            <div className="p-2 bg-trust/10 rounded-lg border border-trust/20">
              <div className="flex items-center gap-1 mb-1">
                <Clock className="w-3 h-3 text-trust" />
                <p className="text-xs text-muted-foreground">Hours</p>
              </div>
              <p className="text-sm font-bold text-trust">{watchHours}h</p>
            </div>

            {/* Spent - CAUTION (red) */}
            <div className="p-2 bg-caution/10 rounded-lg border border-caution/20">
              <div className="flex items-center gap-1 mb-1">
                <TrendingUp className="w-3 h-3 text-caution" />
                <p className="text-xs text-muted-foreground">Spent</p>
              </div>
              <p className="text-sm font-bold text-caution">
                GHS {formatAmount(spent)}
              </p>
            </div>

            {/* Cost Per View */}
            <div className="p-2 bg-reward/10 rounded-lg border border-reward/20">
              <div className="flex items-center gap-1 mb-1">
                <Eye className="w-3 h-3 text-reward" />
                <p className="text-xs text-muted-foreground">Per View</p>
              </div>
              <p className="text-sm font-bold text-reward">
                GHS {rewardAmount}
              </p>
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-border" />

          {/* Footer: ROI Progress */}
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground">ROI Progress</p>
              <div className="w-20 h-2 bg-muted rounded-full mt-1 overflow-hidden">
                <div
                  className="h-full bg-earn"
                  style={{ width: `${Math.min((watchHours / 4) * 100, 100)}%` }}
                />
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {((watchHours / 4) * 100).toFixed(0)}% to goal
              </p>
            </div>
            <MoreVertical className="w-4 h-4 text-muted-foreground" />
          </div>
        </div>
      </Card>
    </Link>
  );
}
