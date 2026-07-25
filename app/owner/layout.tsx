"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/AuthProvider";

export default function OwnerLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  const { user, role, loading } = useAuth();
  const router = useRouter();


  useEffect(() => {

    if (!loading) {

      if (!user) {
        router.replace("/login");
      }

      else if (
        role !== "property_owner" &&
        role !== "hostel_owner" &&
        role !== "pg_owner" &&
        role !== "room_owner" &&
        role !== "resale_seller"
      ) {
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


  return (
    <>
      {children}
    </>
  );

}
