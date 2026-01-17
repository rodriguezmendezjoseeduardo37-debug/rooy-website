import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Product } from '@/types';

interface CartItem extends Product {
  quantity: number;
  size?: string; // Opcional: Para futuras tallas
}

interface ShopState {
  cart: CartItem[];
  favorites: Product[];
  isCartOpen: boolean;
  
  // Acciones Carrito
  addToCart: (product: Product, size?: string) => void;
  removeFromCart: (productId: string) => void;
  toggleCart: () => void;
  
  // Acciones Favoritos
  toggleFavorite: (product: Product) => void;
}

export const useShopStore = create<ShopState>()(
  persist(
    (set, get) => ({
      cart: [],
      favorites: [],
      isCartOpen: false,

      addToCart: (product, size = "L") => {
        const { cart } = get();
        const existing = cart.find((item) => item._id === product._id);

        if (existing) {
          set({
            cart: cart.map((item) =>
              item._id === product._id
                ? { ...item, quantity: item.quantity + 1 }
                : item
            ),
            isCartOpen: true, // Abrimos carrito al añadir
          });
        } else {
          set({ 
            cart: [...cart, { ...product, quantity: 1, size }],
            isCartOpen: true 
          });
        }
      },

      removeFromCart: (id) => {
        set({ cart: get().cart.filter((item) => item._id !== id) });
      },

      toggleCart: () => set({ isCartOpen: !get().isCartOpen }),

      toggleFavorite: (product) => {
        const { favorites } = get();
        const exists = favorites.find((f) => f._id === product._id);

        if (exists) {
          set({ favorites: favorites.filter((f) => f._id !== product._id) });
        } else {
          set({ favorites: [...favorites, product] });
        }
      },
    }),
    {
      name: 'rooy-storage', // Nombre para guardar en localStorage
    }
  )
);