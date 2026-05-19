import { getLoggedInUserAction } from '@/lib/auth';
import { redirect } from 'next/navigation';
import CreateCampaignForm from '@/components/create-campaign-form';

export default async function CreateCampaignPage() {
  const user = await getLoggedInUserAction();

  if (!user || user.role !== 'creator') {
    redirect('/login');
  }

  return <CreateCampaignForm user={user} />;
}