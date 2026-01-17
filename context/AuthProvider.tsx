"use client";

import { SessionProvider } from "next-auth/react";

// Usamos export default function para evitar confusiones
export default function AuthProvider({ children }: { children: React.ReactNode }) {
  return <SessionProvider>{children}</SessionProvider>;
}