"use client";

import Link from "next/link";
import Image from "next/image"; // Importamos Image
import { useTheme } from "@/context/ThemeContext";
import { useCart } from "@/context/CartContext";
import { signIn, signOut, useSession } from "next-auth/react"; // Hooks de Auth
import SearchBar from "./SearchBar";
import { useState } from "react";
import { FaBars, FaTimes, FaShoppingBag, FaUser } from "react-icons/fa";

export default function Navbar() {
  const { dark, toggleTheme } = useTheme();
  const { openCart, cart } = useCart();
  const { data: session } = useSession(); // Datos del usuario
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="border-b border-neutral-300 dark:border-neutral-800 sticky top-0 z-40 bg-inherit backdrop-blur-md">
      <nav className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between flex-wrap gap-4">
        
        {/* LOGO */}
        <Link href="/" className="text-2xl tracking-[0.3em] font-bold uppercase">
          ROOY
        </Link>

        {/* BUSCADOR */}
        <div className="hidden md:block w-1/3">
           <SearchBar />
        </div>

        {/* ICONOS */}
        <div className="flex items-center gap-6 order-2 md:order-3">
            {/* CARRITO */}
            <button onClick={openCart} className="relative p-2">
                <FaShoppingBag size={20} />
                {cart.length > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full">
                        {cart.length}
                    </span>
                )}
            </button>

            {/* USUARIO / LOGIN */}
            {session?.user ? (
               <div className="relative group">
                 {/* Si hay foto, la mostramos, si no, icono */}
                 <button className="flex items-center gap-2">
                   {session.user.image ? (
                     <Image 
                       src={session.user.image} 
                       alt="User" 
                       width={32} 
                       height={32} 
                       className="rounded-full border border-neutral-300"
                     />
                   ) : (
                     <FaUser size={20} />
                   )}
                 </button>
                 
                 {/* Menú desplegable al pasar mouse */}
                 <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-black border border-neutral-200 dark:border-neutral-800 shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                    <div className="p-4 border-b border-neutral-200 dark:border-neutral-800">
                      <p className="text-xs font-bold truncate">{session.user.name}</p>
                      <p className="text-[10px] text-neutral-500 truncate">{session.user.email}</p>
                    </div>
                    <button 
                      onClick={() => signOut()} 
                      className="w-full text-left px-4 py-3 text-xs uppercase tracking-widest hover:bg-neutral-100 dark:hover:bg-neutral-900"
                    >
                      Cerrar Sesión
                    </button>
                 </div>
               </div>
            ) : (
              <button 
                onClick={() => signIn("google")}
                className="text-xs uppercase font-bold hidden md:block"
              >
                Login
              </button>
            )}

            {/* BOTÓN TEMA */}
             <button
                onClick={toggleTheme}
                className="text-xs uppercase font-bold border border-current px-3 py-1 hover:bg-neutral-200 dark:hover:bg-neutral-800 transition hidden md:block"
            >
                {dark ? "L" : "D"}
            </button>

             {/* TOGGLE MOVIL */}
             <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden">
                {menuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
             </button>
        </div>

        {/* MENU DESKTOP */}
        <div className="hidden md:flex items-center gap-6 text-xs uppercase tracking-widest font-medium order-3">
          <Link href="/catalogo" className="hover:underline underline-offset-4">Catálogo</Link>
          <Link href="/contacto" className="hover:underline underline-offset-4">Contacto</Link>
        </div>

        {/* MENU MÓVIL */}
        {menuOpen && (
          <div className="w-full basis-full md:hidden flex flex-col gap-4 mt-4 text-center border-t border-neutral-200 dark:border-neutral-800 pt-4 order-4">
            <div className="mb-4"><SearchBar /></div>
            <Link href="/catalogo" className="uppercase tracking-widest text-sm py-2" onClick={() => setMenuOpen(false)}>Catálogo</Link>
            
            {!session && (
               <button onClick={() => signIn("google")} className="uppercase tracking-widest text-sm py-2">
                 Iniciar Sesión
               </button>
            )}
            
            <button onClick={toggleTheme} className="uppercase tracking-widest text-sm py-2">
                 Modo {dark ? "Claro" : "Oscuro"}
            </button>
          </div>
        )}
      </nav>
    </header>
  );
}