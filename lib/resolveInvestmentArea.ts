import {
  investmentAreas,
} from "@/data/investmentAreas";

const aliases: Record<string, string[]> = {
  "tonk-road": ["tonk road"],
  "ajmer-road": ["ajmer road"],
  "mansarovar-extension": [
    "mansarovar extension",
    "patrakar colony",
    "muhana mandi",
  ],
  "vaishali-nagar-extension": [
    "vaishali nagar extension",
    "gandhi path west",
    "meenawala",
    "panchyawala",
  ],
  "ring-road-growth-belt": ["ring road"],
  "vatika-road": ["vatika road"],
  "diggi-road": ["diggi road"],
  "agra-road": ["agra road", "kanota"],
  "delhi-road": ["delhi road"],
  "sikar-road": ["sikar road"],
  "kalwar-road": ["kalwar road"],
  "sirsi-road": ["sirsi road"],
  jagatpura: ["jagatpura", "jagarpura"],
  "pratap-nagar": ["pratap nagar"],
  "jhotwara-extension": [
    "jhotwara",
    "jhotwara extension",
  ],
  "airport-sanganer": [
    "sanganer",
    "airport",
  ],
  "malviya-nagar-durgapura": [
    "malviya nagar",
    "durgapura",
  ],
  mansarovar: [
    "mansarovar",
    "mansarover",
    "manasarovar",
    "rajat path",
    "vt road",
  ],
  "c-scheme-central-jaipur": [
    "c scheme",
    "c-scheme",
    "central jaipur",
  ],
  gokulpura: ["gokulpura", "gokul pura"],
  vatika: ["vatika"],
  "vidyadhar-nagar": [
    "vidyadhar nagar",
    "vidhyadhar nagar",
    "vidyadhar",
  ],
};

export function resolveInvestmentArea(
  rawLocation: string
) {
  const location = String(rawLocation || "")
    .toLowerCase()
    .replace(/[,_-]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  const candidates = Object.entries(aliases)
    .flatMap(([id, values]) =>
      values.map((alias) => ({
        id,
        alias,
      }))
    )
    .sort(
      (a, b) =>
        b.alias.length - a.alias.length
    );

  const match = candidates.find(({ alias }) =>
    location.includes(alias)
  );

  if (!match) {
    return undefined;
  }

  return investmentAreas.find(
    (area) => area.id === match.id
  );
}


export function locationToAreaSlug(
  rawLocation: string
) {
  const matched =
    resolveInvestmentArea(rawLocation);

  if (matched) {
    return matched.id;
  }

  return String(rawLocation || "jaipur-area")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 70) || "jaipur-area";
}
