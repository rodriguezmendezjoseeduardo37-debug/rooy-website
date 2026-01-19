import "./globals.css";
import { ThemeProvider } from "@/context/ThemeContext";
import { CartProvider } from "@/context/CartContext";
import AuthProvider from "@/context/AuthProvider";
import Navbar from "@/components/Navbar";
import CartSidebar from "@/components/CartSidebar";
import WhatsappButton from "@/components/WhatsappButton";

// Si usaste el Zoom en productos, importa su CSS aquí para evitar errores:
import 'react-medium-image-zoom/dist/styles.css'; 

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
    <html lang="es" suppressHydrationWarning>
      <body 
        className="
          min-h-screen 
          bg-gradient-to-br from-neutral-100 to-neutral-300 dark:from-neutral-950 dark:to-black 
          text-black dark:text-white 
          selection:bg-black selection:text-white dark:selection:bg-white dark:selection:text-black
          transition-colors duration-300
        "
      >
        <AuthProvider>
          <ThemeProvider>
            <CartProvider>
              <Navbar />
              <CartSidebar />
              
              {/* Envolvemos children en un main para asegurar altura mínima */}
              <main className="min-h-screen">
                {children}
              </main>

              <WhatsappButton />
            </CartProvider>
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}