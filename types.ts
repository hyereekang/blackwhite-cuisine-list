
export interface GroundingSource {
  title: string;
  uri: string;
}

export interface TravelRecommendationResponse {
  content: string;
  sources: GroundingSource[];
}

export interface UserPreferences {
  vibe: string;
  budget: string;
  companion: string;
  distance: string;
  additionalNeeds?: string;
  location?: {
    latitude: number;
    longitude: number;
  };
}
