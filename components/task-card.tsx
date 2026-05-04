'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { formatAmount } from '@/lib/utils';
import { completeTaskAction } from '@/lib/actions/tasks';
import Image from 'next/image';
import type { Task } from '@/types';
import { Play, CheckCircle2, Users, Clock, Zap, AlertCircle } from 'lucide-react';

interface TaskCardProps {
  task: Task;
  isCompleted: boolean;
  userId: string;
}

// Extract YouTube video ID from URL
function getYouTubeId(url: string): string {
  const regex = /(?:youtube\.com\/watch\?v=|youtu\.be\/)([\w-]+)/;
  const match = url.match(regex);
  return match ? match[1] : '';
}

// Get YouTube thumbnail URL
function getYouTubeThumbnail(videoId: string): string {
  return `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
}

export default function TaskCard({ task, isCompleted, userId }: TaskCardProps) {
  const [loading, setLoading] = useState(false);
  const [watched, setWatched] = useState(isCompleted);
  const [error, setError] = useState('');
  
  const videoId = getYouTubeId(task.youtubeUrl);
  const thumbnailUrl = getYouTubeThumbnail(videoId);

  const handleWatchOnYouTube = () => {
    window.open(task.youtubeUrl, '_blank');
  };

  const handleClaimReward = async () => {
    setLoading(true);
    setError('');
    try {
      const result = await completeTaskAction(userId, task.id, task.reward);
      
      if (result.success) {
        setWatched(true);
      } else {
        setError(result.error || 'Failed to claim reward');
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error claiming reward';
      setError(message);
      console.error('[Tasks] Error claiming reward:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card
      className={`overflow-hidden border-border transition ${
        watched
          ? 'bg-muted/50 opacity-75 hover:opacity-80'
          : 'bg-card hover:shadow-lg hover:border-primary/50'
      }`}
    >
      {/* YouTube Thumbnail Preview */}
      <div className="relative w-full h-48 bg-muted">
        <Image
          src={thumbnailUrl}
          alt={task.title}
          fill
          className="object-cover"
          priority
        />
        {/* Overlay - Play Button */}
        {!watched && (
          <div className="absolute inset-0 bg-black/20 hover:bg-black/30 transition flex items-center justify-center group">
            <button
              onClick={handleWatchOnYouTube}
              className="bg-primary hover:bg-primary/90 text-white rounded-full p-4 transition transform group-hover:scale-110 shadow-lg"
              aria-label="Play video"
              title="Open video on YouTube"
            >
              <Play className="w-6 h-6 fill-white" />
            </button>
          </div>
        )}
        {/* Overlay - Completed Badge */}
        {watched && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
            <Badge className="bg-success text-white text-sm">
              <CheckCircle2 className="w-4 h-4 mr-1 shrink-0" />
              Completed
            </Badge>
          </div>
        )}
      </div>

      {/* Card Content */}
      <div className="p-6 space-y-4">
        {/* Task Title & Description */}
        <div>
          <div className="flex items-start justify-between gap-2 mb-2">
            <h3 className="text-lg font-bold text-foreground">{task.title}</h3>
            {watched && (
              <Badge className="bg-success/20 text-success border-success/30 shrink-0">
                Done
              </Badge>
            )}
          </div>
          <p className="text-sm text-muted-foreground">{task.description}</p>
        </div>

        {/* Task Meta Info - with icons */}
        <div className="grid grid-cols-2 gap-3 py-3 border-y border-border">
          <div className="flex items-center gap-2 text-sm">
            <Clock className="w-4 h-4 text-muted-foreground shrink-0" />
            <span className="text-muted-foreground">{task.duration} min</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Users className="w-4 h-4 text-muted-foreground shrink-0" />
            <span className="text-muted-foreground">{task.completions} completed</span>
          </div>
        </div>

        {/* Reward Box - SUCCESS (Green - money) */}
        <div className="bg-success/10 border border-success/20 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground font-bold mb-1">You&lsquo;ll earn</p>
              <p className="text-2xl font-bold text-success">
                GHS {formatAmount(task.reward)}
              </p>
            </div>
            <div className="w-10 h-10 bg-success/10 rounded-lg flex items-center justify-center shrink-0">
              <Zap className="w-5 h-5 text-success" />
            </div>
          </div>
        </div>

        {/* Error Message - WARNING (Red) */}
        {error && (
          <div className="bg-red-100 dark:bg-red-900/30 border-l-4 border-red-600 text-red-800 dark:text-red-200 p-3 rounded">
            <div className="flex items-start gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <p className="text-xs font-bold">{error}</p>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="space-y-2 pt-2">
          {!watched ? (
            <>
              {/* PRIMARY: Watch button */}
              <Button
                className="w-full h-10 bg-primary hover:bg-primary/90 text-white font-bold transition"
                onClick={handleWatchOnYouTube}
                disabled={loading}
              >
                <Play className="w-4 h-4 mr-2 fill-white" />
                Watch on YouTube
              </Button>
              {/* SUCCESS: Claim reward button */}
              <Button
                className="w-full h-10 bg-success hover:bg-success/90 text-white font-bold transition"
                onClick={handleClaimReward}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="inline-block animate-spin mr-2">⚙️</span>
                    Claiming...
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4 mr-2 shrink-0" />
                    Claim Reward
                  </>
                )}
              </Button>
              <p className="text-xs text-muted-foreground text-center">
                Watch the video first, then claim your reward
              </p>
            </>
          ) : (
            /* MUTED: Already completed button */
            <Button 
              disabled 
              className="w-full h-10 bg-muted text-muted-foreground cursor-not-allowed"
            >
              <CheckCircle2 className="w-4 h-4 mr-2 shrink-0" />
              Already Completed
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
}