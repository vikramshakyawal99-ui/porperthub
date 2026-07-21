"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/AuthProvider";

const ADMIN_EMAIL = "vikramshakyawal99@gmail.com";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/admin-login");
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        Loading...
      </div>
    );
  }

  if (!user) return null;

  if (user.email !== ADMIN_EMAIL) {
    router.replace("/admin-login");
    return (
      <div className="flex min-h-screen items-center justify-center">
        Unauthorized
      </div>
    );
  }

  return <>{children}</>;
}
