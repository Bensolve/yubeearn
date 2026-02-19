import SignupForm from '@/components/SignupForm';

interface SignupPageProps {
  searchParams: Promise<{ type?: 'creator' | 'earner' }>;
}

export default async function SignupPage({ searchParams }: SignupPageProps) {
  // Await the searchParams promise (Next.js 15+)
  const params = await searchParams;
  const initialRole = params.type;

  return <SignupForm initialRole={initialRole} />;
}