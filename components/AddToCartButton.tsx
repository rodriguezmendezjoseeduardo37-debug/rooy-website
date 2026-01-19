"use client";

import { useCart } from "@/context/CartContext";
import { useTheme } from "@/context/ThemeContext"; // <--- Importamos el tema para detectar modo
import { Product } from "@/types";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { FaMinus, FaPlus } from "react-icons/fa";

export default function AddToCartButton({ product }: { product: Product }) {
  const { addToCart } = useCart();
  const { dark } = useTheme(); // <--- Detectamos si es Dark o Light
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // Estados
  const [selectedSize, setSelectedSize] = useState("M");
  const [quantity, setQuantity] = useState(1);
  const [mounted, setMounted] = useState(false);

  const sizes = ["S", "M", "L", "XL"];

  // Evitar errores de hidratación (esperar a que cargue el cliente)
  useEffect(() => setMounted(true), []);

  const increaseQty = () => setQuantity((prev) => prev + 1);
  const decreaseQty = () => setQuantity((prev) => (prev > 1 ? prev - 1 : 1));

  const handleAddToCart = () => {
    addToCart({ ...product, quantity, size: selectedSize }, true);
  };

  const handleBuyNow = async () => {
    setLoading(true);
    addToCart({ ...product, quantity, size: selectedSize }, false);
    setTimeout(() => {
        router.push("/checkout");
    }, 100);
  };

  // --- COLORES DINÁMICOS (A prueba de fallos) ---
  // Si no está montado aún, asumimos valores seguros
  const isDark = mounted ? dark : false;

  const textColor = isDark ? "text-white" : "text-black";
  const borderColor = isDark ? "border-neutral-700" : "border-neutral-300";
  const hoverBg = isDark ? "hover:bg-neutral-800" : "hover:bg-neutral-100";
  
  // Estilo para botón de talla NO seleccionado
  const unselectedStyle = {
    color: isDark ? "white" : "black",
    borderColor: isDark ? "#404040" : "#d4d4d4", // Gris neutro
    backgroundColor: "transparent"
  };

  // Estilo para botón de talla SELECCIONADO
  const selectedStyle = {
    color: isDark ? "black" : "white",
    backgroundColor: isDark ? "white" : "black",
    borderColor: isDark ? "white" : "black"
  };

  if (!mounted) return null; // Evita parpadeos raros al cargar

  return (
    <div className="flex flex-col gap-8 mt-6">
      
      {/* 1. SELECTOR DE TALLA */}
      <div>
        <h3 className={`text-xs font-bold uppercase tracking-widest mb-3 ${textColor}`}>
          Seleccionar Talla
        </h3>
        <div className="flex flex-wrap gap-3">
          {sizes.map((size) => {
            const isSelected = selectedSize === size;
            return (
              <button
                key={size}
                onClick={() => setSelectedSize(size)}
                // Usamos estilos inline para forzar el color y evitar errores de clases
                style={isSelected ? selectedStyle : unselectedStyle}
                className={`
                  w-12 h-12 flex items-center justify-center text-sm font-bold border transition-all
                  ${!isSelected && hoverBg} 
                `}
              >
                {size}
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. SELECTOR DE CANTIDAD */}
      <div>
        <h3 className={`text-xs font-bold uppercase tracking-widest mb-3 ${textColor}`}>
          Cantidad
        </h3>
        <div 
          className="flex items-center w-fit border"
          style={{ borderColor: isDark ? "#404040" : "#d4d4d4" }}
        >
          <button 
            onClick={decreaseQty}
            className={`w-12 h-12 flex items-center justify-center transition ${hoverBg}`}
            style={{ color: isDark ? "white" : "black" }} // Color forzado
          >
            <FaMinus size={10} />
          </button>
          
          <span 
            className="w-12 h-12 flex items-center justify-center text-sm font-bold border-x"
            style={{ 
                color: isDark ? "white" : "black",
                borderColor: isDark ? "#404040" : "#d4d4d4"
            }}
          >
            {quantity}
          </span>
          
          <button 
            onClick={increaseQty}
            className={`w-12 h-12 flex items-center justify-center transition ${hoverBg}`}
            style={{ color: isDark ? "white" : "black" }} // Color forzado
          >
            <FaPlus size={10} />
          </button>
        </div>
      </div>

      {/* 3. BOTONES DE ACCIÓN */}
      <div className={`flex flex-col gap-3 pt-4 border-t ${isDark ? "border-neutral-800" : "border-neutral-200"}`}>
        <button
            onClick={handleBuyNow}
            disabled={loading}
            className={`
            w-full py-4 
            uppercase tracking-[0.2em] font-bold text-xs 
            hover:opacity-80 transition-opacity
            disabled:opacity-50 shadow-lg
            ${isDark ? "bg-white text-black" : "bg-black text-white"}
            `}
        >
            {loading ? "Iniciando..." : "Comprar Ahora"}
        </button>

        <button
            onClick={handleAddToCart}
            className={`
            w-full py-4 border-2
            uppercase tracking-[0.2em] font-bold text-xs 
            transition-colors
            ${isDark 
                ? "border-white text-white bg-black hover:bg-neutral-900" 
                : "border-black text-black bg-white hover:bg-neutral-50"}
            `}
        >
            Agregar al Carrito
        </button>
      </div>
    </div>
  );
}