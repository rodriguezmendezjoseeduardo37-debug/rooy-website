"use client";

import Link from "next/link";
import { FaWhatsapp } from "react-icons/fa";

export default function WhatsappButton() {
  const phone = "522228732164"; // tu número
  const message = encodeURIComponent(
    "Hola, me interesa un producto de ROOY"
  );

  return (
    <Link
      href={`https://wa.me/${phone}?text=${message}`}
      target="_blank"
      className="fixed bottom-6 right-6 z-50 flex items-center justify-center w-14 h-14 rounded-full bg-black text-white hover:scale-110 transition"
    >
      <FaWhatsapp size={28} />
    </Link>
  );
}
