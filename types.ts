
export interface RestaurantItem {
  id: number;
  name: string;
  chef: string;
  chefType: 'BLACK' | 'WHITE';
  specialty: string;
  location: string;
  description: string;
  keywords: string[];
  naverMapUrl: string;
}

export interface RestaurantResponse {
  restaurants: RestaurantItem[];
  lastUpdated: string;
  sourceUrl: string;
}
