"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/AuthProvider";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  const { user, role, loading } = useAuth();
  const router = useRouter();


  useEffect(() => {

    if (!loading) {

      if (!user) {

        router.replace("/control-x9p-admin-8472");

      }

      else if (role !== "admin") {

        router.replace("/");

      }

    }

  }, [user, role, loading, router]);



  if (loading) {

    return (
      <div className="flex min-h-screen items-center justify-center">
        Loading...
      </div>
    );

  }


  if (!user) return null;


  if (role !== "admin") {

    return (
      <div className="flex min-h-screen items-center justify-center">
        Unauthorized
      </div>
    );

  }


  return (
    <>
      {children}
    </>
  );

}
