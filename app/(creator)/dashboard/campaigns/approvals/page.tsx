'use client';

import { useState, useEffect } from 'react';
import { auth, db } from '@/lib/firebase';
import { useRouter } from 'next/navigation';
import { collection, query, where, getDocs, updateDoc, doc, Timestamp } from 'firebase/firestore';
import Link from 'next/link';
import type { User } from '@/types';


interface Completion {
  id: string;
  userId: string;
  taskId: string;
  campaignId: string;
  watchedSeconds: number;
  pointsEarned: number;
  status: 'pending' | 'approved' | 'rejected';
  completedAt: Timestamp;
}

export default function CreatorApprovals() {
  const [user, setUser] = useState<User | null>(null);
  const [completions, setCompletions] = useState<Completion[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (currentUser) => {
      if (!currentUser) {
        router.push('/(public)/login');
        setLoading(false);
        return;
      }

      setUser({
        email: currentUser.email || '',
        uid: currentUser.uid,
        userType: 'creator',
      });

      // Fetch pending completions for this creator
      await fetchPendingCompletions(currentUser.uid);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [router]);

  const fetchPendingCompletions = async (creatorId: string) => {
    try {
      const q = query(
        collection(db, 'completions'),
        where('creatorId', '==', creatorId),
        where('status', '==', 'pending')
      );

      const snapshot = await getDocs(q);
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      } as Completion));

      setCompletions(data);
    } catch (error) {
      console.error('Error fetching completions:', error);
    }
  };

  const handleApprove = async (completionId: string, pointsEarned: number, userId: string) => {
    setActionLoading(completionId);

    try {
      // Update completion status
      await updateDoc(doc(db, 'completions', completionId), {
        status: 'approved',
        approvedAt: Timestamp.now(),
      });

      // Add points to user balance
      const userRef = doc(db, 'users', userId);
      const userDoc = await getDocs(query(collection(db, 'users'), where('__name__', '==', userId)));

      // Fetch current balance
      const currentUser = userDoc.docs[0]?.data();
      const currentBalance = currentUser?.balance || 0;

      await updateDoc(userRef, {
        balance: currentBalance + pointsEarned,
      });

      // Remove from pending list
      setCompletions(completions.filter((c) => c.id !== completionId));

      alert('✅ Completion approved! Points sent to user.');
    } catch (error) {
      alert('❌ Error approving: ' + error);
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = async (completionId: string) => {
    setActionLoading(completionId);

    try {
      // Update completion status
      await updateDoc(doc(db, 'completions', completionId), {
        status: 'rejected',
        approvedAt: Timestamp.now(),
      });

      // Remove from pending list
      setCompletions(completions.filter((c) => c.id !== completionId));

      alert('❌ Completion rejected.');
    } catch (error) {
      alert('Error rejecting: ' + error);
    } finally {
      setActionLoading(null);
    }
  };

  if (loading) {
    return <div className="text-center mt-20 text-2xl">Loading...</div>;
  }

  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Pending Approvals</h2>
        <Link href="/(creator)/dashboard/campaigns">
          <button className="text-red-600 font-bold hover:underline">
            ← Back to Campaigns
          </button>
        </Link>
      </div>

      {completions.length === 0 ? (
        <div className="bg-white rounded-lg shadow-lg p-12 text-center">
          <p className="text-gray-600 text-lg mb-4">✅ No pending approvals</p>
          <p className="text-gray-500">All completions have been reviewed</p>
        </div>
      ) : (
        <div className="space-y-4">
          {completions.map((completion) => (
            <div
              key={completion.id}
              className="bg-white rounded-lg shadow-md p-6 border-l-4 border-yellow-500"
            >
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="inline-block bg-yellow-100 text-yellow-800 px-3 py-1 rounded font-bold text-sm">
                      ⏳ Pending
                    </span>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                    <div>
                      <p className="text-gray-600 text-sm">User ID</p>
                      <p className="font-bold text-gray-900 truncate">{completion.userId.slice(0, 8)}...</p>
                    </div>

                    <div>
                      <p className="text-gray-600 text-sm">Campaign ID</p>
                      <p className="font-bold text-gray-900 truncate">{completion.campaignId.slice(0, 8)}...</p>
                    </div>

                    <div>
                      <p className="text-gray-600 text-sm">Watch Time</p>
                      <p className="font-bold text-gray-900">
                        {Math.floor(completion.watchedSeconds / 60)} min
                      </p>
                    </div>

                    <div>
                      <p className="text-gray-600 text-sm">Points to Give</p>
                      <p className="font-bold text-green-600 text-lg">+{completion.pointsEarned}</p>
                    </div>
                  </div>

                  <p className="text-gray-600 text-sm mt-3">
                    Completed: {new Date(completion.completedAt?.toDate?.() || completion.completedAt).toLocaleDateString()}
                  </p>
                </div>

                <div className="flex gap-2 w-full md:w-auto">
                  <button
                    onClick={() =>
                      handleApprove(completion.id, completion.pointsEarned, completion.userId)
                    }
                    disabled={actionLoading === completion.id}
                    className="flex-1 md:flex-none bg-green-600 text-white px-6 py-2 rounded font-bold hover:bg-green-700 disabled:bg-gray-400 transition"
                  >
                    {actionLoading === completion.id ? '...' : '✓ Approve'}
                  </button>

                  <button
                    onClick={() => handleReject(completion.id)}
                    disabled={actionLoading === completion.id}
                    className="flex-1 md:flex-none bg-red-600 text-white px-6 py-2 rounded font-bold hover:bg-red-700 disabled:bg-gray-400 transition"
                  >
                    {actionLoading === completion.id ? '...' : '✕ Reject'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}