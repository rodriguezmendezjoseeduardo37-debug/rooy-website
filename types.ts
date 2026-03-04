export interface SanityImage {
  _type: "image";
  asset: {
    _ref: string;
    _type: "reference";
  };
}

export interface Product {
  _id: string;
  title: string;
  price: number;
  description: string;
  // CORRECCIÓN: Definimos slug como un objeto, no como string simple
  slug: {
    current: string;
  };
  image: SanityImage;
  gallery?: SanityImage[];
}

export interface CartItem extends Product {
  quantity: number;
  size?: string;
}