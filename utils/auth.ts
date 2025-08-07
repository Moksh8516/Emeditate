import Cookies from "js-cookie";

export function isAuthenticated(): boolean {
  const token = Cookies.get("accessToken");
  return !!token;
}
