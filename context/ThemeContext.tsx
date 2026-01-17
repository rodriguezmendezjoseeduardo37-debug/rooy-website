"use client";

import { createContext, useContext, useEffect, useState } from "react";

type ThemeContextType = {
  dark: boolean;
  toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [dark, setDark] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem("theme");
    if (saved === "dark") setDark(true);
  }, []);

  useEffect(() => {
    if (mounted) {
      localStorage.setItem("theme", dark ? "dark" : "light");
    }
  }, [dark, mounted]);

  const toggleTheme = () => setDark(!dark);

  // CORRECCIÓN IMPORTANTE:
  // Quitamos el "if (!mounted) return..." que borraba el Provider.
  // Ahora el Provider SIEMPRE envuelve a la app.
  
  return (
    <ThemeContext.Provider value={{ dark, toggleTheme }}>
      <div
        className={`${
          /* Si no está montado, forzamos modo claro/por defecto para evitar errores de hidratación */
          mounted && dark ? "bg-black text-white" : "bg-white text-black"
        } min-h-screen transition-colors duration-300 flex flex-col`}
      >
        {/* Usamos una opacidad para evitar el "flicker" o parpadeo inicial si quieres, 
            o simplemente renderizamos children directos */}
        {children}
      </div>
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme debe usarse dentro de ThemeProvider");
  }
  return context;
}