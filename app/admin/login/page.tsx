import { LoginForm } from "@/components/LoginForm";

interface LoginPageProps {
  searchParams?: {
    callbackUrl?: string | string[];
  };
}

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const params = await searchParams;
  const callbackUrl = (params?.callbackUrl as string) || "/admin/dashboard";

  return <LoginForm callbackUrl={callbackUrl} />;
}
