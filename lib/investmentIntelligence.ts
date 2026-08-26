import { investmentAreas } from "@/data/investmentAreas";
import { getMicroLocations, type MicroLocation } from "@/data/microLocations";

export type InvestmentSignals = {
  demand: number;
  priceMomentum: number;
  buyerActivity: number;
  development: number;
  connectivity: number;
  futurePotential: number;
  newSupply: number;
};

export type InvestmentSignalExplanation = {
  signal: keyof InvestmentSignals;
  rating: string;
  score: number;
  explanation: string;
};

type ScoreResult = {
  score: number | null;
  confidence: number;
  dataStatus: "insufficient_data" | "limited_data" | "developing" | "verified";
  outlook: "insufficient_data" | "watch" | "positive" | "strong";
  aiOutlook: string;
  microLocationCount: number;
  signals: InvestmentSignals | null;
  signalExplanations: InvestmentSignalExplanation[];
  strengths: string[];
  watchouts: string[];
};

const demandScore: Record<MicroLocation["demand"], number> = {
  Growing: 55,
  Strong: 75,
  "Very Strong": 95,
};

const developmentScore: Record<MicroLocation["newDevelopment"], number> = {
  Low: 40,
  Medium: 70,
  High: 95,
};

const connectivityScore: Record<MicroLocation["connectivity"], number> = {
  Improving: 55,
  Good: 75,
  Excellent: 95,
};

const futureScore: Record<MicroLocation["futurePotential"], number> = {
  Moderate: 55,
  Strong: 75,
  "Very Strong": 95,
};

const supplyScore: Record<MicroLocation["newSupply"], number> = {
  Low: 80,
  Medium: 70,
  High: 55,
};

const priceMomentumScore: Record<string, number> = {
  Falling: 35,
  Stable: 60,
  Rising: 85,
};

const buyerActivityScore: Record<string, number> = {
  Weak: 40,
  Growing: 70,
  Strong: 90,
};

const growthDriverStatusScore: Record<
  NonNullable<MicroLocation["growthDrivers"]>[number]["status"],
  number
> = {
  Proposed: 65,
  Approved: 80,
  "Under Construction": 90,
  Operational: 85,
  Expanding: 90,
  Transition: 70,
};

const growthDriverImpactWeight: Record<
  NonNullable<MicroLocation["growthDrivers"]>[number]["impact"],
  number
> = {
  Low: 0.5,
  Medium: 0.75,
  High: 1,
  "Very High": 1.25,
};

const average = (values: number[]) =>
  values.length
    ? values.reduce((sum, value) => sum + value, 0) / values.length
    : 0;

export function calculateInvestmentIntelligence(
  areaId: string
): ScoreResult {
  const locations = getMicroLocations(areaId);
  const area = investmentAreas.find((item) => item.id === areaId);

  if (!locations.length || !area) {
    return {
      score: null,
      confidence: 0,
      dataStatus: "insufficient_data",
      outlook: "insufficient_data",
      aiOutlook: "More market data is needed before a reliable investment outlook can be established.",
      microLocationCount: locations.length,
      signals: null,
      signalExplanations: [],
      strengths: [],
      watchouts: ["Verified investment data is not yet available."],
    };
  }

  const demand = average(
    locations.map((location) => demandScore[location.demand])
  );

  const development = average(
    locations.map((location) => developmentScore[location.newDevelopment])
  );

  const connectivity = average(
    locations.map((location) => connectivityScore[location.connectivity])
  );

  const future = average(
    locations.map((location) => futureScore[location.futurePotential])
  );

  const supply = average(
    locations.map((location) => supplyScore[location.newSupply])
  );

  /*
   * Area-level market signals are intentionally kept separate
   * from micro-location averages. These are the signals users
   * actually see in the Investment Signals section.
   */
  const priceMomentum =
    priceMomentumScore[area.priceMomentum] ?? 60;

  const buyerActivity =
    buyerActivityScore[area.buyerActivity] ?? 60;

  /*
   * Growth drivers are supporting evidence rather than a
   * standalone score booster.
   */
  const growthDriverValues = locations.flatMap((location) =>
    (location.growthDrivers ?? []).map((driver) => ({
      score: growthDriverStatusScore[driver.status],
      weight: growthDriverImpactWeight[driver.impact],
    }))
  );

  const growthSignals =
    growthDriverValues.length > 0
      ? growthDriverValues.reduce(
          (sum, driver) => sum + driver.score * driver.weight,
          0
        ) /
        growthDriverValues.reduce(
          (sum, driver) => sum + driver.weight,
          0
        )
      : null;

  /*
   * Investment Score
   *
   * Demand            20%
   * Price Momentum    15%
   * Buyer Activity    15%
   * Development       15%
   * Connectivity      10%
   * Future Potential  15%
   * New Supply        10%
   *
   * Growth drivers are NOT added as an extra weight.
   * They are used only for supporting signals/watchouts.
   */
  const signals: InvestmentSignals = {
    demand,
    priceMomentum,
    buyerActivity,
    development,
    connectivity,
    futurePotential: future,
    newSupply: supply,
  };

  const ratingFor = (value: number) =>
    value >= 85
      ? "Very Strong"
      : value >= 75
        ? "Strong"
        : value >= 65
          ? "Good"
          : value >= 50
            ? "Moderate"
            : "Weak";

  const signalExplanations: InvestmentSignalExplanation[] = [
    {
      signal: "demand",
      rating: ratingFor(signals.demand),
      score: Math.round(signals.demand),
      explanation:
        signals.demand >= 80
          ? "Strong residential demand is visible across the tracked micro-locations."
          : signals.demand >= 65
            ? "Demand is developing, with selected micro-locations showing healthy market activity."
            : "Demand remains relatively early and should be validated at the property level.",
    },
    {
      signal: "priceMomentum",
      rating: ratingFor(signals.priceMomentum),
      score: Math.round(signals.priceMomentum),
      explanation:
        signals.priceMomentum >= 80
          ? "Price momentum is positive, indicating supportive current market conditions."
          : signals.priceMomentum >= 65
            ? "Price conditions are broadly stable to positive, but property-level pricing still matters."
            : "Price momentum is moderate, so entry price discipline is especially important.",
    },
    {
      signal: "buyerActivity",
      rating: ratingFor(signals.buyerActivity),
      score: Math.round(signals.buyerActivity),
      explanation:
        signals.buyerActivity >= 80
          ? "Buyer activity is strong, supporting liquidity and end-user interest."
          : signals.buyerActivity >= 65
            ? "Buyer activity is developing and should be assessed alongside actual enquiry and transaction depth."
            : "Buyer activity is relatively weak and may require a longer investment horizon.",
    },
    {
      signal: "development",
      rating: ratingFor(signals.development),
      score: Math.round(signals.development),
      explanation:
        signals.development >= 80
          ? "High development activity indicates an actively expanding market environment."
          : signals.development >= 65
            ? "Development is progressing, with growth depending on project quality and infrastructure delivery."
            : "Development activity remains limited and should be monitored for future changes.",
    },
    {
      signal: "connectivity",
      rating: ratingFor(signals.connectivity),
      score: Math.round(signals.connectivity),
      explanation:
        signals.connectivity >= 80
          ? "Strong connectivity supports accessibility, end-user demand and long-term market depth."
          : signals.connectivity >= 65
            ? "Connectivity is reasonably supportive, although exact access quality varies by micro-location."
            : "Connectivity remains a developing factor and should be checked at the property level.",
    },
    {
      signal: "futurePotential",
      rating: ratingFor(signals.futurePotential),
      score: Math.round(signals.futurePotential),
      explanation:
        signals.futurePotential >= 80
          ? "Future potential is strong based on the combined development, demand and connectivity outlook."
          : signals.futurePotential >= 65
            ? "The area has positive long-term potential, but growth may depend on continued infrastructure and demand."
            : "Future potential is still developing and requires a more selective investment approach.",
    },
    {
      signal: "newSupply",
      rating: ratingFor(signals.newSupply),
      score: Math.round(signals.newSupply),
      explanation:
        signals.newSupply >= 80
          ? "Supply conditions are relatively favourable, reducing immediate competition from new inventory."
          : signals.newSupply >= 65
            ? "New supply is moderate and should be monitored against buyer absorption and project quality."
            : "Higher new supply can increase competition, making pricing and project selection more important.",
    },
  ];

  const score = Math.round(
    signals.demand * 0.20 +
      signals.priceMomentum * 0.15 +
      signals.buyerActivity * 0.15 +
      signals.development * 0.15 +
      signals.connectivity * 0.10 +
      signals.futurePotential * 0.15 +
      signals.newSupply * 0.10
  );

  const confidence = Math.min(
    95,
    Math.round(45 + Math.min(locations.length, 5) * 10)
  );

  const dataStatus =
    locations.length >= 3
      ? "verified"
      : locations.length >= 2
        ? "developing"
        : "limited_data";

  const outlook =
    score >= 82
      ? "strong"
      : score >= 68
        ? "positive"
        : "watch";

  const strengths: string[] = [];
  const watchouts: string[] = [];

  if (demand >= 80) {
    strengths.push("Strong buyer demand");
  }

  if (priceMomentum >= 80) {
    strengths.push("Positive price momentum");
  }

  if (buyerActivity >= 80) {
    strengths.push("Strong buyer activity");
  }

  if (development >= 80) {
    strengths.push("High development activity");
  }

  if (connectivity >= 80) {
    strengths.push("Strong connectivity");
  }

  if (future >= 80) {
    strengths.push("Very strong future potential");
  }

  if (growthSignals !== null && growthSignals >= 82) {
    strengths.push("Strong growth-driver activity");
  }

  if (supply <= 60) {
    watchouts.push("New supply should be monitored");
  }

  if (demand < 65) {
    watchouts.push("Demand is still developing");
  }

  if (priceMomentum < 65) {
    watchouts.push("Price momentum remains moderate");
  }

  if (buyerActivity < 65) {
    watchouts.push("Buyer activity is still developing");
  }

  const outlookDrivers: string[] = [];

  if (demand >= 80) {
    outlookDrivers.push("strong buyer demand");
  }

  if (priceMomentum >= 80) {
    outlookDrivers.push("positive price momentum");
  }

  if (buyerActivity >= 80) {
    outlookDrivers.push("active buyer participation");
  }

  if (development >= 80) {
    outlookDrivers.push("high development activity");
  }

  if (connectivity >= 80) {
    outlookDrivers.push("strong connectivity");
  }

  if (future >= 80) {
    outlookDrivers.push("strong future potential");
  }

  if (growthSignals !== null && growthSignals >= 82) {
    outlookDrivers.push("active growth drivers");
  }

  const driverText =
    outlookDrivers.length === 1
      ? outlookDrivers[0]
      : outlookDrivers.length === 2
        ? `${outlookDrivers[0]} and ${outlookDrivers[1]}`
        : outlookDrivers.length > 2
          ? `${outlookDrivers.slice(0, -1).join(", ")}, and ${outlookDrivers[outlookDrivers.length - 1]}`
          : "";

  const aiOutlook =
    outlook === "strong"
      ? driverText
        ? `${driverText.charAt(0).toUpperCase() + driverText.slice(1)} are supporting the area's investment case.${watchouts.length > 0 ? ` ${watchouts[0]}.` : " Current signals remain broadly supportive."}`
        : "The overall investment score is strong, with current market signals supporting the area's growth outlook."
      : outlook === "positive"
        ? driverText
          ? `${driverText.charAt(0).toUpperCase() + driverText.slice(1)} are supporting a positive investment outlook.${watchouts.length > 0 ? ` ${watchouts[0]}.` : " Property-level evaluation remains important."}`
          : "The area shows a positive investment outlook, although property-level evaluation remains important."
        : driverText
          ? `${driverText.charAt(0).toUpperCase() + driverText.slice(1)} provide some support, but current signals suggest investors should evaluate the area carefully before committing capital.${watchouts.length > 0 ? ` ${watchouts[0]}.` : ""}`
          : "Current signals suggest investors should evaluate the area carefully and validate property-level fundamentals before investing.";

  return {
    score,
    confidence,
    dataStatus,
    outlook,
    aiOutlook,
    microLocationCount: locations.length,
    signals,
    signalExplanations,
    strengths,
    watchouts,
  };
}
