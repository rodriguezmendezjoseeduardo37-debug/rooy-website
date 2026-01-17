import "./globals.css";
import { ThemeProvider } from "@/context/ThemeContext";
import { CartProvider } from "@/context/CartContext";

// IMPORTANTE: Importar SIN llaves (porque es default export)
import AuthProvider from "@/context/AuthProvider"; 

import Navbar from "@/components/Navbar";
import CartSidebar from "@/components/CartSidebar";
import WhatsappButton from "@/components/WhatsappButton";

export const metadata = {
  title: "ROOY | Streetwear",
  description: "Tienda oficial ROOY",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body>
        {/* El AuthProvider envuelve todo */}
        <AuthProvider>
          <ThemeProvider>
            <CartProvider>
              <Navbar />
              <CartSidebar />
              {children}
              <WhatsappButton />
            </CartProvider>
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}