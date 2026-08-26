"use client";

import { useRouter } from "next/navigation";
import { useAuth } from "@/components/AuthProvider";

type Props = {
  propertyTitle: string;
};

export default function WhatsAppButton({
  propertyTitle,
}: Props) {
  const { user } = useAuth();
  const router = useRouter();

  function openWhatsApp() {
    if (!user) {
      const returnPath =
        window.location.pathname +
        window.location.search;

      router.push(
        `/buyer-login?redirect=${encodeURIComponent(
          returnPath
        )}`
      );

      return;
    }

    const message = encodeURIComponent(
      `Hello, I am interested in ${propertyTitle}`
    );

    window.open(
      `https://wa.me/?text=${message}`,
      "_blank",
      "noopener,noreferrer"
    );
  }

  return (
    <button
      type="button"
      onClick={openWhatsApp}
      className="rounded-xl bg-[#16A34A] px-6 py-3 font-bold text-white transition hover:bg-[#15803D]"
    >
      💬 WhatsApp Enquiry
    </button>
  );
}
