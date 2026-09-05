"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useAuth } from "./AuthProvider";
import { getActiveHomepageAds } from "@/lib/homepageAds";

type AdSlide = {
  id?: string;
  image: string;
  title?: string;
  description?: string;
  order?: number;
};

type HomepageAd = {
  id: string;
  adType?: "banner" | "showcase";
  slides?: AdSlide[];
  sponsorName: string;
  builderLogo?: string;
  builderContact?: string;
  projectName?: string;
  location?: string;
  title: string;
  subtitle: string;
  startingPrice: string;
  backgroundColor?: string;
  primaryColor?: string;
  accentColor?: string;
  textColor?: string;
  buttonColor?: string;
  buttonTextColor?: string;
  projectImage?: string;
  imageFit?: "cover" | "contain";
  imagePosition?: "left" | "center" | "right";
  imageZoom?: string;
  desktopImage: string;
  desktopDescription?: string;
  mobileImage: string;
  mobileDescription?: string;
  clubhouseImage?: string;
  clubhouseDescription?: string;
  gardenImage?: string;
  gardenDescription?: string;
  roomImage?: string;
  roomDescription?: string;
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

export default function Hero({
  adOnly = false,
}: {
  adOnly?: boolean;
}) {
  const router = useRouter();
  const { user, role } = useAuth();

  const [activeTab, setActiveTab] = useState("Buy");
  const [location, setLocation] = useState("");
  const [propertyType, setPropertyType] = useState("");
  const [budget, setBudget] = useState("");
  const [activeAds, setActiveAds] =
    useState<HomepageAd[]>([]);
  const [activeAdIndex, setActiveAdIndex] =
    useState(0);
  const [adInteractionVersion, setAdInteractionVersion] =
    useState(0);

  function resetAdRotation() {
    setAdInteractionVersion((current) => current + 1);
  }

  const [activeMediaSlide, setActiveMediaSlide] =
    useState(0);

  const activeAd =
    activeAds[activeAdIndex] || null;

  const mediaSlides = activeAd
    ? [
        {
          id: "main",
          image:
            activeAd.desktopImage ||
            activeAd.projectImage ||
            activeAd.mobileImage,
          mobileImage:
            activeAd.mobileImage ||
            activeAd.desktopImage ||
            activeAd.projectImage,
          title: activeAd.projectName || activeAd.title,
          description:
            activeAd.desktopDescription ||
            activeAd.subtitle,
          mobileDescription:
            activeAd.mobileDescription ||
            activeAd.desktopDescription ||
            activeAd.subtitle,
        },
        {
          id: "clubhouse",
          image: activeAd.clubhouseImage,
          mobileImage: activeAd.clubhouseImage,
          title: "Clubhouse",
          description: activeAd.clubhouseDescription,
          mobileDescription: activeAd.clubhouseDescription,
        },
        {
          id: "garden",
          image: activeAd.gardenImage,
          mobileImage: activeAd.gardenImage,
          title: "Garden & Landscape",
          description: activeAd.gardenDescription,
          mobileDescription: activeAd.gardenDescription,
        },
        {
          id: "room",
          image: activeAd.roomImage,
          mobileImage: activeAd.roomImage,
          title: "Room & Interior",
          description: activeAd.roomDescription,
          mobileDescription: activeAd.roomDescription,
        },
      ].filter((slide) => Boolean(slide.image))
    : [];

  const safeMediaSlide =
    mediaSlides.length > 0
      ? activeMediaSlide % mediaSlides.length
      : 0;

  const currentMediaSlide =
    mediaSlides[safeMediaSlide] || null;

  useEffect(() => {
    let mounted = true;

    async function loadSponsoredAd() {
      try {
        const activeHomepageAds =
          await getActiveHomepageAds();

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const campaigns =
          activeHomepageAds as HomepageAd[];

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

            const bannerType =
              !campaign.adType ||
              campaign.adType === "banner";

            return (
              bannerType &&
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
          setActiveAds(eligibleCampaigns);
          setActiveAdIndex(0);
        }
      } catch (error) {
        console.error(
          "SPONSORED AD LOAD ERROR:",
          error
        );

        if (mounted) {
          setActiveAds([]);
          setActiveAdIndex(0);
        }
      }
    }

    loadSponsoredAd();

    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    setActiveMediaSlide(0);
  }, [activeAd?.id]);

  useEffect(() => {
    if (activeAds.length <= 1) {
      return;
    }

    const rotationTimer = window.setTimeout(() => {
      if (document.hidden) {
        resetAdRotation();
        return;
      }

      setActiveAdIndex((currentIndex) =>
        (currentIndex + 1) % activeAds.length
      );
    }, 5000);

    return () => {
      window.clearTimeout(rotationTimer);
    };
  }, [activeAds.length, activeAdIndex, adInteractionVersion]);

  function goToPreviousMediaSlide() {
    if (!mediaSlides.length) return;
    resetAdRotation();

    setActiveMediaSlide((current) =>
      current <= 0
        ? mediaSlides.length - 1
        : current - 1
    );
  }

  function goToNextMediaSlide() {
    if (!mediaSlides.length) return;
    resetAdRotation();

    setActiveMediaSlide((current) =>
      (current + 1) % mediaSlides.length
    );
  }

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
        className={`mx-auto overflow-hidden rounded-[28px] border border-[#d8c891] bg-white shadow-[0_22px_65px_rgba(15,23,42,0.12)] ${
          activeAd ? "max-w-7xl" : "max-w-7xl"
        }`}
      >
        <div
          className={`relative overflow-hidden bg-[#fbfaf8] ${
            activeAd
              ? "min-h-[270px] sm:min-h-[200px]"
              : "min-h-[620px]"
          }`}
        >
          {activeAd ? (
            <div key={activeAd.id}>
              <div className="absolute inset-0 overflow-hidden">
                <picture>
                  {currentMediaSlide?.mobileImage && (
                    <source
                      media="(max-width: 639px)"
                      srcSet={currentMediaSlide.mobileImage}
                    />
                  )}

                  <img
                    src={
                      currentMediaSlide?.image ||
                      activeAd.projectImage ||
                      activeAd.desktopImage ||
                      activeAd.mobileImage
                    }
                    fetchPriority="high"
                    decoding="async"
                    alt={
                      activeAd.title ||
                      "Sponsored project"
                    }
                    className="h-full w-full"
                    style={{
                      objectFit:
                        activeAd.projectImage
                          ? activeAd.imageFit || "cover"
                          : "cover",

                      objectPosition:
                        activeAd.projectImage
                          ? activeAd.imagePosition === "left"
                            ? "left center"
                            : activeAd.imagePosition === "right"
                              ? "right center"
                              : "center center"
                          : "64% center",

                      transform: activeAd.projectImage
                        ? `scale(${
                            Number(
                              activeAd.imageZoom || 100
                            ) / 100
                          })`
                        : undefined,

                      transformOrigin:
                        activeAd.imagePosition === "left"
                          ? "left center"
                          : activeAd.imagePosition === "right"
                            ? "right center"
                            : "center center",
                    }}
                  />
                </picture>
              </div>

              {mediaSlides.length > 1 && (
                <div className="absolute bottom-6 left-1/2 z-30 flex -translate-x-1/2 items-center gap-2 rounded-full bg-white/85 px-3 py-2 shadow-lg backdrop-blur-sm">
                  {mediaSlides.map((slide, index) => (
                    <button
                      key={slide.id}
                      type="button"
                      onClick={() => { resetAdRotation(); setActiveMediaSlide(index); }}
                      aria-label={`Show ${slide.title}`}
                      className={`h-2 rounded-full transition-all ${
                        index === safeMediaSlide
                          ? "w-7"
                          : "w-2 bg-slate-300"
                      }`}
                      style={
                        index === safeMediaSlide
                          ? {
                              backgroundColor:
                                activeAd.primaryColor || "#1F5A3A",
                            }
                          : undefined
                      }
                    />
                  ))}
                </div>
              )}

              <div
                className="absolute inset-y-0 left-0 w-[52%]"
                style={{
                  backgroundColor:
                    activeAd.backgroundColor || "#F8F6EF",
                  clipPath:
                    "ellipse(96% 125% at 0% 50%)",
                }}
              />

              <div
                className="absolute inset-y-0 left-0 w-[52%] border-r"
                style={{
                  borderColor:
                    activeAd.accentColor || "#D4AF55",
                  clipPath:
                    "ellipse(96% 125% at 0% 50%)",
                }}
              />

              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-black/10" />

              {mediaSlides.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={goToPreviousMediaSlide}
                    className="absolute left-[48%] top-1/2 z-30 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-black/55 text-2xl font-black text-white shadow-xl backdrop-blur-sm transition hover:bg-black/75"
                    aria-label="Previous slide"
                  >
                    ‹
                  </button>

                  <button
                    type="button"
                    onClick={goToNextMediaSlide}
                    className="absolute right-5 top-1/2 z-30 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-black/55 text-2xl font-black text-white shadow-xl backdrop-blur-sm transition hover:bg-black/75"
                    aria-label="Next slide"
                  >
                    ›
                  </button>

                  <div className="absolute right-6 bottom-6 z-30 rounded-full bg-black/55 px-3 py-1.5 text-xs font-black text-white backdrop-blur-sm">
                    {safeMediaSlide + 1}/{mediaSlides.length}
                  </div>
                </>
              )}

              <button
                type="button"
                className="absolute right-6 top-6 z-20 inline-flex items-center gap-2 rounded-full bg-[#24683f] px-5 py-2.5 text-sm font-black text-white shadow-lg"
                onClick={() => {
                  resetAdRotation();
                  const fullImage =
                    currentMediaSlide?.image ||
                    activeAd.projectImage ||
                    activeAd.desktopImage ||
                    activeAd.mobileImage;

                  if (fullImage) {
                    window.open(fullImage, "_blank");
                  }
                }}
              >
                ⛶ Full Screen
              </button>
            </div>
          ) : (
            <>
              <Image
                src="/hero-integrated.png"
                alt="Premium modern home"
                fill
                priority
                sizes="100vw"
                className="object-cover object-center"
              />

              <div className="absolute inset-0 bg-gradient-to-r from-[#fbfaf8] via-[#fbfaf8]/95 via-45% to-transparent" />
            </>
          )}

          <div
            className={`relative z-10 flex flex-col justify-center ${
              activeAd
                ? "min-h-[270px] max-w-[500px] p-4 sm:min-h-[200px] sm:p-4 lg:px-7 lg:py-3"
                : "min-h-[620px] max-w-[650px] p-7 sm:p-10 lg:p-14"
            }`}
          >
            {activeAd ? (
              <>
                <div
                  className="inline-flex w-fit items-center gap-2 rounded-full border px-4 py-2 text-[10px] font-black uppercase tracking-[0.15em] shadow-md"
                  style={{
                    backgroundColor:
                      activeAd.primaryColor || "#1F5A3A",
                    borderColor:
                      activeAd.accentColor || "#D4AF55",
                    color:
                      activeAd.buttonTextColor || "#FFFFFF",
                  }}
                >
                  <span className="text-amber-300">★</span>
                  Sponsored Project
                </div>

                {/* BUILDER BRAND */}
                <div className="mt-4 flex items-center gap-4">
                  {activeAd.builderLogo && (
                    <div className="flex h-[82px] w-[82px] shrink-0 items-center justify-center overflow-hidden rounded-xl bg-white/70 p-2">
                      <img
                        src={activeAd.builderLogo}
                        loading="lazy"
                        decoding="async"
                        alt={`${activeAd.sponsorName} logo`}
                        className="h-full w-full object-contain"
                      />
                    </div>
                  )}

                  <div className="min-w-0">
                    <p
                      className="text-[22px] font-black uppercase tracking-[0.08em]"
                      style={{
                        color:
                          activeAd.primaryColor || "#1F5A3A",
                      }}
                    >
                      {activeAd.sponsorName}
                    </p>

                    <div className="mt-1 flex items-center gap-2">
                      <span className="h-px w-10 bg-[#c89e48]" />
                      <span className="text-xs font-semibold tracking-[0.14em] text-[#b88931]">
                        GROUP
                      </span>
                      <span className="h-px w-10 bg-[#c89e48]" />
                    </div>

                    <p className="mt-1 text-[10px] font-semibold text-slate-600">
                      Building Trust. Creating Landmarks.
                    </p>
                  </div>
                </div>

                {/* PROJECT NAME */}
                <div className="mt-4">
                  <h1
                    className="max-w-[470px] font-serif text-3xl font-bold leading-[0.95] tracking-[-0.02em] sm:text-[36px] lg:text-[42px]"
                    style={{
                      color:
                        activeAd.textColor || "#173D2A",
                    }}
                  >
                    {activeAd.projectName || activeAd.title}
                  </h1>

                  {activeAd.location && (
                    <p className="mt-3 flex items-center gap-2 text-sm font-bold text-[#2a6245]">
                      <span className="text-lg">●</span>
                      {activeAd.location}
                    </p>
                  )}

                  <div
                    className="mt-2 h-px w-12"
                    style={{
                      backgroundColor:
                        activeAd.accentColor || "#D4AF55",
                    }}
                  />

                  <p className="mt-2 max-w-md text-sm font-medium leading-5 text-slate-600">
                    {currentMediaSlide?.description ||
                      activeAd.subtitle ||
                      "Premium luxury living in the heart of Jaipur."}
                  </p>
                </div>

                {/* PRICE + ACTIONS */}
                <div className="mt-4 flex flex-wrap items-stretch gap-3">

                  {activeAd.startingPrice && (
                    <div className="flex min-w-[180px] flex-col justify-center rounded-xl border border-[#c9b98c]/70 bg-white/65 px-4 py-3">
                      <span className="text-[10px] font-black uppercase tracking-[0.12em] text-slate-500">
                        Starting Price
                      </span>

                      <span
                        className="mt-1 text-2xl font-black"
                        style={{
                          color:
                            activeAd.primaryColor || "#1F5A3A",
                        }}
                      >
                        {activeAd.startingPrice}
                      </span>

                      <span className="mt-1 text-[10px] font-bold uppercase tracking-wider text-slate-600">
                        Onwards
                      </span>
                    </div>
                  )}

                  <div className="flex flex-col gap-2">
                    <div className="flex flex-wrap gap-2">
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
                          className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl px-5 text-sm font-black shadow-lg transition hover:-translate-y-0.5"
                          style={{
                            backgroundColor:
                              activeAd.buttonColor || "#1F5A3A",
                            color:
                              activeAd.buttonTextColor || "#FFFFFF",
                          }}
                        >
                          {activeAd.ctaLabel || "Explore Project"}
                          <span>→</span>
                        </a>
                      )}

                      {activeAd.builderContact ? (
                        <a
                          href={`tel:${activeAd.builderContact.replace(/\s+/g, "")}`}
                          className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-[#2c7049]/45 bg-white/70 px-4 text-sm font-black text-[#205a39] transition hover:bg-green-50"
                        >
                          ☎ Contact Builder
                        </a>
                      ) : (
                        <button
                          type="button"
                          className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-[#2c7049]/45 bg-white/70 px-4 text-sm font-black text-[#205a39]"
                        >
                          ☎ Contact Builder
                        </button>
                      )}
                    </div>

                    <button
                      type="button"
                      className="inline-flex min-h-10 w-fit items-center justify-center gap-2 rounded-xl border border-[#2c7049]/45 bg-white/70 px-5 text-sm font-black text-[#205a39] transition hover:bg-green-50"
                    >
                      ↓ Brochure
                    </button>
                  </div>
                </div>

                <p className="mt-2 text-[9px] font-semibold uppercase tracking-wider text-slate-500">
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

        {!adOnly && (
          <>
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
          </>
        )}
      </div>
    </section>
  );
}
