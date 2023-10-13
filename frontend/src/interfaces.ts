export interface IProduct {
  id: number;
  title: string;
  description: string;
  price: number;
  category: string;
  rating: {
    rate: number;
    count: number;
  };
  image: string;
}
