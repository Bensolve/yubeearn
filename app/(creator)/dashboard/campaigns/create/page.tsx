'use client';

import { useState, useEffect } from 'react';
import { auth, db } from '@/lib/firebase';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { doc, getDoc } from 'firebase/firestore';
import type { User } from '@/types';

export default function CreateCampaign() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [formLoading, setFormLoading] = useState(true);
  const [error, setError] = useState('');
  const router = useRouter();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    videoUrl: '',
    targetWatchHours: '500',
    price: '29',
  });

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (currentUser) => {
      if (!currentUser) {
        router.push('/login');
      } else {
        // Get userType from Firestore
        const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
        const userData = userDoc.data();

        setUser({
          email: currentUser.email || '',
          uid: currentUser.uid,
          userType: (userData?.userType as 'earner' | 'creator') || 'earner',
        });

        // Redirect if not a creator
        if (userData?.userType !== 'creator') {
          router.push('/dashboard');
        }
      }
      setFormLoading(false);
    });

    return () => unsubscribe();
  }, [router]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!user) {
      setError('User not found');
      setLoading(false);
      return;
    }

    // Validate form
    if (!formData.title.trim()) {
      setError('Campaign title is required');
      setLoading(false);
      return;
    }

    if (!formData.videoUrl.trim()) {
      setError('YouTube URL is required');
      setLoading(false);
      return;
    }

    if (!formData.videoUrl.includes('youtube.com') && !formData.videoUrl.includes('youtu.be')) {
      setError('Please enter a valid YouTube URL');
      setLoading(false);
      return;
    }

    try {
      // Call API to create campaign
      const response = await fetch('/api/campaigns/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          creatorId: user.uid,
          title: formData.title,
          description: formData.description,
          videoUrl: formData.videoUrl,
          targetWatchHours: parseInt(formData.targetWatchHours),
          price: parseInt(formData.price),
        }),
      });

      const data = await response.json();

      if (data.success) {
        alert(`Campaign created! Now redirecting to payment...`);
        // Redirect to payment page with campaign ID
        router.push(`/dashboard/creator/campaigns/${data.campaignId}/pay`);
      } else {
        setError(data.error || 'Failed to create campaign');
      }
    } catch (err) {
      setError('Error creating campaign: ' + err);
    } finally {
      setLoading(false);
    }
  };

  if (formLoading) {
    return <div className="text-center mt-20 text-2xl">Loading...</div>;
  }

  return (
    <div className="p-4 md:p-6 max-w-2xl mx-auto">
      <Link href="/dashboard/creator/campaigns" className="text-red-600 font-bold hover:underline mb-4 inline-block">
        ← Back to Campaigns
      </Link>

      <div className="bg-white rounded-lg shadow-lg p-6 md:p-8">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">Create Campaign</h2>
        <p className="text-gray-600 mb-8">Get real Ghanaian viewers for your YouTube videos</p>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Campaign Title */}
          <div>
            <label className="block text-gray-900 font-semibold mb-2">Campaign Title *</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g., Get 1000 Watch Hours"
              className="w-full px-4 py-3 border-2 border-gray-300 rounded text-gray-900 focus:outline-none focus:border-red-600"
              required
            />
            <p className="text-gray-600 text-sm mt-1">Give your campaign a clear name</p>
          </div>

          {/* Description */}
          <div>
            <label className="block text-gray-900 font-semibold mb-2">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Tell viewers what this video is about..."
              rows={4}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded text-gray-900 focus:outline-none focus:border-red-600"
            />
            <p className="text-gray-600 text-sm mt-1">Optional - helps with context</p>
          </div>

          {/* YouTube URL */}
          <div>
            <label className="block text-gray-900 font-semibold mb-2">YouTube Video URL *</label>
            <input
              type="url"
              name="videoUrl"
              value={formData.videoUrl}
              onChange={handleChange}
              placeholder="https://www.youtube.com/watch?v=..."
              className="w-full px-4 py-3 border-2 border-gray-300 rounded text-gray-900 focus:outline-none focus:border-red-600"
              required
            />
            <p className="text-gray-600 text-sm mt-1">Link to your YouTube video</p>
          </div>

          {/* Target Watch Hours */}
          <div>
            <label className="block text-gray-900 font-semibold mb-2">Target Watch Hours *</label>
            <select
              name="targetWatchHours"
              value={formData.targetWatchHours}
              onChange={handleChange}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded text-gray-900 focus:outline-none focus:border-red-600"
              required
            >
              <option value="500">500 hours - GHS 29</option>
              <option value="1000">1,000 hours - GHS 49</option>
              <option value="2000">2,000 hours - GHS 99</option>
            </select>
            <p className="text-gray-600 text-sm mt-1">How many watch hours do you need?</p>
          </div>

          {/* Price Display */}
          <div className="bg-blue-50 border-2 border-blue-300 p-4 rounded">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-gray-900 font-semibold">Campaign Cost</p>
                <p className="text-gray-600 text-sm">{formData.targetWatchHours} hours</p>
              </div>
              <div className="text-right">
                <p className="text-3xl font-bold text-blue-600">GHS {formData.price}</p>
                <p className="text-gray-600 text-sm">You will be charged this amount</p>
              </div>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-100 border-l-4 border-red-600 text-red-800 p-4 rounded">
              <p className="font-bold">Error:</p>
              <p className="text-sm">{error}</p>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-red-600 text-white py-3 rounded font-bold hover:bg-red-700 disabled:bg-gray-400 text-lg transition"
          >
            {loading ? 'Creating Campaign...' : '🚀 Create Campaign & Pay'}
          </button>

          <p className="text-center text-gray-600 text-sm">
            By creating a campaign, you agree to our Terms & Conditions
          </p>
        </form>
      </div>
    </div>
  );
}