"use client";

import { signIn } from "next-auth/react";
import { FaGoogle, FaApple } from "react-icons/fa";
import Link from "next/link";
import { useTheme } from "@/context/ThemeContext";

export default function LoginPage() {
  const { dark } = useTheme();

  return (
    <main className="min-h-[80vh] flex flex-col items-center justify-center px-6 transition-colors duration-500">
      
      {/* TARJETA DE LOGIN */}
      <div className={`w-full max-w-md p-8 border ${dark ? 'border-neutral-800' : 'border-neutral-200'} text-center`}>
        
        {/* LOGO */}
        <h1 className="text-3xl uppercase tracking-[0.4em] font-bold mb-2">
          ROOY
        </h1>
        <p className="text-xs uppercase tracking-widest text-neutral-500 mb-12">
          Member Access
        </p>

        {/* BOTONES */}
        <div className="space-y-4">
          
          {/* GOOGLE */}
          <button
            onClick={() => signIn("google", { callbackUrl: "/" })}
            className={`w-full flex items-center justify-center gap-4 py-4 border transition-all duration-300
              ${dark 
                ? 'bg-white text-black hover:bg-neutral-200 border-transparent' 
                : 'bg-black text-white hover:bg-neutral-800 border-transparent'
              }`}
          >
            <FaGoogle size={20} />
            <span className="uppercase tracking-widest text-sm font-bold">
              Google
            </span>
          </button>

          {/* APPLE */}
          <button
            onClick={() => signIn("apple", { callbackUrl: "/" })}
            className={`w-full flex items-center justify-center gap-4 py-4 border transition-all duration-300
              ${dark 
                ? 'bg-black text-white border-neutral-700 hover:border-white' 
                : 'bg-white text-black border-neutral-300 hover:border-black'
              }`}
          >
            <FaApple size={22} />
            <span className="uppercase tracking-widest text-sm font-bold">
              Apple
            </span>
          </button>

        </div>

        {/* FOOTER */}
        <div className="mt-12 text-[10px] uppercase tracking-wide text-neutral-500">
          <p>Al continuar aceptas nuestros términos y condiciones.</p>
          <Link href="/" className="mt-4 block hover:text-current underline underline-offset-4">
            Volver a la tienda
          </Link>
        </div>

      </div>
    </main>
  );
}