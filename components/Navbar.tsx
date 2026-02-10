"use client";

import Link from "next/link";
import Image from "next/image";
import { useTheme } from "@/context/ThemeContext";
import { useCart } from "@/context/CartContext";
import { signOut, useSession } from "next-auth/react";
import SearchBar from "./SearchBar";
import { useState, useEffect } from "react";
import { FaBars, FaTimes, FaShoppingBag, FaUser } from "react-icons/fa";

export default function Navbar() {
  const { dark, toggleTheme } = useTheme();
  const { openCart, cart } = useCart();
  const { data: session } = useSession();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Colores dinámicos calculados manualmente para evitar errores de Tailwind
  const iconColor = dark ? "white" : "black";
  const textColor = dark ? "text-white" : "text-black";
  const bgColor = dark ? "bg-black/80" : "bg-white/80";
  const borderColor = dark ? "border-white/10" : "border-neutral-200";

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header 
      className={`
        sticky top-0 z-50 transition-all duration-300
        ${scrolled 
          ? `${bgColor} backdrop-blur-md border-b ${borderColor} shadow-sm` 
          : "bg-transparent border-b border-transparent"}
      `}
    >
      <nav className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between flex-wrap gap-4">
        
        {/* LOGO */}
        <Link href="/" className={`text-2xl tracking-[0.3em] font-bold uppercase hover:opacity-70 transition ${textColor}`}>
          Essor
        </Link>

        {/* BUSCADOR (Desktop) */}
        <div className="hidden md:block w-1/3">
           <SearchBar />
        </div>

        {/* ICONOS */}
        <div className="flex items-center gap-4 sm:gap-6 order-2 md:order-3">
            
            {/* 1. BOTÓN DE TEMA (Ahora visible siempre para pruebas) */}
            <button 
              onClick={toggleTheme} 
              className={`text-[10px] uppercase font-bold border border-current px-2 py-1 rounded-full hover:opacity-70 transition ${textColor}`}
            >
                {dark ? "Light" : "Dark"}
            </button>

            {/* 2. CARRITO (Color forzado con estilo inline para asegurar visibilidad) */}
            <button 
              onClick={openCart} 
              className="relative p-2 hover:scale-110 transition"
              style={{ color: iconColor }}
            >
                <FaShoppingBag size={20} />
                {cart.length > 0 && (
                    <span 
                      className={`absolute -top-1 -right-1 text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full ${dark ? 'bg-white text-black' : 'bg-black text-white'}`}
                    >
                        {cart.length}
                    </span>
                )}
            </button>

            {/* 3. USUARIO */}
            {session?.user ? (
               <div className="relative group z-50">
                 <Link href="/cuenta" className="flex items-center gap-2 py-2 hover:opacity-70 transition">
                   {session.user.image ? (
                     <Image 
                       src={session.user.image} 
                       alt="User" 
                       width={32} 
                       height={32} 
                       className="rounded-full border border-neutral-300"
                     />
                   ) : (
                     <FaUser size={20} style={{ color: iconColor }} />
                   )}
                 </Link>
                 
                 {/* MENÚ FLOTANTE */}
                 <div className={`
                    absolute right-0 mt-2 w-56 
                    ${dark ? "bg-neutral-900 border-neutral-800" : "bg-white border-neutral-200"}
                    border shadow-xl rounded-lg overflow-hidden flex flex-col
                    opacity-0 invisible group-hover:opacity-100 group-hover:visible 
                    transition-all duration-200
                 `}>
                    <div className={`p-4 border-b ${dark ? "border-neutral-800 bg-neutral-900" : "border-neutral-100 bg-neutral-50"}`}>
                      <p className={`text-sm font-bold truncate ${textColor}`}>{session.user.name}</p>
                      <p className="text-xs text-neutral-500 truncate">{session.user.email}</p>
                    </div>
                    
                    <Link 
                      href="/cuenta" 
                      className={`px-4 py-3 text-xs uppercase tracking-widest font-bold ${textColor} hover:opacity-70 transition`}
                    >
                      Mi Cuenta
                    </Link>
                    
                    <button 
                      onClick={() => signOut({ callbackUrl: "/login" })} 
                      className="text-left px-4 py-3 text-xs uppercase tracking-widest font-bold text-red-600 hover:opacity-70 transition"
                    >
                      Cerrar Sesión
                    </button>
                 </div>
               </div>
            ) : (
              <Link href="/login" className={`text-xs uppercase font-bold hidden md:block hover:underline underline-offset-4 ${textColor}`}>
                Login
              </Link>
            )}

             {/* MENU MÓVIL ICONO */}
             <button onClick={() => setMenuOpen(!menuOpen)} className={`md:hidden ${textColor}`}>
                {menuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
             </button>
        </div>

        {/* ENLACES CENTRALES */}
        <div className={`hidden md:flex items-center gap-6 text-xs uppercase tracking-widest font-bold order-3 ${textColor}`}>
          <Link href="/catalogo" className="hover:opacity-60 transition">Catálogo</Link>
          <Link href="/contacto" className="hover:opacity-60 transition">Contacto</Link>
        </div>

        {/* MENU MÓVIL DESPLEGABLE */}
        {menuOpen && (
          <div className={`w-full basis-full md:hidden flex flex-col gap-4 mt-4 pt-4 border-t ${borderColor} animate-in slide-in-from-top-2 ${dark ? "bg-black" : "bg-white"} p-4 rounded-b-lg shadow-lg`}>
            <SearchBar />
            <Link href="/catalogo" className={`py-2 font-bold uppercase tracking-widest ${textColor}`} onClick={() => setMenuOpen(false)}>Catálogo</Link>
            <Link href="/cuenta" className={`py-2 font-bold uppercase tracking-widest ${textColor}`} onClick={() => setMenuOpen(false)}>Mi Cuenta</Link>
          </div>
        )}
      </nav>
    </header>
  );
}