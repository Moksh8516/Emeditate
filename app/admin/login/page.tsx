import { LoginForm } from "@/components/LoginForm";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ callbackUrl?: string | string[] }>;
}) {
  const params = await searchParams;
  const callbackUrl = (params?.callbackUrl as string) || "/admin/dashboard";

  return <LoginForm callbackUrl={callbackUrl} />;
}
