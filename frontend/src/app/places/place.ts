export type PlaceCategory =
  'hotel' | 'restaurant' | 'entertainment' | 'nature' | 'culture' | 'architecture' | 'spa';

export type Place = {
  id: number;
  name: string;
  category: PlaceCategory;
  city: string;
  country: string;
  rating: number | null;
  priceLevel: number | null;
  tags: string[];
  badge?: string;
  description: string;
  imageUrl: string;
  isFavorite?: boolean;
};
