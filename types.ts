
export interface GroundingSource {
  title: string;
  uri: string;
}

export interface RestaurantResponse {
  content: string;
  lastUpdated: string;
  sources: GroundingSource[];
}
