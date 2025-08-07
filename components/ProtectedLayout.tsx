"use client";

import { useAuth } from "@/hooks/useAuth";
import { ReactNode } from "react";

type Props = {
  children: ReactNode;
};

const ProtectedLayout = ({ children }: Props) => {
  const { isLoading } = useAuth();

  if (isLoading) return <p>Loading...</p>;

  return <>{children}</>;
};

export default ProtectedLayout;
