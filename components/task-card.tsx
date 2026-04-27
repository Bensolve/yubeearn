'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { formatAmount } from '@/lib/utils';
import { completeTaskAction } from '@/lib/actions/tasks';
import Image from 'next/image';
import type { Task } from '@/types';

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
  
  const videoId = getYouTubeId(task.youtubeUrl);
  const thumbnailUrl = getYouTubeThumbnail(videoId);

  const handleWatchOnYouTube = () => {
    window.open(task.youtubeUrl, '_blank');
  };

  const handleClaimReward = async () => {
    setLoading(true);
    try {
      const result = await completeTaskAction(userId, task.id, task.reward);
      
      if (result.success) {
        setWatched(true);
      }
    } catch (error) {
      console.error('[Tasks] Error claiming reward:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={`rounded-lg shadow overflow-hidden ${
        watched ? 'bg-gray-100' : 'bg-white hover:shadow-lg transition'
      }`}
    >
      {/* YouTube Thumbnail Preview */}
      <div className="relative w-full h-48 bg-gray-300">
        <Image
          src={thumbnailUrl}
          alt={task.title}
          fill
          className="object-cover"
        />
        {!watched && (
          <div className="absolute inset-0 bg-black/30 flex items-center justify-center hover:bg-black/40 transition">
            <button
              onClick={handleWatchOnYouTube}
              className="bg-red-600 hover:bg-red-700 text-white rounded-full p-4 transition"
            >
              ▶️ Play Preview
            </button>
          </div>
        )}
        {watched && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <span className="bg-green-600 text-white px-4 py-2 rounded-full font-bold">
              ✓ Completed
            </span>
          </div>
        )}
      </div>

      {/* Card Content */}
      <div className="p-6">
        <div className="mb-4">
          <h3 className="text-xl font-bold text-gray-900">{task.title}</h3>
          <p className="text-gray-600 text-sm">{task.description}</p>
        </div>

        <div className="mb-6 space-y-2 text-sm text-gray-600">
          <p>⏱️ Duration: {task.duration} minutes</p>
          <p>👥 {task.completions} people completed</p>
        </div>

        <div className="bg-green-50 rounded p-3 mb-6 border-l-4 border-green-600">
          <p className="text-gray-600 text-sm mb-1">You'll earn</p>
          <p className="text-2xl font-bold text-green-600">GHS {formatAmount(task.reward)}</p>
        </div>

        <div className="space-y-3">
          {!watched ? (
            <>
              <Button
                className="w-full bg-red-600 hover:bg-red-700"
                onClick={handleWatchOnYouTube}
              >
                🎥 Watch Full Video
              </Button>
              <p className="text-xs text-gray-500 text-center">
                After watching, come back and claim your reward
              </p>
              <Button
                className="w-full"
                onClick={handleClaimReward}
                disabled={loading}
              >
                {loading ? 'Claiming...' : '✓ Claim Reward'}
              </Button>
            </>
          ) : (
            <Button disabled className="w-full">
              ✓ Already Completed
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}