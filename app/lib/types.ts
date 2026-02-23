export type Sport = "basketball" | "tennis" | "pickleball";

export interface LatLng {
  lat: number;
  lng: number;
}

export interface Court {
  placeId: string;
  name: string;
  address: string;
  lat: number;
  lng: number;
  rating?: number;
  reviewCount?: number;
  sport: Sport;
  distanceMiles: number;
  photoReference?: string;
}

export interface CourtDetail extends Court {
  photos: string[];
  reviews: PlaceReview[];
  website?: string;
  phone?: string;
  googleMapsUrl: string;
  openNow?: boolean;
}

export interface PlaceReview {
  author: string;
  rating: number;
  text: string;
  relativeTime: string;
}
 
