"use client";

type Props = {
  propertyTitle: string;
};

export default function WhatsAppButton({
  propertyTitle,
}: Props) {

  const message = encodeURIComponent(
    `Hello, I am interested in ${propertyTitle}`
  );

  const whatsappUrl =
    `https://wa.me/?text=${message}`;

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      className="rounded-xl bg-green-600 px-6 py-3 font-bold text-white hover:bg-green-700"
    >
      💬 WhatsApp Enquiry
    </a>
  );
}
