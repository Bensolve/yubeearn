'use client';

import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { formatAmount } from '@/lib/utils';
import { completeTaskAction } from '@/lib/actions/campaigns';
import Image from 'next/image';
import type { Task } from '@/types';
import { Play, CheckCircle2, Users, Clock, Zap, AlertCircle } from 'lucide-react';

interface TaskCardProps {
  task: Task;
  isCompleted: boolean;
  userId: string;
}

function getYouTubeId(url: string): string {
  const regex = /(?:youtube\.com\/watch\?v=|youtu\.be\/)([\w-]+)/;
  const match = url.match(regex);
  return match ? match[1] : '';
}

function getYouTubeThumbnail(videoId: string): string {
  return `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
}

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
}

export default function TaskCard({ task, isCompleted, userId }: TaskCardProps) {
  const [loading, setLoading] = useState(false);
  const [watched, setWatched] = useState(isCompleted);
  const [error, setError] = useState('');

  // Timer: duration in seconds (task.duration is in minutes)
  const totalSeconds = (task.duration || 5) * 60;
  const [timeLeft, setTimeLeft] = useState(totalSeconds);
  const [timerRunning, setTimerRunning] = useState(false);
  const [timerDone, setTimerDone] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const videoId = getYouTubeId(task.youtubeUrl);
  const thumbnailUrl = getYouTubeThumbnail(videoId);

  // Start timer when user clicks Watch
  const handleWatchOnYouTube = () => {
    window.open(task.youtubeUrl, '_blank');

    if (!timerRunning && !timerDone) {
      setTimerRunning(true);
      console.log('[TaskCard] Timer started for:', task.title);
    }
  };

  // Countdown timer
  useEffect(() => {
    if (!timerRunning) return;

    intervalRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(intervalRef.current!);
          setTimerRunning(false);
          setTimerDone(true);
          console.log('[TaskCard] Timer done — claim unlocked for:', task.title);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(intervalRef.current!);
  }, [timerRunning]);

  const handleClaimReward = async () => {
    setLoading(true);
    setError('');
    try {
      const result = await completeTaskAction(userId, task.id, task.reward);
      if (result.success) {
        setWatched(true);
        console.log('[TaskCard] Reward claimed:', task.title);
      } else {
        setError(result.error || 'Failed to claim reward');
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error claiming reward';
      setError(message);
      console.error('[TaskCard] Error claiming reward:', err);
    } finally {
      setLoading(false);
    }
  };

  // Progress percentage for timer bar
  const progress = ((totalSeconds - timeLeft) / totalSeconds) * 100;

  return (
    <Card className={`overflow-hidden border-border transition ${
      watched
        ? 'bg-muted/50 opacity-75'
        : 'bg-card hover:shadow-lg hover:border-primary/50'
    }`}>
      {/* Thumbnail */}
      <div className="relative w-full h-48 bg-muted">
        <Image
          src={thumbnailUrl}
          alt={task.title}
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-cover"
          priority
        />
        {!watched && (
          <div className="absolute inset-0 bg-black/20 hover:bg-black/30 transition flex items-center justify-center group">
            <button
              onClick={handleWatchOnYouTube}
              className="bg-primary hover:bg-primary/90 text-white rounded-full p-4 transition transform group-hover:scale-110 shadow-lg"
              aria-label="Play video"
            >
              <Play className="w-6 h-6 fill-white" />
            </button>
          </div>
        )}
        {watched && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
            <Badge className="bg-success text-white text-sm">
              <CheckCircle2 className="w-4 h-4 mr-1 shrink-0" />
              Completed
            </Badge>
          </div>
        )}
      </div>

      {/* Timer Progress Bar - shows after Watch is clicked */}
      {timerRunning && (
        <div className="w-full h-2 bg-muted">
          <div
            className="h-full bg-success transition-all duration-1000"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}
      {timerDone && !watched && (
        <div className="w-full h-2 bg-success" />
      )}

      {/* Content */}
      <div className="p-6 space-y-4">
        <div>
          <div className="flex items-start justify-between gap-2 mb-2">
            <h3 className="text-lg font-bold text-foreground">{task.title}</h3>
            {watched && (
              <Badge className="bg-success/20 text-success border-success/30 shrink-0">Done</Badge>
            )}
          </div>
          <p className="text-sm text-muted-foreground">{task.description}</p>
        </div>

        {/* Meta */}
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

        {/* Reward */}
        <div className="bg-success/10 border border-success/20 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground font-bold mb-1">You&apos;ll earn</p>
              <p className="text-2xl font-bold text-success">GHS {formatAmount(task.reward)}</p>
            </div>
            <div className="w-10 h-10 bg-success/10 rounded-lg flex items-center justify-center shrink-0">
              <Zap className="w-5 h-5 text-success" />
            </div>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="bg-destructive/10 border-l-4 border-destructive p-3 rounded">
            <div className="flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-destructive shrink-0 mt-0.5" />
              <p className="text-xs font-bold text-destructive">{error}</p>
            </div>
          </div>
        )}

        {/* Buttons */}
        <div className="space-y-2 pt-2">
          {!watched ? (
            <>
              {/* Watch Button */}
              <Button
                className="w-full h-10 bg-primary hover:bg-primary/90 text-white font-bold"
                onClick={handleWatchOnYouTube}
                disabled={loading}
              >
                <Play className="w-4 h-4 mr-2 fill-white" />
                {timerRunning || timerDone ? 'Rewatch on YouTube' : 'Watch on YouTube'}
              </Button>

              {/* Timer Status */}
              {timerRunning && (
                <div className="flex items-center justify-center gap-2 py-2 bg-muted/50 rounded-lg">
                  <Clock className="w-4 h-4 text-muted-foreground animate-pulse" />
                  <p className="text-sm font-bold text-muted-foreground">
                    Claim unlocks in {formatTime(timeLeft)}
                  </p>
                </div>
              )}

              {/* Claim Button - locked until timer done */}
              {!timerRunning && !timerDone && (
                <p className="text-xs text-muted-foreground text-center">
                  Watch the video first to unlock the claim button
                </p>
              )}

              {(timerRunning || timerDone) && (
                <Button
                  className="w-full h-10 bg-success hover:bg-success/90 text-white font-bold"
                  onClick={handleClaimReward}
                  disabled={loading || timerRunning}
                >
                  {loading ? (
                    <><span className="animate-spin mr-2">⚙️</span>Claiming...</>
                  ) : timerRunning ? (
                    <><Clock className="w-4 h-4 mr-2" />Wait {formatTime(timeLeft)}...</>
                  ) : (
                    <><CheckCircle2 className="w-4 h-4 mr-2" />Claim GHS {formatAmount(task.reward)}</>
                  )}
                </Button>
              )}
            </>
          ) : (
            <Button disabled className="w-full h-10 bg-muted text-muted-foreground cursor-not-allowed">
              <CheckCircle2 className="w-4 h-4 mr-2 shrink-0" />
              Already Completed
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
}