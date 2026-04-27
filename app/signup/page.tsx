import SignupForm from "@/components/auth/SignupForm";

interface SignupPageProps {
  searchParams: { role?: string };
}

export default async function SignupPage({ searchParams }: SignupPageProps) {
  const params = await searchParams;

  const role =
    params.role === "creator" ? "creator" : "earner";

  return <SignupForm role={role} />;
}