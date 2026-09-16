export interface BoutiqueItem {
  id: string;
  name: string;
  category: 'tenue' | 'entrainement' | 'accessoire' | 'veste';
  price: number;
  description: string;
  image: string;
  availableSizes: string[];
  badge?: string;
  brand: string;
}

export interface CartItem {
  item: BoutiqueItem;
  size: string;
  quantity: number;
}
