export type GrowthAreaType =
  | "extension"
  | "road_corridor"
  | "growth_belt"
  | "emerging_area";

export type SignalStatus =
  | "unknown"
  | "low"
  | "moderate"
  | "high"
  | "very_high";

export type GrowthSignal = {
  status: SignalStatus;

  // 0 means no verified data yet.
  // This must NOT be treated as a real market score.
  score: number;

  dataPoints: number;
};

export type GrowthArea = {
  id: string;
  name: string;
  type: GrowthAreaType;

  parentArea?: string;

  latitude?: number;
  longitude?: number;

  demand: GrowthSignal;
  priceMomentum: GrowthSignal;
  newSupply: GrowthSignal;
  buyerActivity: GrowthSignal;
  development: GrowthSignal;

  aiOutlook: "insufficient_data" | "watch" | "positive" | "strong";

  confidenceScore: number;

  dataStatus:
    | "insufficient_data"
    | "limited_data"
    | "developing"
    | "verified";

  lastUpdated?: string;
};

const emptySignal = (): GrowthSignal => ({
  status: "unknown",
  score: 0,
  dataPoints: 0,
});

const createGrowthArea = (
  area: Omit<GrowthArea, 
    | "demand"
    | "priceMomentum"
    | "newSupply"
    | "buyerActivity"
    | "development"
    | "aiOutlook"
    | "confidenceScore"
    | "dataStatus"
  >
): GrowthArea => ({
  ...area,

  demand: emptySignal(),
  priceMomentum: emptySignal(),
  newSupply: emptySignal(),
  buyerActivity: emptySignal(),
  development: emptySignal(),

  aiOutlook: "insufficient_data",
  confidenceScore: 0,

  dataStatus: "insufficient_data",
});

export const jaipurGrowthAreas: GrowthArea[] = [

  createGrowthArea({
    id: "mansarovar-extension",
    name: "Mansarovar Extension",
    type: "extension",
    parentArea: "Mansarovar",
  }),

  createGrowthArea({
    id: "vaishali-nagar-extension",
    name: "Vaishali Nagar Extension",
    type: "extension",
    parentArea: "Vaishali Nagar",
  }),

  createGrowthArea({
    id: "ajmer-road",
    name: "Ajmer Road",
    type: "road_corridor",
  }),

  createGrowthArea({
    id: "agra-road",
    name: "Agra Road",
    type: "road_corridor",
  }),

  createGrowthArea({
    id: "vatika-road",
    name: "Vatika Road",
    type: "growth_belt",
  }),

  createGrowthArea({
    id: "diggi-road",
    name: "Diggi Road",
    type: "road_corridor",
  }),

  createGrowthArea({
    id: "tonk-road",
    name: "Tonk Road",
    type: "road_corridor",
  }),

  createGrowthArea({
    id: "ring-road-growth-belt",
    name: "Ring Road Growth Belt",
    type: "growth_belt",
  }),


  createGrowthArea({
    id: "delhi-road",
    name: "Delhi Road",
    type: "road_corridor",
  }),

  createGrowthArea({
    id: "sikar-road",
    name: "Sikar Road",
    type: "road_corridor",
  }),

  createGrowthArea({
    id: "kalwar-road",
    name: "Kalwar Road",
    type: "road_corridor",
  }),

  createGrowthArea({
    id: "sirsi-road",
    name: "Sirsi Road",
    type: "road_corridor",
  }),

  createGrowthArea({
    id: "jagatpura",
    name: "Jagatpura",
    type: "emerging_area",
  }),

  createGrowthArea({
    id: "pratap-nagar",
    name: "Pratap Nagar",
    type: "emerging_area",
  }),

  createGrowthArea({
    id: "jhotwara-extension",
    name: "Jhotwara Extension",
    type: "extension",
    parentArea: "Jhotwara",
  }),

  createGrowthArea({
    id: "airport-sanganer",
    name: "Airport / Sanganer Belt",
    type: "growth_belt",
  }),

  createGrowthArea({
    id: "malviya-nagar-durgapura",
    name: "Malviya Nagar / Durgapura",
    type: "emerging_area",
  }),

  createGrowthArea({
    id: "mansarovar",
    name: "Mansarovar",
    type: "emerging_area",
  }),

  createGrowthArea({
    id: "c-scheme-central-jaipur",
    name: "C-Scheme / Central Jaipur",
    type: "emerging_area",
  }),

  createGrowthArea({
    id: "gokulpura",
    name: "Gokulpura",
    type: "emerging_area",
  }),

  createGrowthArea({
    id: "vatika",
    name: "Vatika",
    type: "emerging_area",
  }),
];
