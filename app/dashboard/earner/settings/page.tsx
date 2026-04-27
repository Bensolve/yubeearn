import { getLoggedInUserAction } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { Button } from '@/components/ui/button';

export default async function SettingsPage() {
  const user = await getLoggedInUserAction();

  if (!user) {
    redirect('/login');
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Settings</h1>
          <p className="text-gray-600">Manage your account</p>
        </div>

        {/* Account Settings */}
        <div className="bg-white rounded-lg shadow p-8 mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Account Settings</h2>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Email Address</label>
            <input
              type="email"
              value={user.email}
              disabled
              className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100 cursor-not-allowed"
            />
            <p className="text-xs text-gray-500 mt-2">This is your login email. Cannot be changed here.</p>
          </div>
        </div>

        {/* Info */}
        <div className="bg-blue-50 border-l-4 border-blue-600 p-6 rounded-lg mb-6">
          <h3 className="font-bold text-blue-900 mb-2">💳 Payment Methods</h3>
          <p className="text-sm text-blue-800">
            You&apos;ll select your bank or mobile money when you withdraw. No need to save it here.
          </p>
        </div>

        {/* Danger Zone */}
        <div className="bg-red-50 border-2 border-red-200 rounded-lg p-8">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Danger Zone</h2>
          <div>
            <h3 className="font-bold text-gray-900 mb-2">Delete Account</h3>
            <p className="text-gray-600 mb-4">
              Permanently delete your account and all associated data. This action cannot be undone.
            </p>
            <Button variant="outline" className="border-red-600 text-red-600 hover:bg-red-50">
              Delete Account
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}