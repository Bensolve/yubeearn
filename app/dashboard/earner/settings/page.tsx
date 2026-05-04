import { getLoggedInUserAction } from '@/lib/auth';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { redirect } from 'next/navigation';
import { Mail, Shield, AlertTriangle, Lock, HelpCircle, CreditCard, Trash2 } from 'lucide-react';

export default async function SettingsPage() {
  const user = await getLoggedInUserAction();

  if (!user) {
    redirect('/login');
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2 flex items-center gap-2">
            <Shield className="w-8 h-8 text-primary" />
            Settings
          </h1>
          <p className="text-muted-foreground">Manage your account and preferences</p>
        </div>

        {/* Account Settings - PRIMARY */}
        <Card className="bg-card border-border p-8 mb-6 hover:border-primary/50 transition">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
                <Shield className="w-6 h-6 text-primary" />
                Account Settings
              </h2>
            </div>
            {/* SUCCESS: Verified badge (green) */}
            <Badge className="bg-success/20 text-success border-success/30 shrink-0">Verified</Badge>
          </div>

          <div className="space-y-6">
            {/* Email Field */}
            <div>
              <label className="block text-sm font-bold text-foreground mb-2 flex items-center gap-2">
                <Mail className="w-4 h-4 text-muted-foreground" />
                Email Address
              </label>
              <Input
                type="email"
                value={user.email}
                disabled
                className="h-10 bg-muted text-muted-foreground border-border cursor-not-allowed"
              />
              <p className="text-xs text-muted-foreground mt-2">
                This is your login email and cannot be changed here. Contact support if you need to update it.
              </p>
            </div>

            {/* Divider */}
            <div className="border-t border-border" />

            {/* Account Role Field */}
            <div>
              <label className="block text-sm font-bold text-foreground mb-2 flex items-center gap-2">
                <Lock className="w-4 h-4 text-muted-foreground" />
                Account Role
              </label>
              <div className="flex items-center gap-3">
                {/* PRIMARY: Role badge (red) */}
                <Badge className="bg-primary/20 text-primary border-primary/30 capitalize shrink-0">
                  {user.role === 'creator' ? '🎬 Creator' : user.role === 'earner' ? '💰 Earner' : '⚙️ Admin'}
                </Badge>
                <p className="text-sm text-muted-foreground">
                  {user.role === 'earner'
                    ? 'You are earning money by completing tasks'
                    : user.role === 'creator'
                    ? 'You are creating campaigns to reach viewers'
                    : 'You have administrative access'}
                </p>
              </div>
            </div>
          </div>
        </Card>

        {/* Payment Information - INFO (Blue) */}
        <Card className="bg-blue-50/50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900/50 p-6 mb-6">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 bg-blue-600/10 rounded-lg flex items-center justify-center flex-shrink-0">
              <CreditCard className="w-5 h-5 text-blue-600" />
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-foreground mb-1 flex items-center gap-2">
                <span>💳 Payment Methods</span>
              </h3>
              <p className="text-sm text-muted-foreground">
                You&apos;ll select your bank account or mobile money when you withdraw funds. There&apos;s no need to save payment details here—you can choose your preferred method at withdrawal time for added security.
              </p>
            </div>
          </div>
        </Card>

        {/* Danger Zone - WARNING (Red) */}
        <Card className="bg-red-50/50 dark:bg-red-950/20 border-2 border-red-200 dark:border-red-900/50 p-8 mb-6">
          <div className="flex items-start gap-4">
            <AlertTriangle className="w-6 h-6 text-red-600 flex-shrink-0 mt-1" />
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-red-600 mb-4">Danger Zone</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="font-bold text-foreground mb-2">Delete Account</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Permanently delete your YubeEarn account and all associated data. This action cannot be undone and you will lose access to all your earnings history and account information.
                  </p>
                  {/* WARNING: Delete button (red) */}
                  <Button
                    variant="outline"
                    className="border-red-600 text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 font-bold transition"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete Account
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Help & Support - PRIMARY */}
        <Card className="bg-card border-border p-6 hover:border-primary/50 transition">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
              <HelpCircle className="w-5 h-5 text-primary" />
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-foreground mb-2">Need Help?</h3>
              <p className="text-sm text-muted-foreground mb-4">
                If you have questions about your account or need assistance, please contact our support team.
              </p>
              {/* PRIMARY: Support CTA button */}
              <Button 
                variant="outline" 
                className="border-primary text-primary hover:bg-primary/5 font-bold transition"
              >
                <HelpCircle className="w-4 h-4 mr-2" />
                Contact Support
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}