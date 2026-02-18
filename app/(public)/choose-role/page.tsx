'use client';

import Link from 'next/link';

export default function ChooseRole() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-red-600 to-red-700 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-2xl p-8 md:p-12 w-full max-w-2xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-red-600 mb-3">YubeEarn</h1>
          <p className="text-xl text-gray-700">Choose Your Role</p>
          <p className="text-gray-600 mt-2">What would you like to do?</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Earner Option */}
          <Link href="/signup?type=earner">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 border-2 border-blue-300 rounded-lg p-8 cursor-pointer hover:shadow-lg transition h-full">
              <div className="text-6xl mb-4">💰</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">I Want to Earn</h3>
              <p className="text-gray-700 mb-6">Watch videos and earn real money</p>
              <ul className="space-y-2 text-sm text-gray-700 mb-6">
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 font-bold">✓</span>
                  <span>Watch YouTube videos</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 font-bold">✓</span>
                  <span>Earn points instantly</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 font-bold">✓</span>
                  <span>Withdraw to Mobile Money</span>
                </li>
              </ul>
              <button className="w-full bg-blue-600 text-white py-2 rounded font-bold hover:bg-blue-700 transition">
                Get Started →
              </button>
            </div>
          </Link>

          {/* Creator Option */}
          <Link href="/signup?type=creator">
            <div className="bg-gradient-to-br from-green-50 to-green-100 border-2 border-green-300 rounded-lg p-8 cursor-pointer hover:shadow-lg transition h-full">
              <div className="text-6xl mb-4">🎬</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">I&apos;m a Creator</h3>
              <p className="text-gray-700 mb-6">Get viewers for your YouTube channel</p>
              <ul className="space-y-2 text-sm text-gray-700 mb-6">
                <li className="flex items-start gap-2">
                  <span className="text-green-600 font-bold">✓</span>
                  <span>Reach 4,000 watch hours</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 font-bold">✓</span>
                  <span>Get real Ghanaian viewers</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 font-bold">✓</span>
                  <span>Monetize faster</span>
                </li>
              </ul>
              <button className="w-full bg-green-600 text-white py-2 rounded font-bold hover:bg-green-700 transition">
                Get Started →
              </button>
            </div>
          </Link>
        </div>

        <p className="text-center text-gray-600 text-sm mt-8">
          Already have an account? <Link href="/login" className="text-red-600 font-bold hover:underline">Login here</Link>
        </p>
      </div>
    </div>
  );
}