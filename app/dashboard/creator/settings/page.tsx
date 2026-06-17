import { getLoggedInUserAction } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Shield, Mail, Lock, AlertTriangle, HelpCircle, Trash2 } from 'lucide-react';

export default async function CreatorSettingsPage() {
  const user = await getLoggedInUserAction();

  if (!user || user.role !== 'creator') {
    redirect('/login');
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-2xl mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2 flex items-center gap-2">
            <Shield className="w-8 h-8 text-trust" />
            Settings
          </h1>
          <p className="text-muted-foreground">Manage your creator account</p>
        </div>

        {/* Account Info */}
        <Card className="bg-card border-border p-8 mb-6 hover:border-trust/50 transition">
          <div className="flex items-start justify-between mb-6">
            <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
              <Shield className="w-5 h-5 text-trust" />
              Account Settings
            </h2>
            <Badge className="bg-earn/20 text-earn shrink-0">Verified</Badge>
          </div>

          <div className="space-y-6">
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
                Contact support to change your email
              </p>
            </div>

            <div className="border-t border-border pt-4">
              <label className="block text-sm font-bold text-foreground mb-2 flex items-center gap-2">
                <Lock className="w-4 h-4 text-muted-foreground" />
                Account Role
              </label>
              <Badge className="bg-trust/20 text-trust border-trust/30">
                🎬 Creator
              </Badge>
            </div>
          </div>
        </Card>

        {/* Help */}
        <Card className="bg-card border-border p-6 mb-6 hover:border-trust/50 transition">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 bg-trust/10 rounded-lg flex items-center justify-center shrink-0">
              <HelpCircle className="w-5 h-5 text-trust" />
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-foreground mb-2">Need Help?</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Questions about campaigns, billing, or your account? Contact us.
              </p>
              <Button variant="outline" className="border-trust text-trust hover:bg-trust/5 font-bold">
                <HelpCircle className="w-4 h-4 mr-2" />
                Contact Support
              </Button>
            </div>
          </div>
        </Card>

        {/* Danger Zone */}
        <Card className="bg-caution/5 border-2 border-caution/30 p-8">
          <div className="flex items-start gap-4">
            <AlertTriangle className="w-6 h-6 text-caution shrink-0 mt-1" />
            <div className="flex-1">
              <h2 className="text-xl font-bold text-caution mb-4">Danger Zone</h2>
              <p className="text-sm text-muted-foreground mb-4">
                Permanently delete your account. All campaigns and data will be lost. This cannot be undone.
              </p>
              <Button variant="outline" className="border-caution text-caution hover:bg-caution/5 font-bold">
                <Trash2 className="w-4 h-4 mr-2" />
                Delete Account
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}