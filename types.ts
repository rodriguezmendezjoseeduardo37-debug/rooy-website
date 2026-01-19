export interface Product {
  _id: string;
  title: string;
  price: number;
  description: string;
  // CORRECCIÓN: Definimos slug como un objeto, no como string simple
  slug: {
    current: string;
  };
  image: any;
  gallery?: any[];
}

export interface CartItem extends Product {
  quantity: number;
  size?: string;
}