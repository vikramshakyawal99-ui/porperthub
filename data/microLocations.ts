export type InvestmentProject = {
  name: string;
  status:
    | "Upcoming"
    | "New Launch"
    | "Under Construction"
    | "Recently Launched";
  location: string;
  source: string;
  lastChecked: string;
};

export type GrowthDriver = {
  name: string;

  type:
    | "Metro"
    | "Road"
    | "Employment"
    | "Education"
    | "Coaching"
    | "College"
    | "Commercial"
    | "Market"
    | "Healthcare"
    | "Airport"
    | "Industrial"
    | "Railway"
    | "Residential";

  status:
    | "Proposed"
    | "Approved"
    | "Under Construction"
    | "Operational"
    | "Expanding"
    | "Transition";

  impact: "Low" | "Medium" | "High" | "Very High";

  description: string;
  source: string;
  lastChecked: string;
};

export type MicroLocation = {
  id: string;
  areaId: string;
  name: string;
  city: string;

  marketPosition:
    | "Early Opportunity"
    | "Rising Fast"
    | "Growing but Expensive"
    | "Established";

  entryLevel: "Early" | "Moderate" | "High" | "Premium";

  demand: "Growing" | "Strong" | "Very Strong";
  newDevelopment: "Low" | "Medium" | "High";
  newSupply: "Low" | "Medium" | "High";

  connectivity: "Improving" | "Good" | "Excellent";

  futurePotential: "Moderate" | "Strong" | "Very Strong";

  projects: InvestmentProject[];
  growthDrivers?: GrowthDriver[];
  developmentReasons: string[];

  outlook: string;
};

export const microLocations: MicroLocation[] = [
  {
    id: "sitapura-tonk-road",
    areaId: "tonk-road",
    name: "Sitapura",
    city: "Jaipur",
    marketPosition: "Growing but Expensive",
    entryLevel: "High",
    demand: "Strong",
    newDevelopment: "High",
    newSupply: "High",
    connectivity: "Good",
    futurePotential: "Strong",

    projects: [],

    growthDrivers: [
      {
        name: "Jaipur Metro Phase 2",
        type: "Metro",
        status: "Approved",
        impact: "Very High",
        description:
          "The approved 41 km Jaipur Metro Phase 2 corridor will connect major activity nodes including Sitapura Industrial Area, Jaipur Airport and Tonk Road, strengthening long-term public transport connectivity.",
        source: "Press Information Bureau, Government of India",
        lastChecked: "2026-08",
      },
      {
        name: "Sitapura Industrial & Employment Ecosystem",
        type: "Employment",
        status: "Operational",
        impact: "Very High",
        description:
          "Sitapura has an established industrial and employment base, with industrial, export and service activity supporting recurring housing demand from employees and businesses.",
        source: "RIICO / Government industrial records",
        lastChecked: "2026-08",
      },
      {
        name: "Tonk Road Connectivity",
        type: "Road",
        status: "Under Construction",
        impact: "High",
        description:
          "A 13 km model corridor from Yadgar to Sanganer is being developed with junction improvements, pedestrian facilities, traffic management and road-design upgrades.",
        source: "City of Jaipur / JMC / JDA reporting",
        lastChecked: "2026-08",
      },
    ],
    developmentReasons: [
      "Established industrial and employment activity supports recurring residential demand.",
      "Jaipur Metro Phase 2 is expected to improve long-term public transport connectivity.",
      "Tonk Road connectivity and corridor improvements can strengthen accessibility.",
      "New residential supply is expanding around the southern Jaipur employment belt.",
    ],

    outlook:
      "Sitapura is an established southern Jaipur growth pocket. Investors should focus on selected residential locations where employment, connectivity and new development support long-term demand.",
  },

  {
    id: "pratap-nagar-tonk-road",
    areaId: "tonk-road",
    name: "Pratap Nagar",
    city: "Jaipur",
    marketPosition: "Growing but Expensive",
    entryLevel: "High",
    demand: "Very Strong",
    newDevelopment: "Medium",
    newSupply: "Medium",
    connectivity: "Excellent",
    futurePotential: "Strong",

    projects: [],

    growthDrivers: [
      {
        name: "Jaipur Metro Phase 2",
        type: "Metro",
        status: "Approved",
        impact: "Very High",
        description:
          "Jaipur Metro Phase 2 will improve connectivity across the southern Jaipur corridor, including Tonk Road, Sitapura and Jaipur Airport, strengthening the wider Pratap Nagar connectivity ecosystem.",
        source: "Press Information Bureau, Government of India",
        lastChecked: "2026-08",
      },
      {
        name: "Pratap Nagar Coaching Hub",
        type: "Coaching",
        status: "Transition",
        impact: "High",
        description:
          "Pratap Nagar's designated Coaching Hub is an important education-led development driver. Current relocation and implementation activity means PropertyHub tracks it as a transition-stage driver rather than assuming full operational consolidation.",
        source: "Rajasthan Housing Board / current Jaipur reporting",
        lastChecked: "2026-08",
      },
      {
        name: "Jaipur Airport Connectivity",
        type: "Airport",
        status: "Approved",
        impact: "High",
        description:
          "Metro Phase 2 is planned to provide connectivity to Jaipur Airport, improving the wider airport-to-southern-Jaipur mobility network.",
        source: "Press Information Bureau, Government of India",
        lastChecked: "2026-08",
      },
      {
        name: "Tonk Road Model Corridor",
        type: "Road",
        status: "Under Construction",
        impact: "High",
        description:
          "Road and junction improvements along the Tonk Road corridor are intended to improve traffic movement, pedestrian safety and public transport operations.",
        source: "JMC / JDA reporting",
        lastChecked: "2026-08",
      },
    ],
    developmentReasons: [
      "Strong existing residential demand provides an established buyer and rental base.",
      "Jaipur Metro Phase 2 is expected to strengthen southern Jaipur connectivity.",
      "Education and coaching activity can support student and rental housing demand.",
      "Airport and Tonk Road connectivity strengthen the area's accessibility.",
    ],

    outlook:
      "Pratap Nagar is a strong-demand residential market supported by education, connectivity and established infrastructure. Investors should prioritise project quality, exact location and price discipline.",
  },

  {
    id: "sanganer-extension-tonk-road",
    areaId: "tonk-road",
    name: "Sanganer Extension",
    city: "Jaipur",
    marketPosition: "Rising Fast",
    entryLevel: "Moderate",
    demand: "Growing",
    newDevelopment: "High",
    newSupply: "High",
    connectivity: "Good",
    futurePotential: "Very Strong",

    projects: [],

    growthDrivers: [
      {
        name: "Jaipur Metro Phase 2",
        type: "Metro",
        status: "Approved",
        impact: "Very High",
        description:
          "The approved Metro Phase 2 corridor strengthens the long-term connectivity outlook for the southern Jaipur growth belt, including Tonk Road and the Sitapura side.",
        source: "Press Information Bureau, Government of India",
        lastChecked: "2026-08",
      },
      {
        name: "Tonk Road Model Corridor",
        type: "Road",
        status: "Under Construction",
        impact: "High",
        description:
          "The planned model corridor toward Sanganer includes junction redesign, traffic management, pedestrian improvements and better road organisation.",
        source: "City of Jaipur / JMC / JDA reporting",
        lastChecked: "2026-08",
      },
      {
        name: "Residential Expansion",
        type: "Residential",
        status: "Expanding",
        impact: "High",
        description:
          "Sanganer Extension is part of the outward residential expansion of southern Jaipur, making new housing supply and infrastructure quality important signals for future demand.",
        source: "PropertyHub market tracking",
        lastChecked: "2026-08",
      },
    ],
    developmentReasons: [
      "Residential expansion is increasing housing supply in the southern Jaipur belt.",
      "Tonk Road connectivity improvements can improve accessibility.",
      "Metro Phase 2 strengthens the long-term connectivity outlook.",
      "Sanganer provides an established market ecosystem nearby.",
    ],

    outlook:
      "Sanganer Extension represents a more development-led opportunity than established Sanganer locations, with potential for long-term growth as new residential pockets mature.",
  },

  {
    id: "muhana-tonk-road",
    areaId: "tonk-road",
    name: "Muhana Side",
    city: "Jaipur",
    marketPosition: "Early Opportunity",
    entryLevel: "Early",
    demand: "Growing",
    newDevelopment: "High",
    newSupply: "High",
    connectivity: "Improving",
    futurePotential: "Very Strong",

    projects: [],

    growthDrivers: [
      {
        name: "Southern Jaipur Metro Connectivity",
        type: "Metro",
        status: "Approved",
        impact: "High",
        description:
          "Jaipur Metro Phase 2 is expected to strengthen connectivity across the southern Jaipur growth belt, improving access toward Tonk Road, Sitapura and the airport.",
        source: "Press Information Bureau, Government of India",
        lastChecked: "2026-08",
      },
      {
        name: "Tonk Road Connectivity",
        type: "Road",
        status: "Under Construction",
        impact: "High",
        description:
          "Ongoing corridor-level road and traffic improvements on Tonk Road can strengthen accessibility across the wider southern growth belt.",
        source: "JMC / JDA reporting",
        lastChecked: "2026-08",
      },
      {
        name: "Residential Expansion",
        type: "Residential",
        status: "Expanding",
        impact: "High",
        description:
          "Muhana Side is being tracked as an earlier-stage residential expansion pocket where new housing supply and improving infrastructure can influence long-term demand.",
        source: "PropertyHub market tracking",
        lastChecked: "2026-08",
      },
    ],
    developmentReasons: [
      "Residential development is expanding into the wider southern growth belt.",
      "Improving road connectivity can support long-term accessibility.",
      "The pocket has an earlier-stage growth profile compared with established markets.",
      "Future infrastructure and new housing supply are important signals to monitor.",
    ],

    outlook:
      "Muhana Side is better viewed as a future-growth opportunity rather than a mature premium market. Investors should evaluate approvals, infrastructure and exact location before entering.",
  },

  {
    id: "mahindra-world-city-ajmer-road",
    areaId: "ajmer-road",
    name: "Mahindra World City",
    city: "Jaipur",
    marketPosition: "Rising Fast",
    entryLevel: "Moderate",
    demand: "Strong",
    newDevelopment: "High",
    newSupply: "High",
    connectivity: "Good",
    futurePotential: "Very Strong",

    projects: [],

    growthDrivers: [
      {
        name: "Mahindra World City Jaipur",
        type: "Industrial",
        status: "Operational",
        impact: "Very High",
        description:
          "Mahindra World City Jaipur is a large integrated business and industrial ecosystem with a multi-sector SEZ and supporting infrastructure, creating a major long-term employment and development anchor.",
        source: "Mahindra Lifespaces",
        lastChecked: "2026-08",
      },
      {
        name: "Ajmer Road / NH-48 Connectivity",
        type: "Road",
        status: "Operational",
        impact: "Very High",
        description:
          "Mahindra World City Jaipur is located off NH-48, providing strategic road connectivity toward Jaipur and the wider regional industrial network.",
        source: "Mahindra Lifespaces",
        lastChecked: "2026-08",
      },
      {
        name: "Industrial & Employment Ecosystem",
        type: "Employment",
        status: "Operational",
        impact: "Very High",
        description:
          "The established business and industrial ecosystem creates an employment base that can support recurring residential, rental and service demand in surrounding Ajmer Road locations.",
        source: "Mahindra Lifespaces",
        lastChecked: "2026-08",
      },
      {
        name: "Ring Road Connectivity",
        type: "Road",
        status: "Operational",
        impact: "High",
        description:
          "Regional road connectivity improves access between the Ajmer Road growth corridor and other parts of Jaipur.",
        source: "Mahindra Lifespaces",
        lastChecked: "2026-08",
      },
      {
        name: "Residential Development",
        type: "Residential",
        status: "Expanding",
        impact: "High",
        description:
          "The expansion of employment and supporting infrastructure can strengthen residential demand in surrounding Ajmer Road locations.",
        source: "PropertyHub market tracking",
        lastChecked: "2026-08",
      },
      {
        name: "Commercial Development",
        type: "Commercial",
        status: "Expanding",
        impact: "High",
        description:
          "Growing business activity can support the expansion of commercial services and supporting retail infrastructure around the wider corridor.",
        source: "PropertyHub market tracking",
        lastChecked: "2026-08",
      },
    ],

    developmentReasons: [
      "Mahindra World City provides a major employment and industrial anchor.",
      "NH-48 connectivity supports regional movement and business access.",
      "The integrated development creates a long-term ecosystem around the corridor.",
      "Employment growth can support residential and rental demand in nearby locations.",
      "Commercial and supporting infrastructure can expand alongside the employment base.",
    ],

    outlook:
      "Mahindra World City is a major long-term growth anchor on Jaipur's Ajmer Road side. Investors should evaluate surrounding residential locations where employment, connectivity and new development are translating into sustained demand.",
  },

  {
    id: "mahapura-ajmer-road",
    areaId: "ajmer-road",
    name: "Mahapura",
    city: "Jaipur",
    marketPosition: "Rising Fast",
    entryLevel: "Moderate",
    demand: "Strong",
    newDevelopment: "High",
    newSupply: "High",
    connectivity: "Good",
    futurePotential: "Very Strong",

    projects: [],

    growthDrivers: [
      {
        name: "Mahindra World City Employment Ecosystem",
        type: "Employment",
        status: "Operational",
        impact: "Very High",
        description:
          "The established Mahindra World City business and industrial ecosystem provides a major employment anchor for the wider Ajmer Road growth corridor.",
        source: "Mahindra Lifespaces",
        lastChecked: "2026-08",
      },
      {
        name: "Ajmer Road / NH-48 Connectivity",
        type: "Road",
        status: "Operational",
        impact: "Very High",
        description:
          "Mahapura benefits from its position along the wider Ajmer Road and NH-48 connectivity network, supporting access toward Jaipur and the regional growth corridor.",
        source: "Mahindra Lifespaces / NH-48 corridor information",
        lastChecked: "2026-08",
      },
      {
        name: "Residential Expansion",
        type: "Residential",
        status: "Expanding",
        impact: "High",
        description:
          "Residential development around Mahapura is expanding the housing base along the Ajmer Road corridor and is an important signal for future demand.",
        source: "PropertyHub market tracking",
        lastChecked: "2026-08",
      },
    ],

    developmentReasons: [
      "Proximity to the wider Ajmer Road employment ecosystem supports residential demand.",
      "NH-48 connectivity strengthens access to Jaipur and regional employment centres.",
      "New residential supply is expanding across the corridor.",
      "Mahapura remains a development-led pocket where project quality and exact location matter.",
    ],

    outlook:
      "Mahapura is a development-led Ajmer Road pocket supported by corridor connectivity, employment anchors and expanding residential supply. Investors should compare project quality, access roads and surrounding development before entering.",
  },

  {
    id: "bagru-ajmer-road",
    areaId: "ajmer-road",
    name: "Bagru",
    city: "Jaipur",
    marketPosition: "Early Opportunity",
    entryLevel: "Moderate",
    demand: "Growing",
    newDevelopment: "Medium",
    newSupply: "Medium",
    connectivity: "Good",
    futurePotential: "Strong",

    projects: [],

    growthDrivers: [
      {
        name: "Ajmer Road / NH-48 Connectivity",
        type: "Road",
        status: "Operational",
        impact: "High",
        description:
          "Bagru benefits from its position on the Ajmer Road and NH-48 corridor, connecting the western Jaipur growth belt with Jaipur city and regional markets.",
        source: "NHAI / NH-48 corridor information",
        lastChecked: "2026-08",
      },
      {
        name: "Western Jaipur Residential Expansion",
        type: "Residential",
        status: "Expanding",
        impact: "High",
        description:
          "Expansion of residential development along the western Jaipur corridor can gradually strengthen housing demand around Bagru and nearby Ajmer Road locations.",
        source: "PropertyHub market tracking",
        lastChecked: "2026-08",
      },
      {
        name: "Industrial & Local Employment Activity",
        type: "Employment",
        status: "Expanding",
        impact: "Medium",
        description:
          "Industrial and local business activity around the western corridor can support employment-linked housing and rental demand over time.",
        source: "PropertyHub market tracking",
        lastChecked: "2026-08",
      },
    ],

    developmentReasons: [
      "Direct access to the Ajmer Road and NH-48 corridor supports regional connectivity.",
      "Western Jaipur development is gradually expanding toward the Bagru side.",
      "Residential and supporting commercial activity can increase as the corridor matures.",
      "Bagru offers a comparatively accessible entry point within the wider Ajmer Road growth belt.",
    ],

    outlook:
      "Bagru is an emerging western Ajmer Road pocket where connectivity and gradual corridor expansion provide the main long-term investment signals. Investors should focus on exact location, access roads and the pace of surrounding development.",
  },

  {
    id: "bhankrota-ajmer-road",
    areaId: "ajmer-road",
    name: "Bhankrota",
    city: "Jaipur",
    marketPosition: "Rising Fast",
    entryLevel: "Moderate",
    demand: "Strong",
    newDevelopment: "High",
    newSupply: "High",
    connectivity: "Excellent",
    futurePotential: "Very Strong",

    projects: [],

    growthDrivers: [
      {
        name: "Ajmer Road / NH-48 Connectivity",
        type: "Road",
        status: "Operational",
        impact: "Very High",
        description:
          "Bhankrota sits on the Ajmer Road and NH-48 corridor, providing an important western connectivity link between Jaipur and the wider regional growth belt.",
        source: "NHAI / NH-48 corridor information",
        lastChecked: "2026-08",
      },
      {
        name: "Bhankrota Interchange Connectivity",
        type: "Road",
        status: "Operational",
        impact: "High",
        description:
          "The Bhankrota interchange improves movement between the Ajmer Road corridor and the wider road network, strengthening accessibility for surrounding development.",
        source: "NHAI",
        lastChecked: "2026-08",
      },
      {
        name: "Residential Expansion",
        type: "Residential",
        status: "Expanding",
        impact: "High",
        description:
          "Residential development along the western Jaipur corridor is expanding the housing base around Bhankrota and nearby Ajmer Road locations.",
        source: "PropertyHub market tracking",
        lastChecked: "2026-08",
      },
    ],

    developmentReasons: [
      "Direct position on the Ajmer Road and NH-48 corridor supports regional connectivity.",
      "Interchange connectivity improves access to the wider western Jaipur road network.",
      "Residential supply is expanding along the Ajmer Road growth belt.",
      "Bhankrota benefits from its position between established Jaipur markets and emerging western development.",
    ],

    outlook:
      "Bhankrota is a connectivity-led Ajmer Road pocket with expanding residential activity. Its long-term potential depends on continued corridor development, access quality and the pace at which surrounding projects mature.",
  },

  {
    id: "patrakar-colony-mansarovar-extension",
    areaId: "mansarovar-extension",
    name: "Patrakar Colony",
    city: "Jaipur",
    marketPosition: "Established",
    entryLevel: "High",
    demand: "Very Strong",
    newDevelopment: "Medium",
    newSupply: "Medium",
    connectivity: "Excellent",
    futurePotential: "Strong",

    projects: [],

    growthDrivers: [
      {
        name: "Established Residential Ecosystem",
        type: "Residential",
        status: "Operational",
        impact: "Very High",
        description:
          "Patrakar Colony benefits from an established residential environment with supporting neighbourhood services and an existing end-user base.",
        source: "PropertyHub market tracking",
        lastChecked: "2026-08",
      },
      {
        name: "New Sanganer Road Connectivity",
        type: "Road",
        status: "Operational",
        impact: "High",
        description:
          "Connectivity through the New Sanganer Road network supports access toward Mansarovar, Sanganer and other major Jaipur residential areas.",
        source: "PropertyHub market tracking",
        lastChecked: "2026-08",
      },
      {
        name: "Neighbourhood Commercial Activity",
        type: "Commercial",
        status: "Expanding",
        impact: "High",
        description:
          "The established residential catchment supports retail, services and everyday commercial activity around the locality.",
        source: "PropertyHub market tracking",
        lastChecked: "2026-08",
      },
    ],

    developmentReasons: [
      "Established residential demand provides a strong end-user base.",
      "New Sanganer Road connectivity supports movement across southern Jaipur.",
      "Neighbourhood commercial activity strengthens everyday livability.",
      "Location quality and established demand remain important investment signals.",
    ],

    outlook:
      "Patrakar Colony is an established Mansarovar Extension pocket with strong end-user demand. Investors should focus on property quality, exact micro-location and rental or resale potential.",
  },

  {
    id: "muhana-mandi-mansarovar-extension",
    areaId: "mansarovar-extension",
    name: "Muhana Mandi",
    city: "Jaipur",
    marketPosition: "Rising Fast",
    entryLevel: "Moderate",
    demand: "Strong",
    newDevelopment: "High",
    newSupply: "High",
    connectivity: "Good",
    futurePotential: "Very Strong",

    projects: [],

    growthDrivers: [
      {
        name: "Muhana Mandi Activity",
        type: "Market",
        status: "Operational",
        impact: "High",
        description:
          "The established mandi and trading ecosystem provides an important economic activity anchor for the surrounding area.",
        source: "PropertyHub market tracking",
        lastChecked: "2026-08",
      },
      {
        name: "Residential Expansion",
        type: "Residential",
        status: "Expanding",
        impact: "Very High",
        description:
          "Residential development around the Muhana side is expanding as Jaipur's south-western urban footprint grows.",
        source: "PropertyHub market tracking",
        lastChecked: "2026-08",
      },
      {
        name: "Road Connectivity",
        type: "Road",
        status: "Operational",
        impact: "High",
        description:
          "Road connectivity toward Mansarovar, Muhana and the wider Ring Road ecosystem supports movement for residents and businesses.",
        source: "PropertyHub market tracking",
        lastChecked: "2026-08",
      },
    ],

    developmentReasons: [
      "Muhana Mandi provides an established economic activity anchor.",
      "Residential development is expanding around the south-western Jaipur belt.",
      "Road connectivity supports access to Mansarovar and surrounding growth corridors.",
      "Market activity and housing expansion can support long-term demand.",
    ],

    outlook:
      "Muhana Mandi represents a rising Mansarovar Extension pocket where market activity and residential expansion create long-term growth signals. Investors should evaluate exact access, surrounding land use and project quality carefully.",
  },
  {
    id: "gandhi-path-west-vaishali-extension",
    areaId: "vaishali-nagar-extension",
    name: "Gandhi Path West",
    city: "Jaipur",
    marketPosition: "Rising Fast",
    entryLevel: "High",
    demand: "Strong",
    newDevelopment: "High",
    newSupply: "High",
    connectivity: "Excellent",
    futurePotential: "Very Strong",

    projects: [],

    growthDrivers: [
      {
        name: "Gandhi Path West Connectivity",
        type: "Road",
        status: "Operational",
        impact: "Very High",
        description:
          "Gandhi Path West provides an important connectivity spine linking the expanding western residential belt with established Jaipur markets.",
        source: "PropertyHub market tracking",
        lastChecked: "2026-08",
      },
      {
        name: "Residential Expansion",
        type: "Residential",
        status: "Expanding",
        impact: "Very High",
        description:
          "Residential development is expanding around the western Vaishali Nagar belt as the urban footprint moves toward newer housing pockets.",
        source: "PropertyHub market tracking",
        lastChecked: "2026-08",
      },
      {
        name: "Neighbourhood Commercial Activity",
        type: "Commercial",
        status: "Expanding",
        impact: "High",
        description:
          "Growing residential catchment is supporting shops, services and everyday commercial activity along the Gandhi Path West side.",
        source: "PropertyHub market tracking",
        lastChecked: "2026-08",
      },
    ],

    developmentReasons: [
      "Strong connectivity supports access to established western Jaipur markets.",
      "Residential supply is expanding across the western extension belt.",
      "Growing neighbourhood commerce supports end-user livability.",
    ],

    outlook:
      "Gandhi Path West is a strong western Jaipur growth pocket where connectivity, residential expansion and improving commercial activity support long-term investment potential.",
  },

  {
    id: "meenawala-vaishali-extension",
    areaId: "vaishali-nagar-extension",
    name: "Meenawala",
    city: "Jaipur",
    marketPosition: "Rising Fast",
    entryLevel: "Moderate",
    demand: "Strong",
    newDevelopment: "High",
    newSupply: "High",
    connectivity: "Good",
    futurePotential: "Very Strong",

    projects: [],

    growthDrivers: [
      {
        name: "Sirsi Road Access",
        type: "Road",
        status: "Operational",
        impact: "High",
        description:
          "Access toward the Sirsi Road corridor connects Meenawala with established western Jaipur residential and commercial zones.",
        source: "PropertyHub market tracking",
        lastChecked: "2026-08",
      },
      {
        name: "Residential Development",
        type: "Residential",
        status: "Expanding",
        impact: "Very High",
        description:
          "New housing and plotted development around the Meenawala side are strengthening the residential base of the western extension.",
        source: "PropertyHub market tracking",
        lastChecked: "2026-08",
      },
      {
        name: "Emerging Local Commerce",
        type: "Commercial",
        status: "Expanding",
        impact: "High",
        description:
          "Increasing residential density is creating demand for local retail, services and everyday commercial uses.",
        source: "PropertyHub market tracking",
        lastChecked: "2026-08",
      },
    ],

    developmentReasons: [
      "Good access to the Sirsi Road growth corridor.",
      "Residential development is increasing around the Meenawala side.",
      "Growing local commerce can strengthen long-term end-user demand.",
    ],

    outlook:
      "Meenawala represents an expanding western Jaipur residential pocket where Sirsi Road access and new housing supply provide the main long-term growth signals.",
  },

  {
    id: "panchyawala-vaishali-extension",
    areaId: "vaishali-nagar-extension",
    name: "Panchyawala",
    city: "Jaipur",
    marketPosition: "Rising Fast",
    entryLevel: "Moderate",
    demand: "Growing",
    newDevelopment: "High",
    newSupply: "High",
    connectivity: "Good",
    futurePotential: "Strong",

    projects: [],

    growthDrivers: [
      {
        name: "Western Connectivity",
        type: "Road",
        status: "Operational",
        impact: "High",
        description:
          "Road connectivity around Panchyawala provides access toward Vaishali Nagar, Sirsi Road and the wider western Jaipur network.",
        source: "PropertyHub market tracking",
        lastChecked: "2026-08",
      },
      {
        name: "New Residential Supply",
        type: "Residential",
        status: "Expanding",
        impact: "High",
        description:
          "New residential projects and plotted development are gradually increasing housing supply around Panchyawala.",
        source: "PropertyHub market tracking",
        lastChecked: "2026-08",
      },
      {
        name: "Local Market Growth",
        type: "Market",
        status: "Expanding",
        impact: "Medium",
        description:
          "Growing residential activity is supporting the development of local markets and everyday services around the Panchyawala pocket.",
        source: "PropertyHub market tracking",
        lastChecked: "2026-08",
      },
    ],

    developmentReasons: [
      "Connectivity links Panchyawala with major western Jaipur corridors.",
      "New residential supply is expanding the local housing base.",
      "Growing local market activity can support future end-user demand.",
    ],

    outlook:
      "Panchyawala is an emerging western Jaipur residential pocket where connectivity and expanding housing supply create a positive medium-to-long-term investment outlook.",
  },
  {
    id: "kanota-agra-road",
    areaId: "agra-road",
    name: "Kanota",
    city: "Jaipur",
    marketPosition: "Early Opportunity",
    entryLevel: "Moderate",
    demand: "Growing",
    newDevelopment: "Medium",
    newSupply: "High",
    connectivity: "Improving",
    futurePotential: "Strong",

    projects: [],

    growthDrivers: [
      {
        name: "Agra Road Connectivity",
        type: "Road",
        status: "Operational",
        impact: "High",
        description:
          "Kanota benefits from its position along the Agra Road corridor, supporting access toward Jaipur and the wider eastern growth belt.",
        source: "PropertyHub market tracking",
        lastChecked: "2026-08",
      },
      {
        name: "Residential Expansion",
        type: "Residential",
        status: "Expanding",
        impact: "High",
        description:
          "Residential development around Kanota is gradually expanding the housing base along the eastern Jaipur corridor.",
        source: "PropertyHub market tracking",
        lastChecked: "2026-08",
      },
      {
        name: "Local Market Activity",
        type: "Market",
        status: "Operational",
        impact: "Medium",
        description:
          "Established local activity around Kanota supports everyday retail and services for the surrounding residential catchment.",
        source: "PropertyHub market tracking",
        lastChecked: "2026-08",
      },
    ],

    developmentReasons: [
      "Agra Road connectivity supports access toward Jaipur and the eastern growth belt.",
      "Residential supply is gradually expanding around Kanota.",
      "Existing local activity supports everyday end-user requirements.",
    ],

    outlook:
      "Kanota is an emerging Agra Road pocket where improving connectivity, residential expansion and established local activity provide moderate-to-strong long-term growth signals.",
  },

  {
    id: "heerawala-agra-road",
    areaId: "agra-road",
    name: "Heerawala",
    city: "Jaipur",
    marketPosition: "Early Opportunity",
    entryLevel: "Moderate",
    demand: "Growing",
    newDevelopment: "High",
    newSupply: "High",
    connectivity: "Improving",
    futurePotential: "Strong",

    projects: [],

    growthDrivers: [
      {
        name: "Industrial & Employment Activity",
        type: "Industrial",
        status: "Operational",
        impact: "High",
        description:
          "Industrial activity around the Heerawala side provides an employment anchor that can support surrounding housing and service demand.",
        source: "PropertyHub market tracking",
        lastChecked: "2026-08",
      },
      {
        name: "Agra Road Connectivity",
        type: "Road",
        status: "Operational",
        impact: "High",
        description:
          "Heerawala benefits from access to the Agra Road corridor and the wider eastern Jaipur road network.",
        source: "PropertyHub market tracking",
        lastChecked: "2026-08",
      },
      {
        name: "Residential Expansion",
        type: "Residential",
        status: "Expanding",
        impact: "High",
        description:
          "New residential development around the eastern corridor is gradually increasing the housing supply near employment and transport nodes.",
        source: "PropertyHub market tracking",
        lastChecked: "2026-08",
      },
    ],

    developmentReasons: [
      "Industrial activity creates an employment-linked demand base.",
      "Agra Road access supports movement across the eastern Jaipur corridor.",
      "New residential supply is developing around employment and connectivity anchors.",
    ],

    outlook:
      "Heerawala represents an emerging Agra Road pocket where industrial activity, improving connectivity and residential expansion create a positive medium-to-long-term investment outlook.",
  },

  {
    id: "goner-agra-road",
    areaId: "agra-road",
    name: "Goner",
    city: "Jaipur",
    marketPosition: "Early Opportunity",
    entryLevel: "Moderate",
    demand: "Growing",
    newDevelopment: "High",
    newSupply: "High",
    connectivity: "Improving",
    futurePotential: "Strong",

    projects: [],

    growthDrivers: [
      {
        name: "Ring Road Connectivity",
        type: "Road",
        status: "Operational",
        impact: "High",
        description:
          "Connectivity toward Jaipur's Ring Road network strengthens access between the eastern growth belt and other major city corridors.",
        source: "PropertyHub market tracking",
        lastChecked: "2026-08",
      },
      {
        name: "Residential Expansion",
        type: "Residential",
        status: "Expanding",
        impact: "High",
        description:
          "Residential development is gradually expanding around the Goner side as Jaipur's eastern urban footprint grows.",
        source: "PropertyHub market tracking",
        lastChecked: "2026-08",
      },
      {
        name: "Road Corridor Development",
        type: "Road",
        status: "Expanding",
        impact: "Medium",
        description:
          "Improving road infrastructure can strengthen accessibility and support future development around the Goner pocket.",
        source: "PropertyHub market tracking",
        lastChecked: "2026-08",
      },
    ],

    developmentReasons: [
      "Ring Road connectivity can improve access to wider Jaipur corridors.",
      "Residential development is expanding across the eastern growth belt.",
      "Improving road infrastructure supports longer-term accessibility.",
    ],

    outlook:
      "Goner is an early-stage Agra Road growth pocket where improving connectivity and residential expansion provide the main long-term investment signals.",
  },
  {
    id: "vatika-vatika-road",
    areaId: "vatika-road",
    name: "Vatika",
    city: "Jaipur",
    marketPosition: "Rising Fast",
    entryLevel: "Moderate",
    demand: "Strong",
    newDevelopment: "High",
    newSupply: "High",
    connectivity: "Good",
    futurePotential: "Very Strong",

    projects: [],

    growthDrivers: [
      {
        name: "Vatika Township Development",
        type: "Residential",
        status: "Expanding",
        impact: "Very High",
        description:
          "Large-scale township and residential development around Vatika is expanding the southern Jaipur housing base and creating a stronger long-term residential ecosystem.",
        source: "PropertyHub market tracking",
        lastChecked: "2026-08",
      },
      {
        name: "Vatika Road Connectivity",
        type: "Road",
        status: "Operational",
        impact: "High",
        description:
          "Vatika Road provides access toward Tonk Road, Ring Road and the wider southern Jaipur growth network.",
        source: "PropertyHub market tracking",
        lastChecked: "2026-08",
      },
      {
        name: "New Residential Supply",
        type: "Residential",
        status: "Expanding",
        impact: "Very High",
        description:
          "New housing and plotted development are increasing residential supply across the Vatika side of southern Jaipur.",
        source: "PropertyHub market tracking",
        lastChecked: "2026-08",
      },
      {
        name: "Neighbourhood Commercial Growth",
        type: "Commercial",
        status: "Expanding",
        impact: "High",
        description:
          "Increasing residential density is supporting retail, services and everyday commercial activity around the growing Vatika residential catchment.",
        source: "PropertyHub market tracking",
        lastChecked: "2026-08",
      },
    ],

    developmentReasons: [
      "Large-scale residential development is expanding the southern Jaipur housing base.",
      "Vatika Road provides access toward major southern Jaipur corridors.",
      "Growing residential density is supporting local commercial activity.",
      "New supply creates opportunities across multiple housing and plotted formats.",
    ],

    outlook:
      "Vatika is a development-led southern Jaipur growth pocket where township expansion, new residential supply and improving connectivity create strong long-term investment potential.",
  },

  {
    id: "shivdaspura-vatika-road",
    areaId: "vatika-road",
    name: "Shivdaspura",
    city: "Jaipur",
    marketPosition: "Early Opportunity",
    entryLevel: "Early",
    demand: "Growing",
    newDevelopment: "High",
    newSupply: "High",
    connectivity: "Improving",
    futurePotential: "Very Strong",

    projects: [],

    growthDrivers: [
      {
        name: "Ring Road Connectivity",
        type: "Road",
        status: "Operational",
        impact: "Very High",
        description:
          "Shivdaspura benefits from connectivity toward Jaipur Ring Road and the wider southern growth network, improving its strategic position for future development.",
        source: "PropertyHub market tracking",
        lastChecked: "2026-08",
      },
      {
        name: "Southern Jaipur Expansion",
        type: "Residential",
        status: "Expanding",
        impact: "High",
        description:
          "The outward expansion of Jaipur's southern urban footprint is increasing development interest and residential supply around the Shivdaspura side.",
        source: "PropertyHub market tracking",
        lastChecked: "2026-08",
      },
      {
        name: "Industrial & Employment Activity",
        type: "Employment",
        status: "Expanding",
        impact: "High",
        description:
          "Growing industrial and employment activity across the southern Jaipur corridor can support future housing and rental demand.",
        source: "PropertyHub market tracking",
        lastChecked: "2026-08",
      },
    ],

    developmentReasons: [
      "Ring Road connectivity improves the strategic position of the Shivdaspura pocket.",
      "Southern Jaipur's urban footprint is expanding toward the area.",
      "Industrial and employment activity can support future residential demand.",
      "The pocket remains relatively early-stage compared with established Jaipur markets.",
    ],

    outlook:
      "Shivdaspura is an early-stage southern Jaipur opportunity where Ring Road connectivity, urban expansion and employment activity create potentially strong long-term growth signals.",
  },

  {
    id: "chandlai-vatika-road",
    areaId: "vatika-road",
    name: "Chandlai",
    city: "Jaipur",
    marketPosition: "Early Opportunity",
    entryLevel: "Early",
    demand: "Growing",
    newDevelopment: "Medium",
    newSupply: "Medium",
    connectivity: "Improving",
    futurePotential: "Strong",

    projects: [],

    growthDrivers: [
      {
        name: "Vatika Road Connectivity",
        type: "Road",
        status: "Operational",
        impact: "High",
        description:
          "Chandlai benefits from access toward the Vatika Road and southern Jaipur road network, supporting future movement and development potential.",
        source: "PropertyHub market tracking",
        lastChecked: "2026-08",
      },
      {
        name: "Southern Residential Expansion",
        type: "Residential",
        status: "Expanding",
        impact: "High",
        description:
          "Residential development is gradually extending into southern Jaipur's outer growth pockets, increasing the potential housing catchment around Chandlai.",
        source: "PropertyHub market tracking",
        lastChecked: "2026-08",
      },
      {
        name: "Emerging Local Activity",
        type: "Commercial",
        status: "Expanding",
        impact: "Medium",
        description:
          "As residential activity increases, local retail and everyday services can gradually develop around the Chandlai pocket.",
        source: "PropertyHub market tracking",
        lastChecked: "2026-08",
      },
    ],

    developmentReasons: [
      "Access to the southern Jaipur road network supports future connectivity.",
      "Residential expansion is gradually moving toward outer southern pockets.",
      "Early-stage entry can provide greater upside if surrounding development accelerates.",
    ],

    outlook:
      "Chandlai is an early-stage Vatika Road pocket where improving connectivity and gradual residential expansion provide the main long-term investment signals.",
  },
  {
    id: "mahal-road-diggi",
    areaId: "diggi-road",
    name: "Mahal Road",
    city: "Jaipur",
    marketPosition: "Growing but Expensive",
    entryLevel: "High",
    demand: "Strong",
    newDevelopment: "High",
    newSupply: "Medium",
    connectivity: "Excellent",
    futurePotential: "Very Strong",

    projects: [],

    growthDrivers: [
      {
        name: "Mahal Road Connectivity",
        type: "Road",
        status: "Operational",
        impact: "Very High",
        description:
          "Mahal Road provides an important southern Jaipur connection linking established residential areas with Jagatpura, airport-side and emerging growth corridors.",
        source: "PropertyHub market tracking",
        lastChecked: "2026-08",
      },
      {
        name: "Established Residential Demand",
        type: "Residential",
        status: "Operational",
        impact: "Very High",
        description:
          "The established residential catchment around Mahal Road supports consistent end-user demand and strengthens the area's long-term housing market.",
        source: "PropertyHub market tracking",
        lastChecked: "2026-08",
      },
      {
        name: "Commercial & Institutional Activity",
        type: "Commercial",
        status: "Expanding",
        impact: "High",
        description:
          "Growing residential and institutional activity supports retail, services and everyday commercial demand around the Mahal Road corridor.",
        source: "PropertyHub market tracking",
        lastChecked: "2026-08",
      },
    ],

    developmentReasons: [
      "Excellent connectivity links Mahal Road with major southern Jaipur growth corridors.",
      "Established residential demand provides a stronger end-user base.",
      "Commercial and institutional activity supports long-term livability.",
      "Limited relative new supply can support value in well-located projects.",
    ],

    outlook:
      "Mahal Road is a relatively established Diggi Road-side pocket where strong residential demand, connectivity and supporting commercial activity create a durable investment outlook.",
  },

  {
    id: "jagatpura-extension-diggi",
    areaId: "diggi-road",
    name: "Jagatpura Extension",
    city: "Jaipur",
    marketPosition: "Rising Fast",
    entryLevel: "Moderate",
    demand: "Strong",
    newDevelopment: "High",
    newSupply: "High",
    connectivity: "Good",
    futurePotential: "Very Strong",

    projects: [],

    growthDrivers: [
      {
        name: "Jagatpura Connectivity",
        type: "Road",
        status: "Operational",
        impact: "High",
        description:
          "Connectivity toward Jagatpura provides access to established residential areas, employment centres and the wider southern Jaipur road network.",
        source: "PropertyHub market tracking",
        lastChecked: "2026-08",
      },
      {
        name: "Residential Expansion",
        type: "Residential",
        status: "Expanding",
        impact: "Very High",
        description:
          "New housing and plotted development are expanding across the Jagatpura extension side, increasing residential supply and future demand potential.",
        source: "PropertyHub market tracking",
        lastChecked: "2026-08",
      },
      {
        name: "Employment & Education Ecosystem",
        type: "Education",
        status: "Operational",
        impact: "High",
        description:
          "The wider Jagatpura ecosystem of institutions, workplaces and supporting services creates recurring end-user and rental demand.",
        source: "PropertyHub market tracking",
        lastChecked: "2026-08",
      },
    ],

    developmentReasons: [
      "Jagatpura connectivity strengthens access to southern Jaipur employment and residential markets.",
      "New residential supply is expanding the housing base.",
      "Education and employment activity supports recurring housing demand.",
      "The extension remains development-led with room for further urban expansion.",
    ],

    outlook:
      "Jagatpura Extension is a development-led southern Jaipur pocket where residential expansion, connectivity and the established Jagatpura ecosystem support strong medium-to-long-term investment potential.",
  },

  {
    id: "diggi-sanganer-junction",
    areaId: "diggi-road",
    name: "Diggi Road–Sanganer Junction",
    city: "Jaipur",
    marketPosition: "Early Opportunity",
    entryLevel: "Moderate",
    demand: "Growing",
    newDevelopment: "High",
    newSupply: "High",
    connectivity: "Improving",
    futurePotential: "Strong",

    projects: [],

    growthDrivers: [
      {
        name: "Diggi Road Connectivity",
        type: "Road",
        status: "Operational",
        impact: "High",
        description:
          "The Diggi Road corridor provides an important connection between southern Jaipur residential areas and the Sanganer-side growth network.",
        source: "PropertyHub market tracking",
        lastChecked: "2026-08",
      },
      {
        name: "Sanganer Growth Catchment",
        type: "Residential",
        status: "Expanding",
        impact: "High",
        description:
          "The wider Sanganer catchment supports continued residential expansion and creates additional demand for housing and local services around connecting corridors.",
        source: "PropertyHub market tracking",
        lastChecked: "2026-08",
      },
      {
        name: "Local Commercial Development",
        type: "Commercial",
        status: "Expanding",
        impact: "Medium",
        description:
          "Increasing residential activity along the connecting corridor can gradually support neighbourhood retail and everyday services.",
        source: "PropertyHub market tracking",
        lastChecked: "2026-08",
      },
    ],

    developmentReasons: [
      "The corridor connects southern Jaipur residential areas with the Sanganer-side network.",
      "Sanganer's established market catchment supports future demand.",
      "New residential supply is increasing across surrounding growth pockets.",
      "Early-stage locations can offer higher upside if connectivity and development accelerate.",
    ],

    outlook:
      "The Diggi Road–Sanganer Junction pocket is an emerging southern Jaipur opportunity where corridor connectivity, Sanganer demand and expanding residential supply provide the main long-term growth signals.",
  },

  {
    id: "muhana-ring-road",
    areaId: "ring-road-growth-belt",
    name: "Muhana Ring Road",
    city: "Jaipur",
    marketPosition: "Rising Fast",
    entryLevel: "Moderate",
    demand: "Growing",
    newDevelopment: "High",
    newSupply: "High",
    connectivity: "Excellent",
    futurePotential: "Very Strong",

    projects: [],

    growthDrivers: [
      {
        name: "Ring Road Connectivity",
        type: "Road",
        status: "Operational",
        impact: "Very High",
        description:
          "Muhana benefits from access to Jaipur's Ring Road network, strengthening movement between the southern and western growth corridors.",
        source: "PropertyHub market tracking",
        lastChecked: "2026-08",
      },
      {
        name: "Residential Expansion",
        type: "Residential",
        status: "Expanding",
        impact: "High",
        description:
          "Residential colonies and plotted development around the Muhana side are expanding the housing base along the southern-western Jaipur growth belt.",
        source: "PropertyHub market tracking",
        lastChecked: "2026-08",
      },
      {
        name: "Muhana Mandi Activity",
        type: "Commercial",
        status: "Operational",
        impact: "High",
        description:
          "The established market activity around Muhana Mandi creates an economic anchor supporting surrounding residential and service demand.",
        source: "PropertyHub market tracking",
        lastChecked: "2026-08",
      },
    ],

    developmentReasons: [
      "Ring Road connectivity strengthens access across southern and western Jaipur.",
      "Residential and plotted development is expanding around the Muhana side.",
      "Muhana Mandi provides an established economic activity anchor.",
      "Growing housing supply can support future end-user and rental demand.",
    ],

    outlook:
      "Muhana Ring Road is a rising southern-western Jaipur pocket where Ring Road connectivity, market activity and residential expansion create strong medium-to-long-term investment signals.",
  },

  {
    id: "bhankrota-ring-road",
    areaId: "ring-road-growth-belt",
    name: "Bhankrota Ring Road",
    city: "Jaipur",
    marketPosition: "Rising Fast",
    entryLevel: "Moderate",
    demand: "Growing",
    newDevelopment: "High",
    newSupply: "High",
    connectivity: "Excellent",
    futurePotential: "Very Strong",

    projects: [],

    growthDrivers: [
      {
        name: "Bhankrota Interchange Connectivity",
        type: "Road",
        status: "Operational",
        impact: "Very High",
        description:
          "Bhankrota provides an important connection between the Ajmer Road corridor, Ring Road network and wider western Jaipur growth belt.",
        source: "NHAI / corridor information",
        lastChecked: "2026-08",
      },
      {
        name: "Ajmer Road–Ring Road Connectivity",
        type: "Road",
        status: "Operational",
        impact: "Very High",
        description:
          "Connectivity between Ajmer Road and Ring Road improves regional movement and strengthens the strategic position of surrounding development.",
        source: "PropertyHub market tracking",
        lastChecked: "2026-08",
      },
      {
        name: "Residential Expansion",
        type: "Residential",
        status: "Expanding",
        impact: "High",
        description:
          "New residential supply along the western Jaipur corridor is gradually expanding the housing catchment around Bhankrota.",
        source: "PropertyHub market tracking",
        lastChecked: "2026-08",
      },
    ],

    developmentReasons: [
      "Bhankrota benefits from strong Ajmer Road and Ring Road connectivity.",
      "Interchange access improves movement toward major western Jaipur corridors.",
      "Residential development is expanding around the corridor.",
      "The location connects established Jaipur markets with emerging western growth areas.",
    ],

    outlook:
      "Bhankrota Ring Road is a connectivity-led growth pocket where Ajmer Road access, Ring Road infrastructure and expanding residential supply support strong long-term potential.",
  },

  {
    id: "ajmer-road-ring-road-junction",
    areaId: "ring-road-growth-belt",
    name: "Ajmer Road–Ring Road Junction",
    city: "Jaipur",
    marketPosition: "Rising Fast",
    entryLevel: "Moderate",
    demand: "Strong",
    newDevelopment: "High",
    newSupply: "High",
    connectivity: "Excellent",
    futurePotential: "Very Strong",

    projects: [],

    growthDrivers: [
      {
        name: "Ajmer Road Connectivity",
        type: "Road",
        status: "Operational",
        impact: "Very High",
        description:
          "The Ajmer Road corridor provides a major western Jaipur transport spine connecting the city with the wider NH-48 growth network.",
        source: "NHAI / NH-48 corridor information",
        lastChecked: "2026-08",
      },
      {
        name: "Ring Road Connectivity",
        type: "Road",
        status: "Operational",
        impact: "Very High",
        description:
          "Ring Road connectivity improves cross-city movement and strengthens the junction's strategic position for future development.",
        source: "PropertyHub market tracking",
        lastChecked: "2026-08",
      },
      {
        name: "Residential & Commercial Expansion",
        type: "Commercial",
        status: "Expanding",
        impact: "High",
        description:
          "Improving regional connectivity can support residential, commercial and supporting service development around the wider junction area.",
        source: "PropertyHub market tracking",
        lastChecked: "2026-08",
      },
    ],

    developmentReasons: [
      "The junction combines two important Jaipur growth corridors.",
      "Strong road connectivity improves regional accessibility.",
      "Residential and commercial activity can expand around the transport network.",
      "The location can benefit from wider western Jaipur corridor development.",
    ],

    outlook:
      "Ajmer Road–Ring Road Junction is a strategic western Jaipur growth pocket where corridor connectivity and expanding development create strong medium-to-long-term investment potential.",
  },

  {
    id: "tonk-road-ring-road-junction",
    areaId: "ring-road-growth-belt",
    name: "Tonk Road–Ring Road Junction",
    city: "Jaipur",
    marketPosition: "Rising Fast",
    entryLevel: "Moderate",
    demand: "Strong",
    newDevelopment: "High",
    newSupply: "High",
    connectivity: "Excellent",
    futurePotential: "Very Strong",

    projects: [],

    growthDrivers: [
      {
        name: "Tonk Road Connectivity",
        type: "Road",
        status: "Operational",
        impact: "Very High",
        description:
          "Tonk Road provides an established southern Jaipur transport corridor connecting residential, commercial and employment zones.",
        source: "PropertyHub market tracking",
        lastChecked: "2026-08",
      },
      {
        name: "Ring Road Connectivity",
        type: "Road",
        status: "Operational",
        impact: "Very High",
        description:
          "Ring Road access strengthens movement between Tonk Road, southern Jaipur and other major city growth corridors.",
        source: "PropertyHub market tracking",
        lastChecked: "2026-08",
      },
      {
        name: "Southern Jaipur Expansion",
        type: "Residential",
        status: "Expanding",
        impact: "High",
        description:
          "Continued residential and infrastructure expansion across southern Jaipur can increase housing and service demand around the junction.",
        source: "PropertyHub market tracking",
        lastChecked: "2026-08",
      },
    ],

    developmentReasons: [
      "Tonk Road and Ring Road together provide strong southern Jaipur connectivity.",
      "Established residential and employment zones support underlying demand.",
      "New development continues across the wider southern growth belt.",
      "The junction provides strategic access to multiple Jaipur corridors.",
    ],

    outlook:
      "Tonk Road–Ring Road Junction is a strategic southern Jaipur pocket where established connectivity, expanding residential supply and wider corridor development support a strong long-term investment outlook.",
  },

  {
    areaId: "delhi-road",
    id: "amer-delhi-road",
    name: "Amer",
    city: "Jaipur",

    marketPosition: "Established",
    entryLevel: "Moderate",
    demand: "Growing",
    newDevelopment: "Medium",
    newSupply: "Medium",
    connectivity: "Good",
    futurePotential: "Strong",

    projects: [],

    growthDrivers: [
      {
        name: "Delhi Road Connectivity",
        type: "Road",
        status: "Operational",
        impact: "High",
        description:
          "Amer benefits from its position on the northern Jaipur road network and access toward the Delhi Road corridor, supporting movement toward Jaipur and the wider regional belt.",
        source: "PropertyHub market tracking",
        lastChecked: "2026-08",
      },
      {
        name: "Tourism & Heritage Economy",
        type: "Commercial",
        status: "Operational",
        impact: "High",
        description:
          "Amer's established tourism and heritage ecosystem supports hospitality, services and employment activity that contributes to the wider local economic base.",
        source: "PropertyHub market tracking",
        lastChecked: "2026-08",
      },
      {
        name: "Residential Expansion",
        type: "Residential",
        status: "Expanding",
        impact: "Medium",
        description:
          "Residential development around the wider Amer side can gradually expand the housing catchment as northern Jaipur continues to develop.",
        source: "PropertyHub market tracking",
        lastChecked: "2026-08",
      },
    ],

    developmentReasons: [
      "Strong heritage and tourism ecosystem supports the wider local economy.",
      "Strategic northern Jaipur connectivity provides access toward the Delhi Road corridor.",
      "Gradual residential expansion can strengthen the future housing catchment.",
    ],

    outlook:
      "Amer is an established northern Jaipur pocket where connectivity, tourism activity and gradual residential expansion provide a balanced medium-to-long-term investment outlook.",
  },

  {
    areaId: "delhi-road",
    id: "kukas-delhi-road",
    name: "Kukas",
    city: "Jaipur",

    marketPosition: "Early Opportunity",
    entryLevel: "Moderate",
    demand: "Growing",
    newDevelopment: "High",
    newSupply: "High",
    connectivity: "Good",
    futurePotential: "Very Strong",

    projects: [],

    growthDrivers: [
      {
        name: "Delhi Road Corridor",
        type: "Road",
        status: "Operational",
        impact: "High",
        description:
          "Kukas benefits from its location along the Delhi-Jaipur corridor, providing strategic access toward northern Jaipur and the wider Delhi-side growth network.",
        source: "PropertyHub market tracking",
        lastChecked: "2026-08",
      },
      {
        name: "Institutional & Hospitality Activity",
        type: "Commercial",
        status: "Operational",
        impact: "High",
        description:
          "Institutional, education, hospitality and tourism-related activity around Kukas creates an employment and service ecosystem that can support surrounding housing demand.",
        source: "PropertyHub market tracking",
        lastChecked: "2026-08",
      },
      {
        name: "Residential & Plotted Development",
        type: "Residential",
        status: "Expanding",
        impact: "High",
        description:
          "New residential and plotted development along the Kukas side can expand the housing base as the northern Jaipur corridor matures.",
        source: "PropertyHub market tracking",
        lastChecked: "2026-08",
      },
    ],

    developmentReasons: [
      "Delhi-Jaipur corridor connectivity supports long-term accessibility.",
      "Institutional and hospitality activity can support employment and housing demand.",
      "High residential and plotted development potential strengthens the growth outlook.",
    ],

    outlook:
      "Kukas is an emerging Delhi Road growth pocket where corridor connectivity, institutional activity and expanding development create strong medium-to-long-term investment potential.",
  },

  {
    areaId: "delhi-road",
    id: "kunda-delhi-road",
    name: "Kunda",
    city: "Jaipur",

    marketPosition: "Early Opportunity",
    entryLevel: "Moderate",
    demand: "Growing",
    newDevelopment: "High",
    newSupply: "High",
    connectivity: "Improving",
    futurePotential: "Strong",

    projects: [],

    growthDrivers: [
      {
        name: "Delhi Road Access",
        type: "Road",
        status: "Operational",
        impact: "High",
        description:
          "Kunda benefits from access to the Delhi Road corridor and northern Jaipur road network, supporting future movement and development potential.",
        source: "PropertyHub market tracking",
        lastChecked: "2026-08",
      },
      {
        name: "Northern Jaipur Expansion",
        type: "Residential",
        status: "Expanding",
        impact: "Medium",
        description:
          "The outward expansion of northern Jaipur can gradually increase development interest and residential demand around the Kunda side.",
        source: "PropertyHub market tracking",
        lastChecked: "2026-08",
      },
      {
        name: "New Residential Supply",
        type: "Residential",
        status: "Expanding",
        impact: "Medium",
        description:
          "Additional housing and plotted development across emerging northern Jaipur pockets can strengthen the future residential catchment around Kunda.",
        source: "PropertyHub market tracking",
        lastChecked: "2026-08",
      },
    ],

    developmentReasons: [
      "Access to the Delhi Road corridor supports future connectivity.",
      "Northern Jaipur expansion can increase development interest around Kunda.",
      "Emerging residential supply provides a long-term growth signal.",
    ],

    outlook:
      "Kunda is an emerging Delhi Road pocket where improving connectivity, northern Jaipur expansion and new residential supply provide the main long-term investment signals.",
  },



  {
    id: "murlipura-sikar-road",
    areaId: "sikar-road",
    name: "Murlipura",
    city: "Jaipur",
    marketPosition: "Established",
    entryLevel: "High",
    demand: "Strong",
    newDevelopment: "Medium",
    newSupply: "Medium",
    connectivity: "Good",
    futurePotential: "Strong",

    projects: [],

    growthDrivers: [
      {
        name: "Sikar Road Connectivity",
        type: "Road",
        status: "Operational",
        impact: "High",
        description:
          "Murlipura benefits from established access to Sikar Road and the wider northern Jaipur road network, supporting residential and commercial movement.",
        source: "PropertyHub market tracking",
        lastChecked: "2026-08",
      },
      {
        name: "Established Residential Catchment",
        type: "Residential",
        status: "Operational",
        impact: "High",
        description:
          "Murlipura has an established residential base that supports recurring end-user demand and local housing activity.",
        source: "PropertyHub market tracking",
        lastChecked: "2026-08",
      },
      {
        name: "Northern Jaipur Commercial Activity",
        type: "Commercial",
        status: "Expanding",
        impact: "Medium",
        description:
          "Growing commercial and service activity across the northern Jaipur belt can strengthen local employment, retail and housing demand.",
        source: "PropertyHub market tracking",
        lastChecked: "2026-08",
      },
    ],

    developmentReasons: [
      "Established residential demand provides a stable end-user base.",
      "Sikar Road connectivity supports movement toward northern Jaipur.",
      "Commercial and service activity can strengthen surrounding housing demand.",
    ],

    outlook:
      "Murlipura is an established Sikar Road pocket where strong residential demand, established connectivity and gradual commercial expansion support a balanced medium-to-long-term investment outlook.",
  },

  {
    id: "vidhyadhar-nagar-sikar-road",
    areaId: "sikar-road",
    name: "Vidhyadhar Nagar",
    city: "Jaipur",
    marketPosition: "Established",
    entryLevel: "Premium",
    demand: "Very Strong",
    newDevelopment: "Medium",
    newSupply: "Medium",
    connectivity: "Excellent",
    futurePotential: "Strong",

    projects: [],

    growthDrivers: [
      {
        name: "Sikar Road Connectivity",
        type: "Road",
        status: "Operational",
        impact: "Very High",
        description:
          "Vidhyadhar Nagar has strong connectivity with Sikar Road and major northern Jaipur corridors, supporting residential and commercial accessibility.",
        source: "PropertyHub market tracking",
        lastChecked: "2026-08",
      },
      {
        name: "Established Urban Ecosystem",
        type: "Residential",
        status: "Operational",
        impact: "Very High",
        description:
          "The established residential and commercial ecosystem supports sustained end-user demand, services and neighbourhood activity.",
        source: "PropertyHub market tracking",
        lastChecked: "2026-08",
      },
      {
        name: "Education & Commercial Activity",
        type: "Education",
        status: "Operational",
        impact: "High",
        description:
          "Established education, retail and service activity contributes to the area's broader residential demand and urban utility.",
        source: "PropertyHub market tracking",
        lastChecked: "2026-08",
      },
    ],

    developmentReasons: [
      "Strong urban infrastructure supports sustained end-user demand.",
      "Excellent connectivity links the area with northern and central Jaipur.",
      "Established education and commercial activity strengthens neighbourhood utility.",
    ],

    outlook:
      "Vidhyadhar Nagar is an established northern Jaipur market where strong demand, excellent connectivity and a mature urban ecosystem provide a stable long-term investment outlook.",
  },

  {
    id: "harmada-sikar-road",
    areaId: "sikar-road",
    name: "Harmada",
    city: "Jaipur",
    marketPosition: "Rising Fast",
    entryLevel: "Moderate",
    demand: "Growing",
    newDevelopment: "High",
    newSupply: "High",
    connectivity: "Improving",
    futurePotential: "Very Strong",

    projects: [],

    growthDrivers: [
      {
        name: "Sikar Road Corridor",
        type: "Road",
        status: "Operational",
        impact: "Very High",
        description:
          "Harmada benefits from its position along the Sikar Road corridor, creating strategic access toward northern Jaipur and the wider regional network.",
        source: "PropertyHub market tracking",
        lastChecked: "2026-08",
      },
      {
        name: "Northern Jaipur Expansion",
        type: "Residential",
        status: "Expanding",
        impact: "High",
        description:
          "Outward residential expansion across northern Jaipur can increase housing demand and development activity around the Harmada side.",
        source: "PropertyHub market tracking",
        lastChecked: "2026-08",
      },
      {
        name: "New Residential Supply",
        type: "Residential",
        status: "Expanding",
        impact: "High",
        description:
          "Growing plotted and residential development can expand the local housing base as the Sikar Road corridor matures.",
        source: "PropertyHub market tracking",
        lastChecked: "2026-08",
      },
    ],

    developmentReasons: [
      "Sikar Road provides strategic northern Jaipur connectivity.",
      "Residential expansion is increasing the local development catchment.",
      "New supply provides greater choice for early-stage buyers and investors.",
    ],

    outlook:
      "Harmada is a rising Sikar Road growth pocket where corridor connectivity, northern Jaipur expansion and increasing residential supply create strong medium-to-long-term investment potential.",
  },

  {
    id: "benar-sikar-road",
    areaId: "sikar-road",
    name: "Benar",
    city: "Jaipur",
    marketPosition: "Early Opportunity",
    entryLevel: "Moderate",
    demand: "Growing",
    newDevelopment: "High",
    newSupply: "High",
    connectivity: "Improving",
    futurePotential: "Very Strong",

    projects: [],

    growthDrivers: [
      {
        name: "Sikar Road Access",
        type: "Road",
        status: "Operational",
        impact: "High",
        description:
          "Benar benefits from access to the Sikar Road corridor and the wider northern Jaipur road network, supporting future development potential.",
        source: "PropertyHub market tracking",
        lastChecked: "2026-08",
      },
      {
        name: "Northern Jaipur Expansion",
        type: "Residential",
        status: "Expanding",
        impact: "High",
        description:
          "Continued outward growth of northern Jaipur can gradually increase residential demand and development interest around Benar.",
        source: "PropertyHub market tracking",
        lastChecked: "2026-08",
      },
      {
        name: "Emerging Residential Development",
        type: "Residential",
        status: "Expanding",
        impact: "High",
        description:
          "New plotted and residential development across the wider Sikar Road belt can expand the future housing catchment around Benar.",
        source: "PropertyHub market tracking",
        lastChecked: "2026-08",
      },
    ],

    developmentReasons: [
      "Sikar Road access supports future regional connectivity.",
      "Northern Jaipur expansion can increase development interest.",
      "Emerging residential supply creates an early-stage growth opportunity.",
    ],

    outlook:
      "Benar is an early-stage Sikar Road growth pocket where improving connectivity, northern Jaipur expansion and emerging residential supply provide strong long-term investment signals.",
  },

  {
    id: "jhotwara-kalwar-road",
    areaId: "kalwar-road",
    name: "Jhotwara",
    city: "Jaipur",
    marketPosition: "Established",
    entryLevel: "High",
    demand: "Strong",
    newDevelopment: "Medium",
    newSupply: "Medium",
    connectivity: "Good",
    futurePotential: "Strong",

    projects: [],

    growthDrivers: [
      {
        name: "Kalwar Road Connectivity",
        type: "Road",
        status: "Operational",
        impact: "High",
        description:
          "Jhotwara benefits from established access to Kalwar Road and the wider western and northern Jaipur road network.",
        source: "PropertyHub market tracking",
        lastChecked: "2026-08",
      },
      {
        name: "Established Residential Catchment",
        type: "Residential",
        status: "Operational",
        impact: "High",
        description:
          "A large established residential base supports recurring end-user demand and local housing activity across the Jhotwara side.",
        source: "PropertyHub market tracking",
        lastChecked: "2026-08",
      },
      {
        name: "Industrial & Employment Activity",
        type: "Employment",
        status: "Operational",
        impact: "High",
        description:
          "Industrial and employment activity across the Jhotwara and western Jaipur belt supports surrounding housing and service demand.",
        source: "PropertyHub market tracking",
        lastChecked: "2026-08",
      },
    ],

    developmentReasons: [
      "Established residential demand provides a stable end-user base.",
      "Kalwar Road connects Jhotwara with wider northern and western Jaipur.",
      "Employment and commercial activity supports recurring local demand.",
    ],

    outlook:
      "Jhotwara is an established Kalwar Road market where strong residential demand, established connectivity and employment activity support a stable medium-to-long-term investment outlook.",
  },

  {
    id: "kalwar-road-north",
    areaId: "kalwar-road",
    name: "Niwaru",
    city: "Jaipur",
    marketPosition: "Rising Fast",
    entryLevel: "Moderate",
    demand: "Growing",
    newDevelopment: "High",
    newSupply: "High",
    connectivity: "Improving",
    futurePotential: "Very Strong",

    projects: [],

    growthDrivers: [
      {
        name: "Kalwar Road Corridor",
        type: "Road",
        status: "Operational",
        impact: "Very High",
        description:
          "Niwaru benefits from access to the Kalwar Road corridor and northern Jaipur network, supporting future residential and commercial expansion.",
        source: "PropertyHub market tracking",
        lastChecked: "2026-08",
      },
      {
        name: "Northern Jaipur Expansion",
        type: "Residential",
        status: "Expanding",
        impact: "High",
        description:
          "Continued outward expansion of northern Jaipur can increase residential demand and development activity around the Niwaru side.",
        source: "PropertyHub market tracking",
        lastChecked: "2026-08",
      },
      {
        name: "New Residential Supply",
        type: "Residential",
        status: "Expanding",
        impact: "High",
        description:
          "New plotted and residential projects can expand the local housing catchment as the Kalwar Road corridor matures.",
        source: "PropertyHub market tracking",
        lastChecked: "2026-08",
      },
    ],

    developmentReasons: [
      "Kalwar Road provides strategic access toward northern Jaipur.",
      "Northern expansion is increasing the development catchment.",
      "New residential supply creates opportunities for early-stage buyers.",
    ],

    outlook:
      "Niwaru is a rising Kalwar Road growth pocket where corridor connectivity, northern Jaipur expansion and increasing residential supply create strong medium-to-long-term investment potential.",
  },

  {
    id: "kalwar-road-machwa",
    areaId: "kalwar-road",
    name: "Machwa",
    city: "Jaipur",
    marketPosition: "Early Opportunity",
    entryLevel: "Early",
    demand: "Growing",
    newDevelopment: "High",
    newSupply: "High",
    connectivity: "Improving",
    futurePotential: "Very Strong",

    projects: [],

    growthDrivers: [
      {
        name: "Kalwar Road Access",
        type: "Road",
        status: "Operational",
        impact: "High",
        description:
          "Machwa benefits from access to the Kalwar Road corridor and surrounding northern Jaipur roads, supporting future accessibility.",
        source: "PropertyHub market tracking",
        lastChecked: "2026-08",
      },
      {
        name: "Emerging Residential Expansion",
        type: "Residential",
        status: "Expanding",
        impact: "High",
        description:
          "Residential and plotted development across the outer Kalwar Road belt can gradually expand the local housing catchment.",
        source: "PropertyHub market tracking",
        lastChecked: "2026-08",
      },
      {
        name: "Northern Jaipur Growth",
        type: "Residential",
        status: "Expanding",
        impact: "Medium",
        description:
          "The outward growth of northern Jaipur can increase long-term development interest around emerging Kalwar Road pockets.",
        source: "PropertyHub market tracking",
        lastChecked: "2026-08",
      },
    ],

    developmentReasons: [
      "Improving road connectivity supports future accessibility.",
      "Emerging residential supply provides early-stage entry opportunities.",
      "Northern Jaipur expansion can strengthen long-term development potential.",
    ],

    outlook:
      "Machwa is an early-stage Kalwar Road pocket where improving connectivity, residential expansion and northern Jaipur growth provide strong long-term investment signals.",
  },

  {
    id: "kalwar-road-hathoj",
    areaId: "kalwar-road",
    name: "Hathoj",
    city: "Jaipur",
    marketPosition: "Rising Fast",
    entryLevel: "Moderate",
    demand: "Growing",
    newDevelopment: "High",
    newSupply: "High",
    connectivity: "Improving",
    futurePotential: "Strong",

    projects: [],

    growthDrivers: [
      {
        name: "Kalwar Road Connectivity",
        type: "Road",
        status: "Operational",
        impact: "High",
        description:
          "Hathoj benefits from access to Kalwar Road and surrounding western Jaipur routes, supporting movement and development activity.",
        source: "PropertyHub market tracking",
        lastChecked: "2026-08",
      },
      {
        name: "Residential Expansion",
        type: "Residential",
        status: "Expanding",
        impact: "High",
        description:
          "Growing residential development across the Kalwar Road belt can increase the housing base and future end-user demand around Hathoj.",
        source: "PropertyHub market tracking",
        lastChecked: "2026-08",
      },
      {
        name: "Local Commercial Activity",
        type: "Commercial",
        status: "Expanding",
        impact: "Medium",
        description:
          "Expansion of neighbourhood retail and services can improve local utility as residential development increases.",
        source: "PropertyHub market tracking",
        lastChecked: "2026-08",
      },
    ],

    developmentReasons: [
      "Kalwar Road access supports wider western Jaipur connectivity.",
      "Residential development is expanding across the surrounding belt.",
      "Growing local services can improve neighbourhood utility.",
    ],

    outlook:
      "Hathoj is a rising Kalwar Road growth pocket where improving connectivity, expanding residential supply and growing local activity support a positive medium-to-long-term investment outlook.",
  },

  {
    id: "sirsi-village-sirsi-road",
    areaId: "sirsi-road",
    name: "Sirsi",
    city: "Jaipur",
    marketPosition: "Rising Fast",
    entryLevel: "Moderate",
    demand: "Growing",
    newDevelopment: "High",
    newSupply: "High",
    connectivity: "Improving",
    futurePotential: "Very Strong",

    projects: [],

    growthDrivers: [
      {
        name: "Sirsi Road Connectivity",
        type: "Road",
        status: "Operational",
        impact: "Very High",
        description:
          "Sirsi benefits from direct access to the Sirsi Road corridor and wider western Jaipur road network, supporting residential expansion and regional movement.",
        source: "PropertyHub market tracking",
        lastChecked: "2026-08",
      },
      {
        name: "Western Jaipur Residential Expansion",
        type: "Residential",
        status: "Expanding",
        impact: "High",
        description:
          "Continued residential expansion across western Jaipur is increasing the housing catchment around the Sirsi Road belt.",
        source: "PropertyHub market tracking",
        lastChecked: "2026-08",
      },
      {
        name: "New Residential Supply",
        type: "Residential",
        status: "Expanding",
        impact: "High",
        description:
          "New plotted and residential development is expanding buyer choice and supporting the gradual maturation of the Sirsi Road corridor.",
        source: "PropertyHub market tracking",
        lastChecked: "2026-08",
      },
    ],

    developmentReasons: [
      "Sirsi Road provides strategic western Jaipur connectivity.",
      "Residential expansion is increasing the local housing catchment.",
      "New supply provides opportunities across different entry points.",
    ],

    outlook:
      "Sirsi is a rising western Jaipur growth pocket where corridor connectivity, residential expansion and new supply create strong medium-to-long-term investment potential.",
  },

  {
    id: "gokulpura-sirsi-road",
    areaId: "sirsi-road",
    name: "Gokulpura",
    city: "Jaipur",
    marketPosition: "Established",
    entryLevel: "High",
    demand: "Strong",
    newDevelopment: "Medium",
    newSupply: "Medium",
    connectivity: "Good",
    futurePotential: "Strong",

    projects: [],

    growthDrivers: [
      {
        name: "Sirsi Road Access",
        type: "Road",
        status: "Operational",
        impact: "High",
        description:
          "Gokulpura benefits from established access to Sirsi Road and surrounding western Jaipur corridors.",
        source: "PropertyHub market tracking",
        lastChecked: "2026-08",
      },
      {
        name: "Established Residential Demand",
        type: "Residential",
        status: "Operational",
        impact: "High",
        description:
          "An established residential catchment supports recurring end-user demand and neighbourhood-level housing activity.",
        source: "PropertyHub market tracking",
        lastChecked: "2026-08",
      },
      {
        name: "Local Commercial Activity",
        type: "Commercial",
        status: "Expanding",
        impact: "Medium",
        description:
          "Growing retail and service activity improves local convenience and supports the area's residential utility.",
        source: "PropertyHub market tracking",
        lastChecked: "2026-08",
      },
    ],

    developmentReasons: [
      "Established housing demand supports a stable end-user market.",
      "Sirsi Road provides access to western Jaipur employment and commercial areas.",
      "Growing local services strengthen neighbourhood utility.",
    ],

    outlook:
      "Gokulpura is an established Sirsi Road pocket where residential demand, good connectivity and local commercial activity support a balanced long-term investment outlook.",
  },

  {
    id: "niwaru-sirsi-road",
    areaId: "sirsi-road",
    name: "Niwaru",
    city: "Jaipur",
    marketPosition: "Rising Fast",
    entryLevel: "Moderate",
    demand: "Growing",
    newDevelopment: "High",
    newSupply: "High",
    connectivity: "Improving",
    futurePotential: "Very Strong",

    projects: [],

    growthDrivers: [
      {
        name: "Western Jaipur Connectivity",
        type: "Road",
        status: "Operational",
        impact: "High",
        description:
          "Niwaru benefits from connections between the western and northern Jaipur road network, improving access toward Sirsi Road and surrounding growth corridors.",
        source: "PropertyHub market tracking",
        lastChecked: "2026-08",
      },
      {
        name: "Residential Expansion",
        type: "Residential",
        status: "Expanding",
        impact: "High",
        description:
          "Growing residential development across the outer western Jaipur belt can increase the future housing catchment around Niwaru.",
        source: "PropertyHub market tracking",
        lastChecked: "2026-08",
      },
      {
        name: "New Plotted Development",
        type: "Residential",
        status: "Expanding",
        impact: "Medium",
        description:
          "New plotted development can provide additional supply as infrastructure and surrounding residential activity mature.",
        source: "PropertyHub market tracking",
        lastChecked: "2026-08",
      },
    ],

    developmentReasons: [
      "Road connectivity links the pocket with wider Jaipur growth corridors.",
      "Residential expansion is increasing development activity.",
      "New plotted supply creates early-stage investment options.",
    ],

    outlook:
      "Niwaru is a rising western Jaipur growth pocket where improving connectivity, residential expansion and new plotted development provide strong long-term potential.",
  },

  {
    id: "bhankrota-sirsi-road",
    areaId: "sirsi-road",
    name: "Bhankrota",
    city: "Jaipur",
    marketPosition: "Early Opportunity",
    entryLevel: "Moderate",
    demand: "Growing",
    newDevelopment: "High",
    newSupply: "High",
    connectivity: "Improving",
    futurePotential: "Very Strong",

    projects: [],

    growthDrivers: [
      {
        name: "Western Road Network",
        type: "Road",
        status: "Operational",
        impact: "Very High",
        description:
          "Bhankrota benefits from access to major western Jaipur road corridors, supporting regional movement and future development.",
        source: "PropertyHub market tracking",
        lastChecked: "2026-08",
      },
      {
        name: "Residential Corridor Expansion",
        type: "Residential",
        status: "Expanding",
        impact: "High",
        description:
          "Residential growth across the western Jaipur belt can gradually expand the local housing and service catchment.",
        source: "PropertyHub market tracking",
        lastChecked: "2026-08",
      },
      {
        name: "Emerging Development Activity",
        type: "Residential",
        status: "Expanding",
        impact: "High",
        description:
          "Increasing plotted and residential development can strengthen long-term demand as surrounding infrastructure matures.",
        source: "PropertyHub market tracking",
        lastChecked: "2026-08",
      },
    ],

    developmentReasons: [
      "Strategic western road connectivity supports future accessibility.",
      "Residential development is expanding across the wider corridor.",
      "Early-stage supply can offer greater upside if development accelerates.",
    ],

    outlook:
      "Bhankrota is an early-stage western Jaipur growth pocket where improving road connectivity, residential expansion and emerging development provide strong long-term investment signals.",
  },

  {
    id: "jagatpura-core",
    areaId: "jagatpura",
    name: "Jagatpura Core",
    city: "Jaipur",

    marketPosition: "Growing but Expensive",
    entryLevel: "High",
    demand: "Strong",
    newDevelopment: "High",
    newSupply: "High",
    connectivity: "Good",
    futurePotential: "Very Strong",

    projects: [],

    growthDrivers: [
      {
        name: "Jagatpura Residential Expansion",
        type: "Residential",
        status: "Expanding",
        impact: "Very High",
        description:
          "Jagatpura has developed into an important southern Jaipur residential market, with continued housing expansion supporting sustained end-user and investment demand.",
        source: "PropertyHub market tracking",
        lastChecked: "2026-08",
      },
      {
        name: "Southern Jaipur Connectivity",
        type: "Road",
        status: "Operational",
        impact: "High",
        description:
          "Jagatpura benefits from connectivity toward major southern Jaipur employment, residential and airport-side corridors.",
        source: "PropertyHub market tracking",
        lastChecked: "2026-08",
      },
      {
        name: "Local Commercial Activity",
        type: "Commercial",
        status: "Expanding",
        impact: "High",
        description:
          "Growing residential density is supporting retail, services and everyday commercial activity around the Jagatpura catchment.",
        source: "PropertyHub market tracking",
        lastChecked: "2026-08",
      },
    ],

    developmentReasons: [
      "Strong residential demand provides an established end-user base.",
      "Continued housing development supports long-term market depth.",
      "Southern Jaipur connectivity strengthens accessibility.",
      "Growing local commercial activity improves everyday livability.",
    ],

    outlook:
      "Jagatpura Core is an established southern Jaipur growth pocket where strong residential demand, continued development and improving local services support a strong long-term investment outlook.",
  },

  {
    id: "getor-jagatpura",
    areaId: "jagatpura",
    name: "Getor / Jagatpura Railway Side",
    city: "Jaipur",

    marketPosition: "Rising Fast",
    entryLevel: "High",
    demand: "Strong",
    newDevelopment: "High",
    newSupply: "Medium",
    connectivity: "Good",
    futurePotential: "Very Strong",

    projects: [],

    growthDrivers: [
      {
        name: "Getor Jagatpura Railway Connectivity",
        type: "Railway",
        status: "Operational",
        impact: "High",
        description:
          "Getor Jagatpura is an operating railway station serving the Jagatpura area. Its position within the southern Jaipur rail network provides an established public-transport anchor for the surrounding residential catchment.",
        source: "Indian Railways / Jaipur Development Authority",
        lastChecked: "2026-08",
      },
      {
        name: "Jagatpura Residential Demand",
        type: "Residential",
        status: "Expanding",
        impact: "Very High",
        description:
          "Strong residential activity across Jagatpura supports housing demand around established transport-accessible pockets.",
        source: "PropertyHub market tracking",
        lastChecked: "2026-08",
      },
      {
        name: "Southern Jaipur Connectivity",
        type: "Road",
        status: "Operational",
        impact: "High",
        description:
          "Road connectivity links the Getor side with wider Jagatpura and southern Jaipur employment and residential corridors.",
        source: "PropertyHub market tracking",
        lastChecked: "2026-08",
      },
    ],

    developmentReasons: [
      "Established railway-side connectivity adds strategic accessibility.",
      "Jagatpura's strong residential demand supports surrounding housing activity.",
      "Southern Jaipur connectivity improves access to employment and services.",
    ],

    outlook:
      "Getor / Jagatpura Railway Side is a strategically positioned Jagatpura pocket where transport access and strong residential demand support long-term investment potential.",
  },

  {
    id: "jagatpura-institutional-belt",
    areaId: "jagatpura",
    name: "Jagatpura Institutional & Residential Belt",
    city: "Jaipur",

    marketPosition: "Rising Fast",
    entryLevel: "High",
    demand: "Strong",
    newDevelopment: "High",
    newSupply: "High",
    connectivity: "Good",
    futurePotential: "Very Strong",

    projects: [],

    growthDrivers: [
      {
        name: "Institutional & Education Ecosystem",
        type: "Education",
        status: "Operational",
        impact: "High",
        description:
          "Jagatpura has an established education and institutional ecosystem that supports recurring student, staff and family housing demand. This creates an additional rental and end-user demand layer alongside the area's residential expansion.",
        source: "PropertyHub market tracking / local institutional ecosystem",
        lastChecked: "2026-08",
      },
      {
        name: "Residential Expansion",
        type: "Residential",
        status: "Expanding",
        impact: "Very High",
        description:
          "Continued residential development is increasing housing supply and strengthening the local catchment around institutional activity.",
        source: "PropertyHub market tracking",
        lastChecked: "2026-08",
      },
      {
        name: "Supporting Commercial Activity",
        type: "Commercial",
        status: "Expanding",
        impact: "High",
        description:
          "Growing residential and institutional activity supports retail, food, services and other everyday commercial uses.",
        source: "PropertyHub market tracking",
        lastChecked: "2026-08",
      },
    ],

    developmentReasons: [
      "Institutional activity can support recurring end-user and rental demand.",
      "Residential expansion is increasing the local housing catchment.",
      "Supporting commercial activity improves long-term livability.",
      "The combination of institutions and housing provides diversified demand drivers.",
    ],

    outlook:
      "Jagatpura Institutional & Residential Belt is a development-led southern Jaipur pocket where institutional activity, residential expansion and supporting services create a strong medium-to-long-term investment outlook.",
  },
]

export const getMicroLocations = (areaId: string) =>
  microLocations.filter((location) => location.areaId === areaId);
