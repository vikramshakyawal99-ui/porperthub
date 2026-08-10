"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/AuthProvider";

export default function BuyerLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  const { user, role, loading } = useAuth();
  const router = useRouter();


  useEffect(() => {

    if (loading) return;


    if (!user) {

      router.replace("/buyer-login");
      return;

    }


    const allowedRoles = [
      "buyer",
    ];


    if (!role || !allowedRoles.includes(role)) {

      router.replace("/");

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



  if (
    !role ||
    !["buyer"].includes(role)
  ) {

    return null;

  }



  return <>{children}</>;

}
