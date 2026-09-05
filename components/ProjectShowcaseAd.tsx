"use client";

import { getActiveHomepageAds } from "@/lib/homepageAds";
import {
  useEffect,
  useMemo,
  useState,
} from "react";


type AdSlide = {
  id?: string;
  image: string;
  title?: string;
  description?: string;
  order?: number;
  category?:
    | "overview"
    | "floorplan"
    | "amenity"
    | "location"
    | "investment"
    | "interior";
};

type ShowcaseCampaign = {
  id: string;
  adType?: "banner" | "showcase";
  sponsorName: string;
  builderLogo?: string;
  builderContact?: string;
  projectName?: string;
  title: string;
  subtitle: string;
  startingPrice: string;

  location?: string;
  configuration?: string;
  landArea?: string;
  towers?: string;
  totalUnits?: string;
  clubhouse?: string;
  openArea?: string;
  possession?: string;
  reraStatus?: string;
  appreciation?: string;
  projectHighlights?: string;
  whyInvest?: string;

  desktopImage: string;
  mobileImage: string;
  ctaLabel: string;
  targetUrl: string;

  placement: "website" | "app" | "both";
  startDate: string;
  endDate: string;
  priority: number;
  active: boolean;

  slides?: AdSlide[];
};

export default function ProjectShowcaseAd() {
  const [campaigns, setCampaigns] =
    useState<ShowcaseCampaign[]>([]);

  const [campaignIndex, setCampaignIndex] =
    useState(0);

  const [activeIndex, setActiveIndex] =
    useState(0);

  const [adInteractionVersion, setAdInteractionVersion] =
    useState(0);

  function resetAdRotation() {
    setAdInteractionVersion((current) => current + 1);
  }

  const [isFullscreen, setIsFullscreen] =
    useState(false);

  const campaign =
    campaigns[campaignIndex] || null;

  useEffect(() => {
    let mounted = true;

    async function loadCampaigns() {
      try {
        const activeHomepageAds =
          await getActiveHomepageAds();

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const eligible = activeHomepageAds
          .map(
            (item) =>
              item as ShowcaseCampaign
          )
          .filter((item) => {
            const placementMatch =
              item.placement === "website" ||
              item.placement === "both";

            const started =
              !item.startDate ||
              new Date(
                `${item.startDate}T00:00:00`
              ) <= today;

            const notExpired =
              !item.endDate ||
              new Date(
                `${item.endDate}T23:59:59`
              ) >= today;

            const hasSlides =
              Array.isArray(item.slides) &&
              item.slides.some(
                (slide) => Boolean(slide.image)
              );

            return (
              item.adType === "showcase" &&
              placementMatch &&
              started &&
              notExpired &&
              hasSlides
            );
          })
          .sort(
            (a, b) =>
              Number(b.priority || 0) -
              Number(a.priority || 0)
          );

        if (!mounted) return;

        setCampaigns(eligible);
        setCampaignIndex(0);
        setActiveIndex(0);
      } catch (error) {
        console.error(
          "PROJECT SHOWCASE LOAD ERROR:",
          error
        );

        if (mounted) {
          setCampaigns([]);
        }
      }
    }

    loadCampaigns();

    return () => {
      mounted = false;
    };
  }, []);

  const slides = useMemo(() => {
    if (!campaign) return [];

    return (campaign.slides || [])
      .filter((slide) => Boolean(slide.image))
      .sort(
        (a, b) =>
          Number(a.order || 0) -
          Number(b.order || 0)
      );
  }, [campaign]);

  const totalSlides = slides.length + 1;

  useEffect(() => {
    setActiveIndex(0);
  }, [campaign?.id]);

  useEffect(() => {
    if (campaigns.length <= 1) return;

    const timer = window.setTimeout(() => {
      if (document.hidden) {
        resetAdRotation();
        return;
      }

      setCampaignIndex(
        (current) =>
          (current + 1) %
          campaigns.length
      );

      setActiveIndex(0);
    }, 5000);

    return () => {
      window.clearTimeout(timer);
    };
  }, [
    campaigns.length,
    campaignIndex,
    adInteractionVersion,
  ]);

  if (
    !campaign ||
    slides.length === 0
  ) {
    return null;
  }

  const showHighlights =
    activeIndex === slides.length;

  const activeSlide =
    slides[
      Math.min(
        activeIndex,
        slides.length - 1
      )
    ] || slides[0];

  const configuration =
    campaign.configuration ||
    campaign.title;

  const parsedHighlights = (
    campaign.projectHighlights || ""
  )
    .split(/\r?\n|\|/)
    .map((item) => item.trim())
    .filter(Boolean);

  const keyHighlights =
    parsedHighlights.length > 0
      ? parsedHighlights.slice(0, 6)
      : [
          "Premium residential project in a prime location",
          "Thoughtfully planned homes with ample light and ventilation",
          "Premium clubhouse and lifestyle amenities",
          "24x7 security and CCTV surveillance",
          "RERA approved project",
          "Easy payment plans",
        ];

  function previousSlide() {
    resetAdRotation();
    setActiveIndex(
      (current) =>
        (current - 1 + totalSlides) %
        totalSlides
    );
  }

  function nextSlide() {
    resetAdRotation();
    setActiveIndex(
      (current) =>
        (current + 1) % totalSlides
    );
  }

  return (
    <section className="bg-white py-2">
      <div className="mx-auto max-w-[1500px]">

        <div className="relative overflow-hidden rounded-[22px] border border-amber-400/60 bg-gradient-to-br from-[#043f32] via-[#054737] to-[#033428] p-3 shadow-[0_24px_70px_rgba(2,44,34,0.22)] sm:p-4">

          {/* TOP AD LABEL */}
          <div className="mb-3 flex items-center justify-between gap-4 px-1">

            <span className="inline-flex items-center gap-2 rounded-full border border-amber-300/35 bg-black/15 px-4 py-2 text-[11px] font-black uppercase tracking-[0.13em] text-amber-300">
              <span>★</span>
              Sponsored Project
            </span>

            <span className="text-[10px] font-bold uppercase tracking-[0.12em] text-white/60">
              Advertisement · PropertyHub
            </span>
          </div>

          <div className="grid overflow-hidden rounded-[22px] border border-white/10 bg-[#043c30] lg:grid-cols-[440px_minmax(0,1fr)]">

            {/* LEFT INFO */}
            <div className="flex min-h-[330px] flex-col justify-between border-b border-white/10 p-5 text-white lg:border-b-0 lg:border-r lg:p-5">

              <div>
                <div className="flex items-center gap-4">
                  {campaign.builderLogo && (
                    <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-amber-300/40 bg-white p-2 shadow-[0_0_24px_rgba(252,211,77,0.16)]">
                      <img
                        src={campaign.builderLogo}
                        loading="lazy"
                        decoding="async"
                        alt={`${campaign.sponsorName} logo`}
                        className="h-full w-full object-contain"
                      />
                    </div>
                  )}

                  <div className="min-w-0">
                    <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-white/45">
                      Builder
                    </p>

                    <div className="mt-1 inline-flex items-center rounded-xl border border-amber-300/35 bg-amber-300/10 px-3 py-1.5">
                      <p className="text-base font-black uppercase tracking-[0.11em] text-amber-300">
                        {campaign.sponsorName}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="my-4 h-px bg-gradient-to-r from-amber-300/45 via-white/10 to-transparent" />

                {campaign.projectName && (
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.18em] text-amber-300/85">
                      Project Name
                    </p>

                    <h2 className="mt-1 text-2xl font-black leading-tight tracking-[-0.025em] text-white">
                      {campaign.projectName}
                    </h2>
                  </div>
                )}

                <div className="mt-3 flex items-start gap-2 text-sm text-white/80">
                  <span className="mt-0.5 text-amber-300">●</span>
                  <p>
                    {campaign.location || "Jaipur"}
                  </p>
                </div>

                <p className="mt-2 text-sm font-semibold italic leading-5 text-amber-200/90">
                  {campaign.subtitle ||
                    "Premium luxury living crafted for an elevated lifestyle."}
                </p>
              </div>

              <div className="mt-4">
                <p className="text-sm text-white/70">
                  Starting from
                </p>

                <p className="mt-1 text-4xl font-black text-amber-300">
                  {campaign.startingPrice ||
                    "Price on Request"}
                </p>

                <p className="mt-1 text-sm text-white/70">
                  Onwards
                </p>

                <div className="mt-5 flex flex-wrap gap-3">

                  {campaign.targetUrl && (
                    <a
                      href={campaign.targetUrl}
                      target={
                        campaign.targetUrl.startsWith(
                          "http"
                        )
                          ? "_blank"
                          : undefined
                      }
                      rel={
                        campaign.targetUrl.startsWith(
                          "http"
                        )
                          ? "noopener noreferrer sponsored"
                          : undefined
                      }
                      className="inline-flex min-h-12 items-center justify-center gap-3 rounded-xl bg-gradient-to-r from-amber-300 to-amber-400 px-6 text-sm font-black text-slate-950 shadow-lg transition hover:-translate-y-0.5"
                    >
                      {campaign.ctaLabel ||
                        "View Details"}
                      <span>→</span>
                    </a>
                  )}

                  <button
                    type="button"
                    className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-amber-300/60 px-5 text-sm font-black text-white transition hover:bg-white/10"
                  >
                    ↓ Brochure
                  </button>

                  {campaign.builderContact && (
                    <a
                      href={`tel:${campaign.builderContact.replace(/\s+/g, "")}`}
                      className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-white/25 bg-white/10 px-5 text-sm font-black text-white transition hover:bg-white hover:text-[#043c30]"
                    >
                      ☎ Contact Builder
                    </a>
                  )}
                </div>

                <p className="mt-5 text-xs text-white/65">
                  🔥 Limited inventory available.
                  <span className="ml-1 font-bold text-amber-300">
                    Book your dream home today!
                  </span>
                </p>
              </div>
            </div>

            {/* RIGHT SLIDER */}
            <div className="relative min-h-[330px] overflow-hidden bg-slate-950">

              <img
                key={activeSlide.image}
                src={activeSlide.image}
                loading="lazy"
                decoding="async"
                alt={
                  activeSlide.title ||
                  campaign.title
                }
                className="absolute inset-0 h-full w-full object-cover"
              />

              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/15" />

              {/* LAST SLIDE - KEY HIGHLIGHTS */}
              {showHighlights && (
                <div className="absolute inset-0 z-30 flex items-center justify-center bg-black px-6 py-7">

                  {/* STORY PROGRESS */}
                  <div className="absolute left-1/2 top-5 flex w-[52%] -translate-x-1/2 gap-2">
                    {Array.from({
                      length: totalSlides,
                    }).map((_, index) => (
                      <button
                        key={`highlight-progress-${index}`}
                        type="button"
                        onClick={() =>
                          setActiveIndex(index)
                        }
                        className="h-1.5 flex-1 overflow-hidden rounded-full bg-white/35"
                        aria-label={`Open slide ${
                          index + 1
                        }`}
                      >
                        <span
                          className={`block h-full rounded-full ${
                            activeIndex === index
                              ? "w-full bg-amber-300"
                              : index < activeIndex
                                ? "w-full bg-white"
                                : "w-0"
                          }`}
                        />
                      </button>
                    ))}
                  </div>

                  <button
                    type="button"
                    onClick={previousSlide}
                    aria-label="Previous slide"
                    className="absolute left-5 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-white/10 text-3xl text-white transition hover:bg-white/20"
                  >
                    ‹
                  </button>

                  <button
                    type="button"
                    onClick={nextSlide}
                    aria-label="Next slide"
                    className="absolute right-5 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-white/10 text-3xl text-white transition hover:bg-white/20"
                  >
                    ›
                  </button>

                  <div className="w-full max-w-[520px] rounded-[24px] border border-white/25 bg-[#080808] p-7 shadow-2xl">

                    <h3 className="text-2xl font-black text-white">
                      Key Highlights
                    </h3>

                    <div className="mt-6 space-y-4">
                      {keyHighlights.map(
                        (highlight, index) => (
                          <div
                            key={`${highlight}-${index}`}
                            className="flex items-start gap-4"
                          >
                            <span className="mt-0.5 text-xl font-black text-white">
                              ✓
                            </span>

                            <p className="text-base font-medium leading-6 text-white/90">
                              {highlight}
                            </p>
                          </div>
                        )
                      )}
                    </div>

                    <button
                      type="button"
                      onClick={() =>
                        setActiveIndex(0)
                      }
                      className="mt-7 flex min-h-12 w-full items-center justify-center gap-2 rounded-lg border border-white/80 text-sm font-black text-white transition hover:bg-white hover:text-black"
                    >
                      ↻ Watch Again
                    </button>
                  </div>
                </div>
              )}

              {/* FULL SCREEN */}
              {!showHighlights && (
                <button
                  type="button"
                  onClick={() => { resetAdRotation(); setIsFullscreen(true); }}
                  aria-label="View image full screen"
                  className="absolute right-5 top-5 z-30 flex h-10 items-center justify-center gap-2 rounded-xl border border-white/30 bg-black/45 px-3 text-xs font-black text-white shadow-lg backdrop-blur-md transition hover:bg-black/70"
                >
                  <span className="text-base">⛶</span>
                  Full Screen
                </button>
              )}

              {/* PROGRESS */}
              <div className="absolute left-1/2 top-5 z-20 flex w-[46%] -translate-x-1/2 gap-2">

                {slides.map(
                  (slide, index) => (
                    <button
                      key={
                        slide.id ||
                        `${slide.image}-${index}`
                      }
                      type="button"
                      onClick={() => {
                        resetAdRotation();
                        setActiveIndex(index);
                      }}
                      className="h-1.5 flex-1 overflow-hidden rounded-full bg-white/55"
                      aria-label={`Open image ${
                        index + 1
                      }`}
                    >
                      <span
                        className={`block h-full rounded-full ${
                          activeIndex === index
                            ? "w-full bg-amber-300"
                            : index <
                                activeIndex
                              ? "w-full bg-white"
                              : "w-0"
                        }`}
                      />
                    </button>
                  )
                )}
              </div>

              {slides.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={previousSlide}
                    aria-label="Previous image"
                    className="absolute left-5 top-1/2 z-20 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-amber-300/40 bg-[#043c30]/90 text-3xl text-amber-300 shadow-xl backdrop-blur transition hover:scale-105"
                  >
                    ‹
                  </button>

                  <button
                    type="button"
                    onClick={nextSlide}
                    aria-label="Next image"
                    className="absolute right-5 top-1/2 z-20 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-amber-300/40 bg-[#043c30]/90 text-3xl text-amber-300 shadow-xl backdrop-blur transition hover:scale-105"
                  >
                    ›
                  </button>
                </>
              )}

              {/* TITLE */}
              <div className="absolute bottom-[100px] left-7 right-7 z-10">

                <p className="text-[10px] font-black uppercase tracking-[0.16em] text-amber-300">
                  Project View
                </p>

                <h3 className="mt-1 text-2xl font-black text-white sm:text-3xl">
                  {activeSlide.title ||
                    campaign.title}
                </h3>

                {activeSlide.description && (
                  <p className="mt-1 max-w-xl text-sm leading-6 text-white/75">
                    {
                      activeSlide.description
                    }
                  </p>
                )}
              </div>

              {/* BOTTOM STATS */}
              <div className="absolute bottom-4 left-4 right-4 z-20 grid grid-cols-2 overflow-hidden rounded-2xl border border-emerald-300/20 bg-[#043c30]/94 backdrop-blur-md sm:grid-cols-4">

                <Stat
                  label={
                    configuration ||
                    "Premium Homes"
                  }
                  sub="Apartments"
                />

                <Stat
                  label={
                    campaign.towers ||
                    "Premium Towers"
                  }
                  sub="Project"
                />

                <Stat
                  label={
                    campaign.clubhouse ||
                    "Clubhouse"
                  }
                  sub="Lifestyle"
                />

                <Stat
                  label={
                    campaign.openArea ||
                    "25+"
                  }
                  sub={
                    campaign.openArea
                      ? "Open Area"
                      : "Amenities"
                  }
                />

              </div>
            </div>
          </div>
        </div>
      </div>

      {isFullscreen && !showHighlights && (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/95 p-4"
          onClick={() => setIsFullscreen(false)}
        >
          <button
            type="button"
            onClick={() => setIsFullscreen(false)}
            aria-label="Close full screen"
            className="absolute right-6 top-6 z-20 flex h-12 w-12 items-center justify-center rounded-full border border-white/25 bg-black/60 text-2xl font-bold text-white backdrop-blur transition hover:bg-white hover:text-black"
          >
            ×
          </button>

          {slides.length > 1 && (
            <>
              <button
                type="button"
                onClick={(event) => {
                  event.stopPropagation();
                  previousSlide();
                }}
                className="absolute left-6 top-1/2 z-20 flex h-14 w-14 -translate-y-1/2 items-center justify-center rounded-full border border-white/25 bg-black/50 text-4xl text-white backdrop-blur transition hover:bg-white/20"
                aria-label="Previous image"
              >
                ‹
              </button>

              <button
                type="button"
                onClick={(event) => {
                  event.stopPropagation();
                  nextSlide();
                }}
                className="absolute right-6 top-1/2 z-20 flex h-14 w-14 -translate-y-1/2 items-center justify-center rounded-full border border-white/25 bg-black/50 text-4xl text-white backdrop-blur transition hover:bg-white/20"
                aria-label="Next image"
              >
                ›
              </button>
            </>
          )}

          <img
            src={activeSlide.image}
            decoding="async"
            alt={activeSlide.title || campaign.title}
            onClick={(event) => event.stopPropagation()}
            className="max-h-[92vh] max-w-[94vw] object-contain"
          />
        </div>
      )}
    </section>
  );
}

function Info({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div>
      <p className="text-[10px] font-black uppercase tracking-[0.12em] text-amber-300">
        {label}
      </p>

      <p className="mt-1 text-sm font-bold text-white">
        {value}
      </p>
    </div>
  );
}

function Feature({
  text,
}: {
  text: string;
}) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-amber-300">
        ✓
      </span>

      <span className="text-white/85">
        {text}
      </span>
    </div>
  );
}

function Stat({
  label,
  sub,
}: {
  label: string;
  sub: string;
}) {
  return (
    <div className="border-white/10 px-4 py-4 text-center sm:border-r last:border-r-0">
      <p className="text-sm font-black text-white">
        {label}
      </p>

      <p className="mt-1 text-[11px] text-amber-200/75">
        {sub}
      </p>
    </div>
  );
}
