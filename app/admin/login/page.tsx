import { LoginForm } from "@/components/LoginForm";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ callbackUrl?: string | string[] }>;
}) {
  // Handle both Promise and resolved object cases
  const params = await Promise.resolve(searchParams);
  // console.log(params);

  // Handle both string and array cases
  const callbackUrl = Array.isArray(params?.callbackUrl)
    ? params.callbackUrl[0] || "/admin/dashboard"
    : params?.callbackUrl || "/admin/dashboard";

  return <LoginForm callbackUrl={callbackUrl} />;
}
