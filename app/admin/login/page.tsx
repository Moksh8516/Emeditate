import { LoginForm } from "@/components/LoginForm";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: { callbackUrl?: string | string[] };
}) {
  // No need for await - searchParams is already resolved
  console.log(searchParams);

  // Handle both string and array cases
  const callbackUrl = Array.isArray(searchParams?.callbackUrl)
    ? searchParams.callbackUrl[0] || "/admin/dashboard"
    : searchParams?.callbackUrl || "/admin/dashboard";

  return <LoginForm callbackUrl={callbackUrl} />;
}
