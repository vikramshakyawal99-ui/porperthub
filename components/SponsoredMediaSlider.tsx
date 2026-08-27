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
    }, 5500);

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
        className="absolute inset-0 h-full w-full object-cover object-center"
      />

      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/15 via-transparent to-black/30" />

      {slides.length > 1 && (
        <>
          <div className="absolute right-5 top-5 z-20 flex items-center gap-2 rounded-full border border-white/25 bg-black/25 px-3 py-2 backdrop-blur-md sm:right-7 sm:top-7">
            {slides.map((slide, index) => (
              <button
                key={
                  slide.id ||
                  `${slide.image}-${index}`
                }
                type="button"
                aria-label={`Open slide ${index + 1}`}
                onClick={() => goToSlide(index)}
                className={`h-2.5 rounded-full transition-all duration-300 ${
                  activeIndex === index
                    ? "w-7 bg-white"
                    : "w-2.5 bg-white/50 hover:bg-white/80"
                }`}
              />
            ))}
          </div>

          <button
            type="button"
            onClick={showPrevious}
            aria-label="Previous project image"
            className="absolute left-4 top-1/2 z-20 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/40 bg-black/30 text-2xl font-black text-white backdrop-blur-md transition hover:bg-emerald-600 sm:flex"
          >
            ‹
          </button>

          <button
            type="button"
            onClick={showNext}
            aria-label="Next project image"
            className="absolute right-4 top-1/2 z-20 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/40 bg-black/30 text-2xl font-black text-white backdrop-blur-md transition hover:bg-emerald-600 sm:flex"
          >
            ›
          </button>

          <div className="absolute bottom-5 right-5 z-20 hidden max-w-[46%] gap-2 rounded-2xl border border-white/25 bg-black/25 p-2.5 backdrop-blur-md md:flex lg:bottom-7 lg:right-7">
            {slides.slice(0, 6).map(
              (slide, index) => (
                <button
                  key={
                    slide.id ||
                    `${slide.image}-${index}`
                  }
                  type="button"
                  onClick={() =>
                    goToSlide(index)
                  }
                  className={`group relative h-14 w-20 overflow-hidden rounded-xl border-2 transition ${
                    activeIndex === index
                      ? "border-white shadow-md"
                      : "border-white/25 hover:border-white/70"
                  }`}
                  title={
                    slide.title ||
                    `Slide ${index + 1}`
                  }
                >
                  <img
                    src={slide.image}
                    alt=""
                    className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                  />
                </button>
              )
            )}
          </div>

          <div className="absolute bottom-4 left-4 right-4 z-20 flex gap-2 overflow-x-auto rounded-xl bg-black/30 p-2 backdrop-blur md:hidden">
            {slides.map((slide, index) => (
              <button
                key={
                  slide.id ||
                  `${slide.image}-${index}`
                }
                type="button"
                onClick={() => goToSlide(index)}
                className={`h-11 min-w-16 overflow-hidden rounded-lg border-2 ${
                  activeIndex === index
                    ? "border-white"
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
        <div className="absolute right-7 top-20 z-10 hidden max-w-xs rounded-2xl border border-white/25 bg-black/30 px-4 py-3 text-white backdrop-blur-md lg:block">
          {activeSlide.title && (
            <p className="text-sm font-extrabold">
              {activeSlide.title}
            </p>
          )}

          {activeSlide.description && (
            <p className="mt-1 line-clamp-2 text-xs leading-5 text-white/80">
              {activeSlide.description}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
