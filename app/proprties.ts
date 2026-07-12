export type Builder = {
  name: string;
  logo: string;
  website: string;
  experience: string;
  projects: number;
  rating: number;
  reraApproved: boolean;
};

export type NearbyPlaces = {
  metro: string;
  school: string;
  hospital: string;
  mall: string;
  airport: string;
  railwayStation: string;
};

export type Coordinates = {
  lat: number;
  lng: number;
};

export type Property = {
  id: number;
  title: string;
  location: string;
  price: string;

  images: string[];

  builder: Builder;

  bedrooms: number;
  bathrooms: number;
  area: string;
  parking: string;
  possession: string;

  description: string;

  amenities: string[];

  nearby: NearbyPlaces;

  coordinates: Coordinates;

  rating: number;

  rera: string;
};