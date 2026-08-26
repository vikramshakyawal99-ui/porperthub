export type InvestmentArea = {
  id: string;
  name: string;
  city: string;
  score: number;
  category: "Emerging Growth" | "Strong Growth" | "Established / Premium";
  demand: string;
  priceMomentum: string;
  newSupply: string;
  buyerActivity: string;
  development: string;
  connectivity: string;
  marketPosition:
    | "Early Opportunity"
    | "Rising Fast"
    | "Growing but Expensive"
    | "Established"
    | "Watchlist";
  entryLevel: "Early" | "Moderate" | "High" | "Premium";
  futurePotential: "Moderate" | "Strong" | "Very Strong";
  outlook: string;
};

export const investmentAreas: InvestmentArea[] = [
  {
    id: "tonk-road",
    name: "Tonk Road",
    city: "Jaipur",
    score: 8.7,
    category: "Strong Growth",
    demand: "Strong",
    priceMomentum: "Rising",
    newSupply: "High",
    buyerActivity: "Strong",
    development: "High",
    connectivity: "Improving",
    outlook:
      "Strong development activity and improving connectivity are attracting increasing buyer interest.",
    marketPosition: "Rising Fast",
    entryLevel: "High",
    futurePotential: "Strong",
  },

  {
    id: "ajmer-road",
    name: "Ajmer Road",
    city: "Jaipur",
    score: 8.6,
    category: "Strong Growth",
    demand: "Strong",
    priceMomentum: "Rising",
    newSupply: "High",
    buyerActivity: "Strong",
    development: "High",
    connectivity: "Improving",
    outlook:
      "Major infrastructure growth and expanding residential development are supporting long-term demand.",
    marketPosition: "Early Opportunity",
    entryLevel: "Moderate",
    futurePotential: "Very Strong",
  },

  {
    id: "mansarovar-extension",
    name: "Mansarovar Extension",
    city: "Jaipur",
    score: 8.5,
    category: "Strong Growth",
    demand: "Strong",
    priceMomentum: "Rising",
    newSupply: "High",
    buyerActivity: "Strong",
    development: "High",
    connectivity: "Good",
    outlook:
      "Expanding residential supply and established connectivity make this a strong growth corridor.",
    marketPosition: "Rising Fast",
    entryLevel: "Moderate",
    futurePotential: "Strong",
  },

  {
    id: "vaishali-nagar-extension",
    name: "Vaishali Nagar Extension",
    city: "Jaipur",
    score: 8.3,
    category: "Strong Growth",
    demand: "Strong",
    priceMomentum: "Rising",
    newSupply: "Medium",
    buyerActivity: "Strong",
    development: "High",
    connectivity: "Good",
    outlook:
      "Expansion around an established residential market is creating new opportunities for buyers.",
    marketPosition: "Rising Fast",
    entryLevel: "High",
    futurePotential: "Strong",
  },

  {
    id: "ring-road-growth-belt",
    name: "Ring Road Growth Belt",
    city: "Jaipur",
    score: 8.4,
    category: "Emerging Growth",
    demand: "Growing",
    priceMomentum: "Rising",
    newSupply: "High",
    buyerActivity: "Growing",
    development: "High",
    connectivity: "Improving",
    marketPosition: "Watchlist",
    entryLevel: "Moderate",
    futurePotential: "Moderate",
    outlook:
      "Large-scale expansion around the Ring Road could support future residential and investment demand.",
  },

  {
    id: "vatika-road",
    name: "Vatika Road",
    city: "Jaipur",
    score: 8.2,
    category: "Emerging Growth",
    demand: "Growing",
    priceMomentum: "Rising",
    newSupply: "High",
    buyerActivity: "Growing",
    development: "High",
    connectivity: "Improving",
    outlook:
      "New residential development and improving infrastructure are creating an emerging investment corridor.",
    marketPosition: "Early Opportunity",
    entryLevel: "Early",
    futurePotential: "Very Strong",
  },

  {
    id: "diggi-road",
    name: "Diggi Road",
    city: "Jaipur",
    score: 8.0,
    category: "Emerging Growth",
    demand: "Growing",
    priceMomentum: "Rising",
    newSupply: "High",
    buyerActivity: "Growing",
    development: "High",
    connectivity: "Improving",
    marketPosition: "Watchlist",
    entryLevel: "Moderate",
    futurePotential: "Moderate",
    outlook:
      "Expanding development activity is gradually increasing interest in this emerging corridor.",
  },

  {
    id: "agra-road",
    name: "Agra Road",
    city: "Jaipur",
    score: 7.9,
    category: "Emerging Growth",
    demand: "Growing",
    priceMomentum: "Stable",
    newSupply: "High",
    buyerActivity: "Growing",
    development: "High",
    connectivity: "Improving",
    marketPosition: "Watchlist",
    entryLevel: "Moderate",
    futurePotential: "Moderate",
    outlook:
      "Infrastructure expansion and available development land create longer-term growth potential.",
  },

  {
    id: "delhi-road",
    name: "Delhi Road",
    city: "Jaipur",
    score: 7.8,
    category: "Emerging Growth",
    demand: "Growing",
    priceMomentum: "Stable",
    newSupply: "High",
    buyerActivity: "Growing",
    development: "Medium",
    connectivity: "Improving",
    marketPosition: "Watchlist",
    entryLevel: "Moderate",
    futurePotential: "Moderate",
    outlook:
      "Growing connectivity and expanding development could strengthen future residential demand.",
  },

  {
    id: "sikar-road",
    name: "Sikar Road",
    city: "Jaipur",
    score: 7.8,
    category: "Emerging Growth",
    demand: "Growing",
    priceMomentum: "Stable",
    newSupply: "High",
    buyerActivity: "Growing",
    development: "Medium",
    connectivity: "Improving",
    marketPosition: "Watchlist",
    entryLevel: "Moderate",
    futurePotential: "Moderate",
    outlook:
      "Expanding residential and commercial activity is gradually increasing the area's investment appeal.",
  },

  {
    id: "kalwar-road",
    name: "Kalwar Road",
    city: "Jaipur",
    score: 7.7,
    category: "Emerging Growth",
    demand: "Growing",
    priceMomentum: "Stable",
    newSupply: "High",
    buyerActivity: "Growing",
    development: "Medium",
    connectivity: "Improving",
    marketPosition: "Watchlist",
    entryLevel: "Moderate",
    futurePotential: "Moderate",
    outlook:
      "A developing outer corridor with increasing residential supply and improving connectivity.",
  },

  {
    id: "sirsi-road",
    name: "Sirsi Road",
    city: "Jaipur",
    score: 7.9,
    category: "Emerging Growth",
    demand: "Growing",
    priceMomentum: "Rising",
    newSupply: "Medium",
    buyerActivity: "Growing",
    development: "Medium",
    connectivity: "Good",
    marketPosition: "Watchlist",
    entryLevel: "Moderate",
    futurePotential: "Moderate",
    outlook:
      "Residential expansion and access to established western Jaipur markets support its growth outlook.",
  },

  {
    id: "jagatpura",
    name: "Jagatpura",
    city: "Jaipur",
    score: 8.4,
    category: "Strong Growth",
    demand: "Strong",
    priceMomentum: "Rising",
    newSupply: "High",
    buyerActivity: "Strong",
    development: "High",
    connectivity: "Good",
    outlook:
      "Strong residential demand and continued development make Jagatpura an important Jaipur growth zone.",
    marketPosition: "Growing but Expensive",
    entryLevel: "High",
    futurePotential: "Very Strong",
  },

  {
    id: "pratap-nagar",
    name: "Pratap Nagar",
    city: "Jaipur",
    score: 8.1,
    category: "Strong Growth",
    demand: "Strong",
    priceMomentum: "Rising",
    newSupply: "Medium",
    buyerActivity: "Strong",
    development: "High",
    connectivity: "Good",
    outlook:
      "Established infrastructure combined with continued residential development supports healthy demand.",
    marketPosition: "Growing but Expensive",
    entryLevel: "High",
    futurePotential: "Strong",
  },

  {
    id: "jhotwara-extension",
    name: "Jhotwara Extension",
    city: "Jaipur",
    score: 7.8,
    category: "Emerging Growth",
    demand: "Growing",
    priceMomentum: "Stable",
    newSupply: "High",
    buyerActivity: "Growing",
    development: "Medium",
    connectivity: "Improving",
    marketPosition: "Watchlist",
    entryLevel: "Moderate",
    futurePotential: "Moderate",
    outlook:
      "Expansion beyond established Jhotwara markets is creating new residential development opportunities.",
  },

  {
    id: "airport-sanganer",
    name: "Airport / Sanganer Belt",
    city: "Jaipur",
    score: 8.2,
    category: "Strong Growth",
    demand: "Strong",
    priceMomentum: "Rising",
    newSupply: "Medium",
    buyerActivity: "Strong",
    development: "High",
    connectivity: "Good",
    marketPosition: "Watchlist",
    entryLevel: "Moderate",
    futurePotential: "Moderate",
    outlook:
      "Airport access and expanding residential activity continue to support demand across the southern corridor.",
  },

  {
    id: "malviya-nagar-durgapura",
    name: "Malviya Nagar / Durgapura",
    city: "Jaipur",
    score: 8.0,
    category: "Established / Premium",
    demand: "Strong",
    priceMomentum: "Stable",
    newSupply: "Low",
    buyerActivity: "Strong",
    development: "Medium",
    connectivity: "Excellent",
    marketPosition: "Watchlist",
    entryLevel: "Moderate",
    futurePotential: "Moderate",
    outlook:
      "An established premium market with strong connectivity, limited new supply and consistent buyer demand.",
  },

  {
    id: "mansarovar",
    name: "Mansarovar",
    city: "Jaipur",
    score: 7.9,
    category: "Established / Premium",
    demand: "Strong",
    priceMomentum: "Stable",
    newSupply: "Low",
    buyerActivity: "Strong",
    development: "Medium",
    connectivity: "Excellent",
    marketPosition: "Watchlist",
    entryLevel: "Moderate",
    futurePotential: "Moderate",
    outlook:
      "A mature residential market offering strong end-user demand and established city connectivity.",
  },

  {
    id: "c-scheme-central-jaipur",
    name: "C-Scheme / Central Jaipur",
    city: "Jaipur",
    score: 7.8,
    category: "Established / Premium",
    demand: "Strong",
    priceMomentum: "Stable",
    newSupply: "Low",
    buyerActivity: "Strong",
    development: "Low",
    connectivity: "Excellent",
    marketPosition: "Watchlist",
    entryLevel: "Moderate",
    futurePotential: "Moderate",
    outlook:
      "A mature premium market where location strength, scarcity and established demand support property values.",
  },
  {
    id: "gokulpura",
    name: "Gokulpura",
    city: "Jaipur",
    score: 7.9,
    category: "Emerging Growth",
    demand: "Growing",
    priceMomentum: "Rising",
    newSupply: "High",
    buyerActivity: "Growing",
    development: "High",
    connectivity: "Improving",
    outlook:
      "Increasing residential development and new property supply are making Gokulpura an emerging Jaipur micro-market.",
    marketPosition: "Early Opportunity",
    entryLevel: "Early",
    futurePotential: "Strong",
  },

  {
    id: "vatika",
    name: "Vatika",
    city: "Jaipur",
    score: 8.1,
    category: "Emerging Growth",
    demand: "Growing",
    priceMomentum: "Rising",
    newSupply: "High",
    buyerActivity: "Growing",
    development: "High",
    connectivity: "Improving",
    marketPosition: "Watchlist",
    entryLevel: "Moderate",
    futurePotential: "Moderate",
    outlook:
      "Rapid property development and expanding residential supply are increasing the area's long-term investment potential.",
  },


  {
    id: "vidyadhar-nagar",
    name: "Vidyadhar Nagar",
    city: "Jaipur",
    score: 8.1,
    category: "Established / Premium",
    demand: "Strong",
    priceMomentum: "Rising",
    newSupply: "Medium",
    buyerActivity: "Strong",
    development: "Medium",
    connectivity: "Good",
    marketPosition: "Established",
    entryLevel: "High",
    futurePotential: "Strong",
    outlook:
      "Sikar Road connectivity, nearby employment and industrial activity, and the area's established premium residential character support consistent demand.",
  },

];

export const featuredInvestmentArea = investmentAreas[0];
