'use client';

import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { useAppContext } from '@/app/context/AppContext';
import { validatePaymentDetails, validatePasswordChange } from '@/lib/validation';
import { savePaymentDetails, changePassword } from '@/lib/storage';

export default function SettingsPage() {
  const { notification, showNotification, currentUser } = useAppContext();
  const [email] = useState(currentUser?.email || '');
  const [bankName, setBankName] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'bank' | 'momo'>('bank');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSavePayment = (e: React.FormEvent) => {
    e.preventDefault();

    const error = validatePaymentDetails(paymentMethod, bankName, accountNumber, phoneNumber);
    if (error) {
      showNotification(error, 'error');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      if (currentUser) {
        savePaymentDetails(currentUser.id, paymentMethod, {
          bankName,
          accountNumber,
          phoneNumber,
        });
      }
      showNotification('✓ Payment details saved!', 'success');
      setLoading(false);
    }, 1000);
  };

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();

    const error = validatePasswordChange(currentPassword, newPassword, confirmPassword);
    if (error) {
      showNotification(error, 'error');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      if (currentUser) {
        const success = changePassword(currentUser.id, currentPassword, newPassword);
        if (success) {
          showNotification('✓ Password changed successfully!', 'success');
          setCurrentPassword('');
          setNewPassword('');
          setConfirmPassword('');
        } else {
          showNotification('Current password is incorrect', 'error');
        }
      }
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-6 py-8">

        {notification && (
          <div className={`fixed top-4 right-4 max-w-md p-4 rounded-lg border-l-4 shadow-lg z-50 ${
            notification.type === 'success'
              ? 'bg-green-100 border-green-600 text-green-800'
              : notification.type === 'error'
              ? 'bg-red-100 border-red-600 text-red-800'
              : 'bg-blue-100 border-blue-600 text-blue-800'
          }`}>
            <p className="font-bold">{notification.message}</p>
          </div>
        )}

        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Settings</h1>
          <p className="text-gray-600">Manage your account and payment details</p>
        </div>

        {/* Account Settings */}
        <div className="bg-white rounded-lg shadow p-8 mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Account Settings</h2>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Email Address</label>
            <input
              type="email"
              value={email}
              disabled
              className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100 cursor-not-allowed"
            />
            <p className="text-xs text-gray-500 mt-2">This is your login email. Cannot be changed here.</p>
          </div>
        </div>

        {/* Change Password */}
        <div className="bg-white rounded-lg shadow p-8 mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Change Password</h2>
          <form className="space-y-4" onSubmit={handleChangePassword}>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Current Password</label>
              <input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">New Password</label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Confirm New Password</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600"
              />
            </div>
            <Button type="submit" className="text-lg py-6" disabled={loading}>
              {loading ? 'Updating...' : 'Update Password'}
            </Button>
          </form>
        </div>

        {/* Payment Settings */}
        <div className="bg-white rounded-lg shadow p-8 mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Payment Details</h2>
          <form className="space-y-6" onSubmit={handleSavePayment}>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-3">Preferred Withdrawal Method</label>
              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('bank')}
                  className={`flex-1 p-4 rounded-lg border-2 font-bold transition ${
                    paymentMethod === 'bank'
                      ? 'border-red-600 bg-red-50 text-red-600'
                      : 'border-gray-300 text-gray-700'
                  }`}
                >
                  🏦 Bank Account
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentMethod('momo')}
                  className={`flex-1 p-4 rounded-lg border-2 font-bold transition ${
                    paymentMethod === 'momo'
                      ? 'border-red-600 bg-red-50 text-red-600'
                      : 'border-gray-300 text-gray-700'
                  }`}
                >
                  📱 Mobile Money
                </button>
              </div>
            </div>

            {paymentMethod === 'bank' && (
              <div className="space-y-4 bg-gray-50 p-4 rounded-lg">
                <h3 className="font-bold text-gray-900">Bank Account Details</h3>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Bank Name</label>
                  <input
                    type="text"
                    value={bankName}
                    onChange={(e) => setBankName(e.target.value)}
                    placeholder="e.g., Zenith Bank"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Account Number</label>
                  <input
                    type="text"
                    value={accountNumber}
                    onChange={(e) => setAccountNumber(e.target.value)}
                    placeholder="Your account number"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600"
                  />
                </div>
              </div>
            )}

            {paymentMethod === 'momo' && (
              <div className="space-y-4 bg-gray-50 p-4 rounded-lg">
                <h3 className="font-bold text-gray-900">Mobile Money Details</h3>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Phone Number</label>
                  <input
                    type="tel"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder="0541234567"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600"
                  />
                </div>
              </div>
            )}

            <Button type="submit" className="text-lg py-6" disabled={loading}>
              {loading ? 'Saving...' : 'Save Payment Details'}
            </Button>
          </form>
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