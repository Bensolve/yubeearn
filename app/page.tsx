import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-red-600">
      {/* Navbar */}
      <nav className="bg-red-700 text-white p-4 shadow-lg">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <h1 className="text-3xl font-bold">▶️ YubeEarn</h1>
          <div className="flex gap-4">
            <Link href="/login" className="bg-white text-red-600 px-4 py-2 rounded font-bold hover:bg-gray-100">
              Login
            </Link>
            <Link href="/signup" className="bg-transparent border-2 border-white text-white px-4 py-2 rounded font-bold hover:bg-white hover:text-red-600">
              Sign Up
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto p-6 text-center text-white py-20">
        <h2 className="text-5xl font-bold mb-6">Earn Money Watching YouTube</h2>
        <p className="text-2xl mb-8 opacity-90">Watch videos. Earn points. Get paid real money.</p>
        
        <div className="flex gap-4 justify-center mb-20">
          <Link href="/signup?type=user">
            <button className="bg-white text-red-600 px-8 py-4 rounded font-bold text-lg hover:bg-gray-100">
              Start Earning
            </button>
          </Link>
          <Link href="/signup?type=creator">
            <button className="bg-transparent border-2 border-white text-white px-8 py-4 rounded font-bold text-lg hover:bg-white hover:text-red-600">
              Become Creator
            </button>
          </Link>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-8 mb-20">
          <div className="bg-white text-gray-900 p-8 rounded-lg shadow-lg">
            <div className="text-5xl mb-4">🎥</div>
            <h3 className="text-2xl font-bold mb-2 text-gray-900">Watch Videos</h3>
            <p className="text-gray-800">Simple YouTube video tasks</p>
          </div>
          <div className="bg-white text-gray-900 p-8 rounded-lg shadow-lg">
            <div className="text-5xl mb-4">💰</div>
            <h3 className="text-2xl font-bold mb-2 text-gray-900">Earn Points</h3>
            <p className="text-gray-800">Get instant rewards</p>
          </div>
          <div className="bg-white text-gray-900 p-8 rounded-lg shadow-lg">
            <div className="text-5xl mb-4">💸</div>
            <h3 className="text-2xl font-bold mb-2 text-gray-900">Withdraw Cash</h3>
            <p className="text-gray-800">Real money via Paystack</p>
          </div>
        </div>
      </div>
    </div>
  );
}