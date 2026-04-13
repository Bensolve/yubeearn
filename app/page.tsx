'use client';

import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="border-b sticky top-0 bg-white/80 backdrop-blur-lg z-50">
        <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="text-2xl font-bold text-red-600">YubeEarn</div>
          <div className="flex gap-4">
            <Link href="/login">
              <Button variant="ghost">Login</Button>
            </Link>
            <Link href="/signup">
              <Button>Sign Up</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-6xl mx-auto px-6 py-20 text-center">
        <h1 className="text-6xl font-bold text-gray-900 mb-4">
          Earn Money Watching Videos
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          Get real viewers for your YouTube videos. Creators pay, earners make money, platform profits.
        </p>
        
        <div className="flex gap-4 justify-center mb-16">
          <Link href="/signup?role=earner">
            <Button size="lg" className="text-lg">Start Earning</Button>
          </Link>
          <Link href="/signup?role=creator">
            <Button size="lg" variant="outline" className="text-lg">Create Campaign</Button>
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-8 py-12 border-y">
          <div>
            <div className="text-4xl font-bold text-green-600">₵1.2M</div>
            <p className="text-gray-600">Paid Out</p>
          </div>
          <div>
            <div className="text-4xl font-bold text-blue-600">50K+</div>
            <p className="text-gray-600">Active Users</p>
          </div>
          <div>
            <div className="text-4xl font-bold text-purple-600">100K+</div>
            <p className="text-gray-600">Videos Watched</p>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="bg-gray-50 py-20">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-4xl font-bold text-center mb-12">How It Works</h2>
          
          <div className="grid md:grid-cols-2 gap-12">
            {/* Earners */}
            <div>
              <h3 className="text-2xl font-bold mb-6 text-green-600">For Earners</h3>
              <div className="space-y-4">
                <div className="flex gap-4">
                  <div className="text-2xl font-bold text-green-600">1</div>
                  <div>
                    <h4 className="font-bold">Sign Up Free</h4>
                    <p className="text-gray-600">Create your account instantly</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="text-2xl font-bold text-green-600">2</div>
                  <div>
                    <h4 className="font-bold">Browse Tasks</h4>
                    <p className="text-gray-600">View available video tasks</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="text-2xl font-bold text-green-600">3</div>
                  <div>
                    <h4 className="font-bold">Earn & Withdraw</h4>
                    <p className="text-gray-600">Get ₵85 per video, withdraw anytime</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Creators */}
            <div>
              <h3 className="text-2xl font-bold mb-6 text-blue-600">For Creators</h3>
              <div className="space-y-4">
                <div className="flex gap-4">
                  <div className="text-2xl font-bold text-blue-600">1</div>
                  <div>
                    <h4 className="font-bold">Buy Points</h4>
                    <p className="text-gray-600">₵100 = 1 real viewer</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="text-2xl font-bold text-blue-600">2</div>
                  <div>
                    <h4 className="font-bold">Create Campaign</h4>
                    <p className="text-gray-600">Link your YouTube video</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="text-2xl font-bold text-blue-600">3</div>
                  <div>
                    <h4 className="font-bold">Get Real Views</h4>
                    <p className="text-gray-600">Reach 4,000 watch hours faster</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-6xl mx-auto px-6 py-20 text-center">
        <h2 className="text-4xl font-bold mb-6">Ready to Start?</h2>
        <p className="text-xl text-gray-600 mb-8">Join thousands earning money on YubeEarn</p>
        <div className="flex gap-4 justify-center">
          <Link href="/signup?role=earner">
            <Button size="lg" className="text-lg">Sign Up as Earner</Button>
          </Link>
          <Link href="/signup?role=creator">
            <Button size="lg" variant="outline" className="text-lg">Sign Up as Creator</Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <p className="text-gray-400">© 2026 YubeEarn. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}