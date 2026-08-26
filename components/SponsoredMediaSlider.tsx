"use client";

import {
  useEffect,
  useRef,
  useState,
} from "react";

type AdSlide = {
  id?: string;
  image: string;
  title?: string;
  description?: string;
  order?: number;
};

type Advertisement = {
  title: string;
  desktopImage: string;
  mobileImage?: string;
  slides?: AdSlide[];
};

type Props = {
  ad: Advertisement;
};

export default function SponsoredMediaSlider({
  ad,
}: Props) {
  const slides: AdSlide[] =
    Array.isArray(ad.slides) &&
    ad.slides.some((slide) => slide?.image)
      ? ad.slides
          .filter((slide) => Boolean(slide?.image))
          .sort(
            (first, second) =>
              Number(first.order || 0) -
              Number(second.order || 0)
          )
      : [
          {
            id: "legacy-banner",
            image: ad.desktopImage,
            title: ad.title,
            description: "",
          },
        ];

  const [activeIndex, setActiveIndex] =
    useState(0);

  const touchStartX = useRef<number | null>(
    null
  );

  const activeSlide =
    slides[activeIndex] || slides[0];

  function goToSlide(index: number) {
    setActiveIndex(
      ((index % slides.length) + slides.length) %
        slides.length
    );
  }

  function showPrevious() {
    goToSlide(activeIndex - 1);
  }

  function showNext() {
    goToSlide(activeIndex + 1);
  }

  useEffect(() => {
    setActiveIndex(0);
  }, [ad.desktopImage]);

  useEffect(() => {
    if (slides.length <= 1) return;

    const timer = window.setInterval(() => {
      setActiveIndex((current) =>
        (current + 1) % slides.length
      );
    }, 5000);

    return () => {
      window.clearInterval(timer);
    };
  }, [slides.length]);

  function handleTouchStart(
    event: React.TouchEvent<HTMLDivElement>
  ) {
    touchStartX.current =
      event.touches[0]?.clientX ?? null;
  }

  function handleTouchEnd(
    event: React.TouchEvent<HTMLDivElement>
  ) {
    if (touchStartX.current === null) {
      return;
    }

    const endX =
      event.changedTouches[0]?.clientX ??
      touchStartX.current;

    const difference =
      touchStartX.current - endX;

    if (Math.abs(difference) >= 45) {
      if (difference > 0) {
        showNext();
      } else {
        showPrevious();
      }
    }

    touchStartX.current = null;
  }

  return (
    <div
      className="absolute inset-0"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <img
        key={activeSlide.image}
        src={activeSlide.image}
        alt={
          activeSlide.title ||
          ad.title ||
          "Sponsored project"
        }
        className="absolute inset-0 h-full w-full object-cover object-center transition-opacity duration-500"
      />

      <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-slate-950/90 via-slate-950/60 via-55% to-slate-950/10" />

      {slides.length > 1 && (
        <>
          {/* TOP PROGRESS INDICATORS */}
          <div className="absolute left-1/2 top-4 z-20 flex w-[min(330px,60%)] -translate-x-1/2 gap-1.5">
            {slides.map((slide, index) => (
              <button
                key={
                  slide.id ||
                  `${slide.image}-${index}`
                }
                type="button"
                aria-label={`Open slide ${index + 1}`}
                onClick={() => goToSlide(index)}
                className="h-1 flex-1 overflow-hidden rounded-full bg-white/35"
              >
                <span
                  className={`block h-full rounded-full transition-all duration-300 ${
                    activeIndex === index
                      ? "w-full bg-green-400"
                      : index < activeIndex
                        ? "w-full bg-white/80"
                        : "w-0"
                  }`}
                />
              </button>
            ))}
          </div>

          {/* DESKTOP SIDE THUMBNAILS */}
          <div className="absolute right-4 top-1/2 z-20 hidden max-h-[250px] -translate-y-1/2 flex-col gap-2 overflow-y-auto rounded-2xl border border-white/15 bg-slate-950/55 p-2 backdrop-blur-md sm:flex">
            {slides.map((slide, index) => (
              <button
                key={
                  slide.id ||
                  `${slide.image}-${index}`
                }
                type="button"
                onClick={() => goToSlide(index)}
                className={`group relative h-12 w-16 overflow-hidden rounded-lg border-2 transition ${
                  activeIndex === index
                    ? "border-green-400 shadow-[0_0_0_2px_rgba(74,222,128,0.20)]"
                    : "border-white/20 hover:border-white/70"
                }`}
                title={
                  slide.title ||
                  `Slide ${index + 1}`
                }
              >
                <img
                  src={slide.image}
                  alt=""
                  className="h-full w-full object-cover"
                />
              </button>
            ))}
          </div>

          {/* PREVIOUS / NEXT ARROWS */}
          <button
            type="button"
            onClick={showPrevious}
            aria-label="Previous project image"
            className="absolute left-[52%] top-1/2 z-20 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/40 bg-black/40 text-2xl font-black text-white backdrop-blur transition hover:bg-green-600 sm:flex"
          >
            ‹
          </button>

          <button
            type="button"
            onClick={showNext}
            aria-label="Next project image"
            className="absolute right-24 top-1/2 z-20 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/40 bg-black/40 text-2xl font-black text-white backdrop-blur transition hover:bg-green-600 sm:flex"
          >
            ›
          </button>

          {/* MOBILE THUMBNAILS */}
          <div className="absolute bottom-3 left-3 right-3 z-20 flex gap-2 overflow-x-auto rounded-xl bg-black/45 p-2 backdrop-blur sm:hidden">
            {slides.map((slide, index) => (
              <button
                key={
                  slide.id ||
                  `${slide.image}-${index}`
                }
                type="button"
                onClick={() => goToSlide(index)}
                className={`h-11 min-w-14 overflow-hidden rounded-lg border-2 ${
                  activeIndex === index
                    ? "border-green-400"
                    : "border-white/30"
                }`}
              >
                <img
                  src={slide.image}
                  alt=""
                  className="h-full w-full object-cover"
                />
              </button>
            ))}
          </div>
        </>
      )}

      {(activeSlide.title ||
        activeSlide.description) && (
        <div className="absolute bottom-4 right-24 z-10 hidden max-w-sm rounded-xl border border-white/15 bg-black/55 px-4 py-3 text-white backdrop-blur sm:block">
          {activeSlide.title && (
            <p className="text-sm font-black">
              {activeSlide.title}
            </p>
          )}

          {activeSlide.description && (
            <p className="mt-1 line-clamp-2 text-xs leading-5 text-white/75">
              {activeSlide.description}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
