"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useAuth } from "./AuthProvider";
import {
  collection,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { db } from "@/lib/firebase";

type HomepageAd = {
  id: string;
  sponsorName: string;
  title: string;
  subtitle: string;
  startingPrice: string;
  desktopImage: string;
  mobileImage: string;
  ctaLabel: string;
  targetUrl: string;
  placement: "website" | "app" | "both";
  startDate: string;
  endDate: string;
  priority: number;
  active: boolean;
};

const tabs = [
  { label: "Buy", icon: "⌂" },
  { label: "Rent", icon: "▣" },
  { label: "PG/Hostel", icon: "▥" },
  { label: "Plot", icon: "⌁" },
];

const propertyTypes: Record<string, string[]> = {
  Buy: ["Flat", "Villa", "House", "Plot"],
  Rent: ["Flat", "House", "Room"],
  "PG/Hostel": ["PG", "Hostel", "Co-living"],
  Plot: ["JDA Approved Plot", "Society Plot"],
};

export default function Hero() {
  const router = useRouter();
  const { user, role } = useAuth();

  const [activeTab, setActiveTab] = useState("Buy");
  const [location, setLocation] = useState("");
  const [propertyType, setPropertyType] = useState("");
  const [budget, setBudget] = useState("");
  const [activeAd, setActiveAd] =
    useState<HomepageAd | null>(null);

  useEffect(() => {
    let mounted = true;

    async function loadSponsoredAd() {
      try {
        const snapshot = await getDocs(
          query(
            collection(db, "homepageAds"),
            where("active", "==", true)
          )
        );

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const campaigns = snapshot.docs
          .map((document) => ({
            id: document.id,
            ...document.data(),
          })) as HomepageAd[];

        const eligibleCampaigns = campaigns
          .filter((campaign) => {
            const placementMatch =
              campaign.placement === "website" ||
              campaign.placement === "both";

            const startDate = campaign.startDate
              ? new Date(`${campaign.startDate}T00:00:00`)
              : null;

            const endDate = campaign.endDate
              ? new Date(`${campaign.endDate}T23:59:59`)
              : null;

            const started =
              !startDate || startDate <= today;

            const notExpired =
              !endDate || endDate >= today;

            return (
              placementMatch &&
              started &&
              notExpired &&
              Boolean(campaign.desktopImage)
            );
          })
          .sort(
            (first, second) =>
              Number(second.priority || 0) -
              Number(first.priority || 0)
          );

        if (mounted) {
          setActiveAd(eligibleCampaigns[0] || null);
        }
      } catch (error) {
        console.error(
          "SPONSORED AD LOAD ERROR:",
          error
        );

        if (mounted) {
          setActiveAd(null);
        }
      }
    }

    loadSponsoredAd();

    return () => {
      mounted = false;
    };
  }, []);

  function getPostPropertyLink() {
    if (!user) {
      return (
        "/buyer-login?redirect=" +
        encodeURIComponent("/owner/add-property")
      );
    }

    if (role === "property_dealer") {
      return "/dealer/add-property";
    }

    return "/owner/add-property";
  }

  function handleSearch() {
    const params = new URLSearchParams();

    if (activeTab === "Rent") {
      params.set("purpose", "rent");
    } else if (activeTab === "PG/Hostel") {
      params.set("purpose", "rent");

      if (propertyType) {
        params.set(
          "type",
          propertyType.toLowerCase().replace("-", "_")
        );
      }
    } else {
      params.set("purpose", "new");
    }

    if (
      propertyType &&
      activeTab !== "PG/Hostel"
    ) {
      params.set(
        "type",
        propertyType
          .toLowerCase()
          .replaceAll(" ", "_")
      );
    }

    if (location.trim()) {
      params.set("location", location.trim());
    }

    if (budget) {
      params.set("budget", budget);
    }

    router.push(`/properties?${params.toString()}`);
  }

  return (
    <section className="bg-[#fbfaf8] px-4 py-5 sm:px-6 lg:px-8 lg:py-8">
      <div
        className={`mx-auto overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-[0_20px_60px_rgba(15,23,42,0.08)] ${
          activeAd ? "max-w-7xl" : "max-w-7xl"
        }`}
      >
        <div
          className={`relative overflow-hidden bg-[#fbfaf8] ${
            activeAd
              ? "min-h-[400px] sm:min-h-[300px]"
              : "min-h-[620px]"
          }`}
        >
          {activeAd ? (
            <picture>
              {activeAd.mobileImage && (
                <source
                  media="(max-width: 639px)"
                  srcSet={activeAd.mobileImage}
                />
              )}

              <img
                src={activeAd.desktopImage}
                alt={activeAd.title || "Sponsored project"}
                className="absolute inset-0 h-full w-full object-cover object-center"
              />
            </picture>
          ) : (
            <Image
              src="/hero-integrated.png"
              alt="Premium modern home"
              fill
              priority
              sizes="100vw"
              className="object-cover object-center"
            />
          )}

          <div
            className={`absolute inset-0 ${
              activeAd
                ? "bg-gradient-to-r from-slate-950/90 via-slate-950/60 via-55% to-slate-950/10"
                : "bg-gradient-to-r from-[#fbfaf8] via-[#fbfaf8]/95 via-45% to-transparent"
            }`}
          />

          <div
            className={`relative z-10 flex max-w-[650px] flex-col justify-center ${
              activeAd
                ? "min-h-[400px] p-6 sm:min-h-[300px] sm:p-6 lg:p-7"
                : "min-h-[620px] p-7 sm:p-10 lg:p-14"
            }`}
          >
            {activeAd ? (
              <>
                <div className="inline-flex w-fit items-center gap-2 rounded-full border border-white/20 bg-black/30 px-3 py-2 text-[10px] font-black uppercase tracking-[0.16em] text-white backdrop-blur">
                  Sponsored
                </div>

                <p className="mt-4 text-[11px] font-black uppercase tracking-[0.18em] text-green-300">
                  {activeAd.sponsorName}
                </p>

                <h1 className="mt-2 max-w-lg text-3xl font-black leading-[1.05] tracking-[-0.04em] text-white sm:text-[34px] lg:text-[38px]">
                  {activeAd.title}
                </h1>

                {activeAd.subtitle && (
                  <p className="mt-3 max-w-md text-sm leading-6 text-slate-200">
                    {activeAd.subtitle}
                  </p>
                )}

                {activeAd.startingPrice && (
                  <p className="mt-3 text-base font-black text-green-300 sm:text-lg">
                    Starting Price: {activeAd.startingPrice}
                  </p>
                )}

                {activeAd.targetUrl && (
                  <a
                    href={activeAd.targetUrl}
                    target={
                      activeAd.targetUrl.startsWith("http")
                        ? "_blank"
                        : undefined
                    }
                    rel={
                      activeAd.targetUrl.startsWith("http")
                        ? "noopener noreferrer sponsored"
                        : undefined
                    }
                    className="mt-4 inline-flex min-h-11 w-fit items-center justify-center gap-2 rounded-xl bg-green-600 px-5 text-sm font-black text-white shadow-[0_10px_24px_rgba(22,163,74,0.30)] transition hover:-translate-y-0.5 hover:bg-green-700"
                  >
                    {activeAd.ctaLabel || "Explore Project"}
                    <span>→</span>
                  </a>
                )}

                <p className="mt-3 text-[9px] font-semibold uppercase tracking-wider text-white/60">
                  Advertisement · PropertyHub
                </p>
              </>
            ) : (
              <>
                <div className="inline-flex w-fit items-center gap-2 rounded-full bg-green-50 px-3 py-2 text-xs font-bold text-green-700">
              <span>⌂</span>
              Find. Compare. Own.
            </div>

            <h1 className="mt-6 max-w-xl text-4xl font-black leading-[1.05] tracking-[-0.04em] text-slate-950 sm:text-5xl lg:text-[58px]">
              Find Your
              <br />
              <span className="text-green-700">
                Perfect Property
              </span>
            </h1>

            <p className="mt-5 max-w-md text-base leading-7 text-slate-600">
              Search verified homes, plots and rental properties in Jaipur.
            </p>

            <Link
              href={getPostPropertyLink()}
              className="mt-7 flex min-h-16 w-full max-w-[470px] items-center justify-between rounded-2xl border border-green-700 bg-green-600 px-5 py-3 text-white shadow-[0_12px_28px_rgba(22,163,74,0.28)] transition hover:-translate-y-0.5 hover:bg-green-700 hover:shadow-[0_16px_34px_rgba(22,163,74,0.34)]"
            >
              <span className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/25 bg-white/15 text-xl font-black">
                  ＋
                </span>

                <span>
                  <span className="block text-sm font-black sm:text-base">
                    Post Your Property
                  </span>

                  <span className="mt-0.5 block text-[11px] font-medium text-green-100">
                    Reach genuine buyers and tenants
                  </span>
                </span>
              </span>

              <span className="flex items-center gap-3">
                <span className="rounded-lg bg-white px-2.5 py-1.5 text-[10px] font-black tracking-wide text-green-700">
                  FREE
                </span>

                <span className="text-xl font-black">
                  →
                </span>
              </span>
            </Link>

            <div className="mt-4 grid grid-cols-2 gap-2 sm:flex sm:flex-wrap">
              {tabs.map((tab) => (
                <button
                  key={tab.label}
                  type="button"
                  onClick={() => {
                    setActiveTab(tab.label);
                    setPropertyType("");
                  }}
                  className={`flex min-h-12 items-center justify-center gap-2 rounded-xl border px-4 text-sm font-bold ${
                    activeTab === tab.label
                      ? "border-green-600 bg-green-600 text-white shadow-md shadow-green-600/20"
                      : "border-slate-200 bg-white text-slate-700 hover:border-green-300 hover:bg-green-50 hover:text-green-700"
                  }`}
                >
                  <span>{tab.icon}</span>
                  {tab.label}
                </button>
              ))}


            </div>

            <div className="mt-4 grid grid-cols-2 gap-2 sm:flex sm:flex-wrap">
              {propertyTypes[activeTab].map(
                (item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() =>
                      setPropertyType(
                        propertyType === item ? "" : item
                      )
                    }
                    className={`rounded-full border px-4 py-2 text-xs font-bold ${
                      propertyType === item
                        ? "border-green-600 bg-green-50 text-green-700"
                        : "border-slate-200 bg-white text-slate-500 hover:border-green-300 hover:text-green-700"
                    }`}
                  >
                    {item}
                  </button>
                )
              )}
            </div>
              </>
            )}
          </div>

        </div>

        <div className="relative z-20 mx-auto -mt-1 mb-5 w-[calc(100%-2.5rem)] max-w-5xl rounded-2xl border border-slate-200 bg-white p-3 shadow-[0_14px_35px_rgba(15,23,42,0.10)] sm:w-[calc(100%-4rem)] lg:-mt-9 lg:w-[calc(100%-5rem)]">
          <div className="grid gap-3 md:grid-cols-[1.2fr_1fr_0.8fr_auto]">
            <label className="rounded-xl bg-slate-50 px-4 py-3">
              <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-500">
                Location
              </span>

              <input
                value={location}
                onChange={(event) =>
                  setLocation(event.target.value)
                }
                placeholder="Enter city, locality or area"
                className="mt-1 w-full border-0 bg-transparent text-sm font-semibold text-slate-900 outline-none placeholder:font-normal placeholder:text-slate-400"
              />
            </label>

            <label className="rounded-xl bg-slate-50 px-4 py-3">
              <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-500">
                Property Type
              </span>

              <select
                value={propertyType}
                onChange={(event) =>
                  setPropertyType(event.target.value)
                }
                className="mt-1 w-full border-0 bg-transparent text-sm font-semibold text-slate-900 outline-none"
              >
                <option value="">
                  Select type
                </option>

                {propertyTypes[activeTab].map(
                  (item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  )
                )}
              </select>
            </label>

            <label className="rounded-xl bg-slate-50 px-4 py-3">
              <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-500">
                Price Range
              </span>

              <select
                value={budget}
                onChange={(event) =>
                  setBudget(event.target.value)
                }
                className="mt-1 w-full border-0 bg-transparent text-sm font-semibold text-slate-900 outline-none"
              >
                <option value="">Any budget</option>
                <option value="2500000">
                  Up to ₹25 Lakh
                </option>
                <option value="5000000">
                  Up to ₹50 Lakh
                </option>
                <option value="10000000">
                  Up to ₹1 Crore
                </option>
              </select>
            </label>

            <button
              type="button"
              onClick={handleSearch}
              className="min-h-14 rounded-xl bg-green-600 px-8 font-bold text-white shadow-md shadow-green-600/20 hover:bg-green-700"
            >
              Search
            </button>
          </div>
        </div>

        <div className="grid border-t border-slate-100 bg-white sm:grid-cols-2 lg:grid-cols-4">
          {[
            ["✓", "Verified Properties", "Quality checked"],
            ["▥", "Trusted Builders", "Top rated & reliable"],
            ["⌖", "Prime Locations", "Best places to live"],
            ["♧", "Easy & Secure", "Safe transactions"],
          ].map(([icon, title, text]) => (
            <div
              key={title}
              className="flex items-center gap-3 border-b border-slate-100 px-6 py-4 last:border-b-0 sm:border-r lg:border-b-0"
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-50 font-black text-green-700">
                {icon}
              </span>

              <div>
                <p className="text-xs font-black text-slate-900">
                  {title}
                </p>
                <p className="mt-1 text-[10px] text-slate-500">
                  {text}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
