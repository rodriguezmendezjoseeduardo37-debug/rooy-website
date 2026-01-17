export interface Product {
  _id: string;
  title: string;
  price: number;
  slug: { current: string };
  image: any; // Usamos any para evitar el error de importación
  description?: string;
  gallery?: any[];
}