import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-red-600">
      {/* Navbar */}
      <nav className="bg-red-700 text-white p-4 shadow-lg">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <h1 className="text-2xl md:text-3xl font-bold">▶️ YubeEarn</h1>
          <div className="flex gap-2 md:gap-4">
            <Link href="/login" className="bg-white text-red-600 px-3 md:px-4 py-2 rounded font-bold text-sm md:text-base hover:bg-gray-100">
              Login
            </Link>
            <Link href="/signup" className="bg-transparent border-2 border-white text-white px-3 md:px-4 py-2 rounded font-bold text-sm md:text-base hover:bg-white hover:text-red-600">
              Sign Up
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto p-4 md:p-6 text-center text-white py-10 md:py-20">
        <h2 className="text-3xl md:text-5xl font-bold mb-4 md:mb-6">Earn Money Watching YouTube</h2>
        <p className="text-lg md:text-2xl mb-8 md:mb-8 opacity-90">Watch videos. Earn points. Get paid real money.</p>
        
        <div className="flex flex-col md:flex-row gap-4 justify-center mb-12 md:mb-20">
          <Link href="/signup?type=user">
            <button className="w-full md:w-auto bg-white text-red-600 px-6 md:px-8 py-3 md:py-4 rounded font-bold text-base md:text-lg hover:bg-gray-100 transition">
              Start Earning
            </button>
          </Link>
          <Link href="/signup?type=creator">
            <button className="w-full md:w-auto bg-transparent border-2 border-white text-white px-6 md:px-8 py-3 md:py-4 rounded font-bold text-base md:text-lg hover:bg-white hover:text-red-600 transition">
              Become Creator
            </button>
          </Link>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-4 md:gap-8">
          <div className="bg-white bg-opacity-10 p-6 md:p-8 rounded-lg backdrop-blur">
            <div className="text-4xl md:text-5xl mb-4">🎥</div>
            <h3 className="text-lg md:text-2xl font-bold mb-2">Watch Videos</h3>
            <p className="text-sm md:text-base">Simple YouTube video tasks</p>
          </div>
          <div className="bg-white bg-opacity-10 p-6 md:p-8 rounded-lg backdrop-blur">
            <div className="text-4xl md:text-5xl mb-4">💰</div>
            <h3 className="text-lg md:text-2xl font-bold mb-2">Earn Points</h3>
            <p className="text-sm md:text-base">Get instant rewards</p>
          </div>
          <div className="bg-white bg-opacity-10 p-6 md:p-8 rounded-lg backdrop-blur">
            <div className="text-4xl md:text-5xl mb-4">💸</div>
            <h3 className="text-lg md:text-2xl font-bold mb-2">Withdraw Cash</h3>
            <p className="text-sm md:text-base">Real money via Paystack</p>
          </div>
        </div>
      </div>
    </div>
  );
}