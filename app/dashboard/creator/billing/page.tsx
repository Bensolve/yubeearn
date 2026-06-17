import { getLoggedInUserAction } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { CreditCard } from 'lucide-react';
import BillingForm from '@/components/creator/billing-form';

export default async function BillingPage() {
  const user = await getLoggedInUserAction();

  if (!user || user.role !== 'creator') {
    redirect('/login');
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-2xl mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2 flex items-center gap-2">
            <CreditCard className="w-8 h-8 text-trust" />
            Billing
          </h1>
          <p className="text-muted-foreground">
            Top up your balance to create campaigns
          </p>
        </div>
        <BillingForm user={user} />
      </div>
    </div>
  );
}