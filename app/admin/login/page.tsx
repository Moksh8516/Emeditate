import { LoginForm } from "@/components/LoginForm";

export default async function LoginPage({
  searchParams,
}: {
  searchParams?: { callbackUrl?: string | string[] };
}) {
  // Resolve searchParams if it's a promise (defensive approach)
  const params =
    searchParams && typeof searchParams === "object" ? searchParams : {};

  console.log(params);

  // Handle both string and array cases
  const callbackUrl = Array.isArray(params?.callbackUrl)
    ? params.callbackUrl[0] || "/admin/dashboard"
    : params?.callbackUrl || "/admin/dashboard";

  return <LoginForm callbackUrl={callbackUrl} />;
}
