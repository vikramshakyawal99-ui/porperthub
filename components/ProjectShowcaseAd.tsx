"use client";

import {
  collection,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import {
  useEffect,
  useState,
} from "react";

import { db } from "@/lib/firebase";
import SponsoredMediaSlider from "./SponsoredMediaSlider";

type AdSlide = {
  id?: string;
  image: string;
  title?: string;
  description?: string;
  order?: number;
};

type ShowcaseCampaign = {
  id: string;
  adType?: "banner" | "showcase";
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
  slides?: AdSlide[];
};

export default function ProjectShowcaseAd() {
  const [campaigns, setCampaigns] =
    useState<ShowcaseCampaign[]>([]);

  const [activeIndex, setActiveIndex] =
    useState(0);

  const campaign =
    campaigns[activeIndex] || null;

  useEffect(() => {
    let mounted = true;

    async function loadCampaigns() {
      try {
        const snapshot = await getDocs(
          query(
            collection(db, "homepageAds"),
            where("active", "==", true)
          )
        );

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const eligible = snapshot.docs
          .map((item) => ({
            id: item.id,
            ...item.data(),
          }) as ShowcaseCampaign)
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
            (first, second) =>
              Number(second.priority || 0) -
              Number(first.priority || 0)
          );

        if (mounted) {
          setCampaigns(eligible);
          setActiveIndex(0);
        }
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

  useEffect(() => {
    if (campaigns.length <= 1) return;

    const timer = window.setInterval(() => {
      setActiveIndex((current) =>
        (current + 1) % campaigns.length
      );
    }, 30000);

    return () => {
      window.clearInterval(timer);
    };
  }, [campaigns.length]);

  if (!campaign) {
    return null;
  }

  return (
    <section className="bg-white px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
      <div className="mx-auto max-w-7xl overflow-hidden rounded-[30px] border border-green-900/20 bg-gradient-to-br from-[#063f32] via-[#07523e] to-[#082f49] shadow-[0_25px_70px_rgba(6,78,59,0.22)]">
        <div className="grid lg:grid-cols-[0.42fr_0.58fr]">
          <div className="flex min-h-[430px] flex-col justify-center p-7 text-white sm:p-10 lg:min-h-[560px] lg:p-12">
            <span className="w-fit rounded-full border border-amber-300/40 bg-black/20 px-3 py-2 text-[10px] font-black uppercase tracking-[0.18em] text-amber-200">
              Sponsored Project Showcase
            </span>

            <p className="mt-7 text-xs font-black uppercase tracking-[0.22em] text-green-300">
              {campaign.sponsorName}
            </p>

            <h2 className="mt-3 text-4xl font-black leading-tight tracking-[-0.04em] sm:text-5xl">
              {campaign.title}
            </h2>

            {campaign.subtitle && (
              <p className="mt-5 max-w-lg text-sm leading-7 text-green-50/80 sm:text-base">
                {campaign.subtitle}
              </p>
            )}

            {campaign.startingPrice && (
              <div className="mt-7">
                <p className="text-xs font-bold uppercase tracking-wider text-green-200/70">
                  Starting Price
                </p>

                <p className="mt-2 text-3xl font-black text-amber-200">
                  {campaign.startingPrice}
                </p>
              </div>
            )}

            {campaign.targetUrl && (
              <a
                href={campaign.targetUrl}
                target={
                  campaign.targetUrl.startsWith("http")
                    ? "_blank"
                    : undefined
                }
                rel={
                  campaign.targetUrl.startsWith("http")
                    ? "noopener noreferrer sponsored"
                    : undefined
                }
                className="mt-8 inline-flex min-h-14 w-fit items-center justify-center gap-3 rounded-xl bg-amber-300 px-6 text-sm font-black text-slate-950 shadow-lg transition hover:-translate-y-0.5 hover:bg-amber-200"
              >
                {campaign.ctaLabel ||
                  "Explore Project"}
                <span>→</span>
              </a>
            )}

            <p className="mt-6 text-[9px] font-bold uppercase tracking-[0.14em] text-white/45">
              Advertisement · PropertyHub
            </p>
          </div>

          <div className="relative min-h-[440px] overflow-hidden border-t border-white/10 lg:min-h-[560px] lg:border-l lg:border-t-0">
            <SponsoredMediaSlider
              key={campaign.id}
              ad={campaign}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
