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
    if (loading) return;

    if (!user) {
      router.replace(
        "/buyer-login?redirect=" +
          encodeURIComponent(window.location.pathname)
      );
      return;
    }

    const allowedRoles = [
          "buyer",
"property_owner",
      "hostel_owner",
      "pg_owner",
      "room_owner",
      "resale_seller",
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

  if (!user) {
    return null;
  }

  const allowedRoles = [
        "buyer",
"property_owner",
    "hostel_owner",
    "pg_owner",
    "room_owner",
    "resale_seller",
  ];

  if (!role || !allowedRoles.includes(role)) {
    return null;
  }

  return <>{children}</>;
}
