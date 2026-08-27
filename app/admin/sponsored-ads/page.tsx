"use client";

import {
  type ChangeEvent,
  useEffect,
  useState,
} from "react";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";

import { auth, db } from "@/lib/firebase";

type AdSlide = {
  id: string;
  image: string;
  title: string;
  description: string;
  category?:
    | "overview"
    | "floorplan"
    | "amenity"
    | "location"
    | "investment"
    | "interior";
};

type SponsoredAd = {
  id: string;
  adType?: "banner" | "showcase";
  slides?: AdSlide[];
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
  impressions?: number;
  clicks?: number;
};

const emptyForm = {
  adType: "banner" as "banner" | "showcase",
  sponsorName: "",
  builderLogo: "",
  builderContact: "",
  projectName: "",
  title: "",
  subtitle: "",
  startingPrice: "",
  location: "",
  configuration: "",
  landArea: "",
  towers: "",
  totalUnits: "",
  clubhouse: "",
  openArea: "",
  possession: "",
  reraStatus: "",
  appreciation: "",
  projectHighlights: "",
  whyInvest: "",
  desktopImage: "",
  mobileImage: "",
  ctaLabel: "Explore Project",
  targetUrl: "",
  placement: "both" as "website" | "app" | "both",
  startDate: "",
  endDate: "",
  priority: "1",
  active: true,
  slides: [
    {
      id: "slide-1",
      image: "",
      title: "",
      description: "",
      category: "overview" as const,
    },
  ] as AdSlide[],
};

const inputClass =
  "mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-900 outline-none transition focus:border-green-500 focus:ring-4 focus:ring-green-100";

export default function SponsoredAdsPage() {
  const [ads, setAds] = useState<SponsoredAd[]>([]);
  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [editingAdId, setEditingAdId] =
    useState<string | null>(null);

  const [uploading, setUploading] =
    useState<string>("");

  async function fetchAds() {
    try {
      const snapshot = await getDocs(
        collection(db, "homepageAds")
      );

      const rows = snapshot.docs
        .map((item) => ({
          id: item.id,
          ...item.data(),
        }))
        .sort(
          (a: any, b: any) =>
            Number(b.priority || 0) -
            Number(a.priority || 0)
        ) as SponsoredAd[];

      setAds(rows);
    } catch (error) {
      console.error("SPONSORED ADS LOAD ERROR:", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchAds();
  }, []);

  async function uploadImage(
    event: ChangeEvent<HTMLInputElement>,
    field: "desktopImage" | "mobileImage"
  ) {
    const file = event.target.files?.[0];

    if (!file) return;

    const user = auth.currentUser;

    if (!user) {
      alert("Admin login required.");
      return;
    }

    try {
      setUploading(field);

      const idToken = await user.getIdToken();
      const data = new FormData();

      data.append("file", file);

      const response = await fetch("/api/upload", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${idToken}`,
        },
        body: data,
      });

      const result = await response.json();

      if (!response.ok || !result.secure_url) {
        throw new Error(
          result.error || "Image upload failed."
        );
      }

      setForm((current) => ({
        ...current,
        [field]: result.secure_url,
      }));
    } catch (error) {
      console.error("AD IMAGE UPLOAD ERROR:", error);
      alert(
        error instanceof Error
          ? error.message
          : "Image upload failed."
      );
    } finally {
      setUploading("");
      event.target.value = "";
    }
  }

  function addSlide() {
    setForm((current) => ({
      ...current,
      slides: [
        ...current.slides,
        {
          id: `slide-${Date.now()}`,
          image: "",
          title: "",
          description: "",
          category: "overview",
        },
      ],
    }));
  }

  function updateSlide(
    id: string,
    field: "title" | "description" | "category",
    value: string
  ) {
    setForm((current) => ({
      ...current,
      slides: current.slides.map((slide) =>
        slide.id === id
          ? { ...slide, [field]: value }
          : slide
      ),
    }));
  }

  function removeSlide(id: string) {
    setForm((current) => ({
      ...current,
      slides:
        current.slides.length <= 1
          ? current.slides
          : current.slides.filter(
              (slide) => slide.id !== id
            ),
    }));
  }

  function moveSlide(
    index: number,
    direction: -1 | 1
  ) {
    setForm((current) => {
      const nextIndex = index + direction;

      if (
        nextIndex < 0 ||
        nextIndex >= current.slides.length
      ) {
        return current;
      }

      const slides = [...current.slides];
      const currentSlide = slides[index];

      slides[index] = slides[nextIndex];
      slides[nextIndex] = currentSlide;

      return {
        ...current,
        slides,
      };
    });
  }

  async function uploadSlideImage(
    event: ChangeEvent<HTMLInputElement>,
    slideId: string
  ) {
    const file = event.target.files?.[0];

    if (!file) return;

    const user = auth.currentUser;

    if (!user) {
      alert("Admin login required.");
      return;
    }

    const uploadKey = `slide-${slideId}`;

    try {
      setUploading(uploadKey);

      const idToken = await user.getIdToken();
      const data = new FormData();

      data.append("file", file);

      const response = await fetch("/api/upload", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${idToken}`,
        },
        body: data,
      });

      const result = await response.json();

      if (!response.ok || !result.secure_url) {
        throw new Error(
          result.error || "Slide image upload failed."
        );
      }

      setForm((current) => ({
        ...current,
        slides: current.slides.map((slide) =>
          slide.id === slideId
            ? {
                ...slide,
                image: result.secure_url,
              }
            : slide
        ),
      }));
    } catch (error) {
      console.error(
        "SLIDE IMAGE UPLOAD ERROR:",
        error
      );

      alert(
        error instanceof Error
          ? error.message
          : "Slide image upload failed."
      );
    } finally {
      setUploading("");
      event.target.value = "";
    }
  }

  async function createAd() {
    const completedSlides =
      form.slides.filter((slide) =>
        Boolean(slide.image)
      );

    const baseFieldsMissing =
      !form.sponsorName.trim() ||
      !form.title.trim() ||
      !form.targetUrl.trim();

    const bannerImagesMissing =
      form.adType === "banner" &&
      (!form.desktopImage || !form.mobileImage);

    const showcaseSlidesMissing =
      form.adType === "showcase" &&
      completedSlides.length === 0;

    if (baseFieldsMissing) {
      alert(
        "Sponsor, title and target link are required."
      );
      return;
    }

    if (bannerImagesMissing) {
      alert(
        "Desktop and mobile banner images are required."
      );
      return;
    }

    if (showcaseSlidesMissing) {
      alert(
        "Add at least one Project Showcase slide."
      );
      return;
    }

    try {
      setSaving(true);

      const adData = {
        adType: form.adType,
        sponsorName: form.sponsorName.trim(),
        builderLogo: form.builderLogo.trim(),
        builderContact: form.builderContact.trim(),
        projectName: form.projectName.trim(),
        title: form.title.trim(),
        subtitle: form.subtitle.trim(),
        startingPrice: form.startingPrice.trim(),
        location: form.location.trim(),
        configuration: form.configuration.trim(),
        landArea: form.landArea.trim(),
        towers: form.towers.trim(),
        totalUnits: form.totalUnits.trim(),
        clubhouse: form.clubhouse.trim(),
        openArea: form.openArea.trim(),
        possession: form.possession.trim(),
        reraStatus: form.reraStatus.trim(),
        appreciation: form.appreciation.trim(),
        projectHighlights:
          form.projectHighlights.trim(),
        whyInvest:
          form.whyInvest.trim(),
        desktopImage: form.desktopImage,
        mobileImage: form.mobileImage,
        ctaLabel:
          form.ctaLabel.trim() ||
          "Explore Project",
        targetUrl:
          form.targetUrl.trim(),
        placement: form.placement,
        startDate: form.startDate,
        endDate: form.endDate,
        priority:
          Number(form.priority) || 1,
        active: form.active,

        slides:
          form.adType === "showcase"
            ? form.slides
                .filter((slide) =>
                  Boolean(slide.image)
                )
                .map((slide, index) => ({
                  id: slide.id,
                  image: slide.image,
                  title:
                    slide.title.trim() ||
                    `Project View ${index + 1}`,
                  description:
                    slide.description.trim(),
                  category:
                    slide.category ||
                    "overview",
                  order: index,
                }))
            : [],

        updatedAt:
          serverTimestamp(),
      };

      if (editingAdId) {

        await updateDoc(
          doc(
            db,
            "homepageAds",
            editingAdId
          ),
          adData
        );

        alert(
          "✅ Sponsored advertisement updated."
        );

      } else {

        await addDoc(
          collection(
            db,
            "homepageAds"
          ),
          {
            ...adData,
            impressions: 0,
            clicks: 0,
            createdAt:
              serverTimestamp(),
          }
        );

        alert(
          "✅ Sponsored advertisement created."
        );
      }

      setEditingAdId(null);
      setForm(emptyForm);

      await fetchAds();
    } catch (error) {
      console.error("CREATE AD ERROR:", error);
      alert("Unable to create advertisement.");
    } finally {
      setSaving(false);
    }
  }

  function startEdit(ad: SponsoredAd) {

    setEditingAdId(ad.id);

    setForm({
      adType:
        ad.adType || "banner",

      sponsorName:
        ad.sponsorName || "",

      builderLogo:
        ad.builderLogo || "",

      builderContact:
        ad.builderContact || "",

      projectName:
        ad.projectName || "",

      title:
        ad.title || "",

      subtitle:
        ad.subtitle || "",

      startingPrice:
        ad.startingPrice || "",

      location:
        ad.location || "",

      configuration:
        ad.configuration || "",

      landArea:
        ad.landArea || "",

      towers:
        ad.towers || "",

      totalUnits:
        ad.totalUnits || "",

      clubhouse:
        ad.clubhouse || "",

      openArea:
        ad.openArea || "",

      possession:
        ad.possession || "",

      reraStatus:
        ad.reraStatus || "",

      appreciation:
        ad.appreciation || "",

      projectHighlights:
        ad.projectHighlights || "",

      whyInvest:
        ad.whyInvest || "",

      desktopImage:
        ad.desktopImage || "",

      mobileImage:
        ad.mobileImage || "",

      ctaLabel:
        ad.ctaLabel ||
        "Explore Project",

      targetUrl:
        ad.targetUrl || "",

      placement:
        ad.placement || "both",

      startDate:
        ad.startDate || "",

      endDate:
        ad.endDate || "",

      priority:
        String(ad.priority || 1),

      active:
        ad.active !== false,

      slides:
        ad.slides?.length
          ? ad.slides.map(
              (slide, index) => ({
                id:
                  slide.id ||
                  `slide-${index + 1}`,
                image:
                  slide.image || "",
                title:
                  slide.title || "",
                description:
                  slide.description || "",
                category:
                  slide.category ||
                  "overview",
              })
            )
          : [
              {
                id: "slide-1",
                image: "",
                title: "",
                description: "",
                category:
                  "overview" as const,
              },
            ],
    });

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }


  function cancelEdit() {
    setEditingAdId(null);
    setForm(emptyForm);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }


  async function toggleAd(ad: SponsoredAd) {
    try {
      await updateDoc(
        doc(db, "homepageAds", ad.id),
        {
          active: !ad.active,
          updatedAt: serverTimestamp(),
        }
      );

      setAds((current) =>
        current.map((item) =>
          item.id === ad.id
            ? {
                ...item,
                active: !item.active,
              }
            : item
        )
      );
    } catch (error) {
      console.error("TOGGLE AD ERROR:", error);
      alert("Unable to update advertisement.");
    }
  }

  async function removeAd(id: string) {
    if (!confirm("Delete this sponsored advertisement?")) {
      return;
    }

    try {
      await deleteDoc(
        doc(db, "homepageAds", id)
      );

      setAds((current) =>
        current.filter((item) => item.id !== id)
      );
    } catch (error) {
      console.error("DELETE AD ERROR:", error);
      alert("Unable to delete advertisement.");
    }
  }

  return (
    <main className="min-h-screen bg-slate-50 p-5 text-slate-900 sm:p-8">
      <div className="mx-auto max-w-7xl">
        <header className="mb-8">
          <p className="text-xs font-black uppercase tracking-[0.22em] text-green-700">
            PropertyHub Monetisation
          </p>

          <h1 className="mt-2 text-3xl font-black">
            Sponsored Advertisements
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
            Create paid builder and project campaigns for
            the PropertyHub website and mobile app.
          </p>
        </header>

        <section className="rounded-3xl border border-green-100 bg-white p-5 shadow-sm sm:p-7">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-black">
                Create Advertisement
              </h2>
              <p className="mt-1 text-xs text-slate-500">
                Both desktop and mobile images are required.
              </p>
            </div>

            <span className="rounded-full bg-green-50 px-3 py-2 text-[10px] font-black uppercase tracking-wider text-green-700">
              Admin Only
            </span>
          </div>

          <div className="mb-6 rounded-2xl border border-green-100 bg-green-50/50 p-4">
            <p className="text-sm font-black text-slate-950">
              Advertisement Type
            </p>

            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              <button
                type="button"
                onClick={() =>
                  setForm((current) => ({
                    ...current,
                    adType: "banner",
                  }))
                }
                className={`rounded-xl border p-4 text-left transition ${
                  form.adType === "banner"
                    ? "border-green-600 bg-green-600 text-white shadow-lg shadow-green-600/15"
                    : "border-slate-200 bg-white text-slate-700 hover:border-green-300"
                }`}
              >
                <span className="block font-black">
                  🖼 Homepage Banner Ad
                </span>
                <span
                  className={`mt-1 block text-xs ${
                    form.adType === "banner"
                      ? "text-green-50"
                      : "text-slate-500"
                  }`}
                >
                  Compact banner displayed inside the main Hero.
                </span>
              </button>

              <button
                type="button"
                onClick={() =>
                  setForm((current) => ({
                    ...current,
                    adType: "showcase",
                  }))
                }
                className={`rounded-xl border p-4 text-left transition ${
                  form.adType === "showcase"
                    ? "border-green-600 bg-green-600 text-white shadow-lg shadow-green-600/15"
                    : "border-slate-200 bg-white text-slate-700 hover:border-green-300"
                }`}
              >
                <span className="block font-black">
                  ✨ Project Showcase Ad
                </span>
                <span
                  className={`mt-1 block text-xs ${
                    form.adType === "showcase"
                      ? "text-green-50"
                      : "text-slate-500"
                  }`}
                >
                  Premium project information with media slides.
                </span>
              </button>
            </div>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <label className="text-sm font-bold">
              Sponsor / Builder Name *
              <input
                className={inputClass}
                value={form.sponsorName}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    sponsorName: event.target.value,
                  }))
                }
                placeholder="Example: Manglam Group"
              />
            </label>

            <label className="text-sm font-bold">
              Builder Logo URL
              <input
                className={inputClass}
                value={form.builderLogo}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    builderLogo: event.target.value,
                  }))
                }
                placeholder="https://.../manglam-logo.png"
              />
            </label>

            <label className="text-sm font-bold">
              Builder Contact Number
              <input
                className={inputClass}
                value={form.builderContact}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    builderContact: event.target.value,
                  }))
                }
                placeholder="Example: +91 9876543210"
              />
            </label>

            <label className="text-sm font-bold">
              Advertisement Title *
              <input
                className={inputClass}
                value={form.title}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    title: event.target.value,
                  }))
                }
                placeholder="2, 3 & 4 BHK Apartments"
              />
            </label>

            <label className="text-sm font-bold">
              Subtitle
              <input
                className={inputClass}
                value={form.subtitle}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    subtitle: event.target.value,
                  }))
                }
                placeholder="Premium homes at Jagatpura, Jaipur"
              />
            </label>

            <label className="text-sm font-bold">
              Starting Price
              <input
                className={inputClass}
                value={form.startingPrice}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    startingPrice: event.target.value,
                  }))
                }
                placeholder="Starting ₹56 Lakh onwards"
              />
            </label>

            <label className="text-sm font-bold">
              CTA Label
              <input
                className={inputClass}
                value={form.ctaLabel}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    ctaLabel: event.target.value,
                  }))
                }
                placeholder="Explore Project"
              />
            </label>

            <label className="text-sm font-bold">
              Target Link *
              <input
                className={inputClass}
                value={form.targetUrl}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    targetUrl: event.target.value,
                  }))
                }
                placeholder="/properties/property-id"
              />
            </label>

            <label className="text-sm font-bold">
              Placement
              <select
                className={inputClass}
                value={form.placement}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    placement: event.target.value as
                      | "website"
                      | "app"
                      | "both",
                  }))
                }
              >
                <option value="both">
                  Website + App
                </option>
                <option value="website">
                  Website only
                </option>
                <option value="app">
                  App only
                </option>
              </select>
            </label>

            <label className="text-sm font-bold">
              Priority
              <input
                className={inputClass}
                type="number"
                min="1"
                value={form.priority}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    priority: event.target.value,
                  }))
                }
              />
            </label>

            <label className="text-sm font-bold">
              Start Date
              <input
                className={inputClass}
                type="date"
                value={form.startDate}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    startDate: event.target.value,
                  }))
                }
              />
            </label>

            <label className="text-sm font-bold">
              End Date
              <input
                className={inputClass}
                type="date"
                value={form.endDate}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    endDate: event.target.value,
                  }))
                }
              />
            </label>

            <div
              className={
                form.adType === "banner"
                  ? "block"
                  : "hidden"
              }
            >
              <p className="text-sm font-bold">
                Desktop Banner *
              </p>

              <label className="mt-2 flex min-h-28 cursor-pointer items-center justify-center rounded-2xl border border-dashed border-green-300 bg-green-50 px-4 text-center text-sm font-bold text-green-700 hover:bg-green-100">
                {uploading === "desktopImage"
                  ? "Uploading..."
                  : form.desktopImage
                    ? "✓ Desktop banner uploaded"
                    : "Upload desktop banner"}

                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/avif"
                  className="hidden"
                  disabled={!!uploading}
                  onChange={(event) =>
                    uploadImage(event, "desktopImage")
                  }
                />
              </label>

              {form.desktopImage && (
                <img
                  src={form.desktopImage}
                  alt="Desktop advertisement preview"
                  className="mt-3 aspect-[16/6] w-full rounded-xl object-cover"
                />
              )}
            </div>

            <div
              className={
                form.adType === "banner"
                  ? "block"
                  : "hidden"
              }
            >
              <p className="text-sm font-bold">
                Mobile Banner *
              </p>

              <label className="mt-2 flex min-h-28 cursor-pointer items-center justify-center rounded-2xl border border-dashed border-green-300 bg-green-50 px-4 text-center text-sm font-bold text-green-700 hover:bg-green-100">
                {uploading === "mobileImage"
                  ? "Uploading..."
                  : form.mobileImage
                    ? "✓ Mobile banner uploaded"
                    : "Upload mobile banner"}

                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/avif"
                  className="hidden"
                  disabled={!!uploading}
                  onChange={(event) =>
                    uploadImage(event, "mobileImage")
                  }
                />
              </label>

              {form.mobileImage && (
                <img
                  src={form.mobileImage}
                  alt="Mobile advertisement preview"
                  className="mt-3 aspect-[16/9] w-full rounded-xl object-cover"
                />
              )}
            </div>

          </div>

          {form.adType === "showcase" && (
            <section className="mt-7 rounded-2xl border border-emerald-100 bg-white p-5 shadow-sm">
              <div className="mb-5">
                <p className="text-xs font-black uppercase tracking-[0.18em] text-emerald-600">
                  Project Information
                </p>
                <h3 className="mt-1 text-xl font-black text-slate-900">
                  Left Panel Details
                </h3>
                <p className="mt-1 text-sm text-slate-500">
                  Ye information final Project Showcase ke left panel me dikhegi.
                </p>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <label className="text-sm font-bold">
                  Project Name
                  <input
                    className={inputClass}
                    value={form.projectName}
                    onChange={(e) =>
                      setForm((c) => ({
                        ...c,
                        projectName: e.target.value,
                      }))
                    }
                    placeholder="The Grand Residences"
                  />
                </label>

                <label className="text-sm font-bold">
                  Project Location
                  <input
                    className={inputClass}
                    value={form.location}
                    onChange={(e) =>
                      setForm((c) => ({
                        ...c,
                        location: e.target.value,
                      }))
                    }
                    placeholder="Jagatpura, Jaipur"
                  />
                </label>

                <label className="text-sm font-bold">
                  Configuration
                  <input
                    className={inputClass}
                    value={form.configuration}
                    onChange={(e) =>
                      setForm((c) => ({
                        ...c,
                        configuration: e.target.value,
                      }))
                    }
                    placeholder="2, 3 & 4 BHK"
                  />
                </label>

                <label className="text-sm font-bold">
                  Land Area
                  <input
                    className={inputClass}
                    value={form.landArea}
                    onChange={(e) =>
                      setForm((c) => ({
                        ...c,
                        landArea: e.target.value,
                      }))
                    }
                    placeholder="18 Acres"
                  />
                </label>

                <label className="text-sm font-bold">
                  Towers
                  <input
                    className={inputClass}
                    value={form.towers}
                    onChange={(e) =>
                      setForm((c) => ({
                        ...c,
                        towers: e.target.value,
                      }))
                    }
                    placeholder="12 Towers"
                  />
                </label>

                <label className="text-sm font-bold">
                  Total Units
                  <input
                    className={inputClass}
                    value={form.totalUnits}
                    onChange={(e) =>
                      setForm((c) => ({
                        ...c,
                        totalUnits: e.target.value,
                      }))
                    }
                    placeholder="840 Units"
                  />
                </label>

                <label className="text-sm font-bold">
                  Clubhouse Size
                  <input
                    className={inputClass}
                    value={form.clubhouse}
                    onChange={(e) =>
                      setForm((c) => ({
                        ...c,
                        clubhouse: e.target.value,
                      }))
                    }
                    placeholder="35,000 sq.ft."
                  />
                </label>

                <label className="text-sm font-bold">
                  Open Area
                  <input
                    className={inputClass}
                    value={form.openArea}
                    onChange={(e) =>
                      setForm((c) => ({
                        ...c,
                        openArea: e.target.value,
                      }))
                    }
                    placeholder="72% Open Green Area"
                  />
                </label>

                <label className="text-sm font-bold">
                  Possession
                  <input
                    className={inputClass}
                    value={form.possession}
                    onChange={(e) =>
                      setForm((c) => ({
                        ...c,
                        possession: e.target.value,
                      }))
                    }
                    placeholder="Dec 2028"
                  />
                </label>

                <label className="text-sm font-bold">
                  RERA Status
                  <input
                    className={inputClass}
                    value={form.reraStatus}
                    onChange={(e) =>
                      setForm((c) => ({
                        ...c,
                        reraStatus: e.target.value,
                      }))
                    }
                    placeholder="RERA Approved"
                  />
                </label>

                <label className="text-sm font-bold">
                  Market Appreciation
                  <input
                    className={inputClass}
                    value={form.appreciation}
                    onChange={(e) =>
                      setForm((c) => ({
                        ...c,
                        appreciation: e.target.value,
                      }))
                    }
                    placeholder="18% YoY Growth"
                  />
                </label>
              </div>
            </section>
          )}

          {form.adType === "showcase" && (
            <section className="mt-7 rounded-2xl border border-emerald-800 bg-slate-950 p-5 text-white shadow-sm sm:p-6">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.18em] text-emerald-400">
                  Showcase Intelligence
                </p>

                <h3 className="mt-1 text-xl font-black">
                  Project Highlights & Why Invest
                </h3>

                <p className="mt-2 text-xs leading-5 text-slate-400">
                  Har point ko new line me likho. Homepage par inhe automatically separate points me show kiya jayega.
                </p>
              </div>

              <div className="mt-5 grid gap-5 md:grid-cols-2">
                <label className="text-sm font-bold">
                  Project Highlights
                  <textarea
                    className="mt-2 min-h-40 w-full resize-y rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-sm font-semibold text-white outline-none placeholder:text-slate-500 focus:border-emerald-500"
                    value={form.projectHighlights}
                    onChange={(event) =>
                      setForm((current) => ({
                        ...current,
                        projectHighlights: event.target.value,
                      }))
                    }
                    placeholder={`Premium clubhouse
72% open green area
Low-density development
Smart security system`}
                  />
                </label>

                <label className="text-sm font-bold">
                  Why Invest?
                  <textarea
                    className="mt-2 min-h-40 w-full resize-y rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-sm font-semibold text-white outline-none placeholder:text-slate-500 focus:border-emerald-500"
                    value={form.whyInvest}
                    onChange={(event) =>
                      setForm((current) => ({
                        ...current,
                        whyInvest: event.target.value,
                      }))
                    }
                    placeholder={`High-growth location
Strong rental demand
Excellent connectivity
Trusted developer`}
                  />
                </label>
              </div>
            </section>
          )}

          {form.adType === "showcase" && (

          <section className="mt-7 rounded-2xl border border-green-100 bg-green-50/40 p-4 sm:p-5">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h3 className="text-lg font-black text-slate-950">
                  Project Media Slides
                </h3>

                <p className="mt-1 text-xs leading-5 text-slate-600">
                  Add any project images: villa, plots, building,
                  rooms, park, temple, clubhouse or amenities.
                </p>
              </div>

              <button
                type="button"
                onClick={addSlide}
                className="rounded-xl bg-green-600 px-4 py-3 text-sm font-black text-white hover:bg-green-700"
              >
                ＋ Add New Slide
              </button>
            </div>

            <div className="mt-5 space-y-4">
              {form.slides.map((slide, index) => (
                <article
                  key={slide.id}
                  className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
                >
                  <div className="mb-4 flex items-center justify-between gap-3">
                    <div>
                      <p className="text-xs font-black uppercase tracking-wider text-green-700">
                        Slide {index + 1}
                      </p>
                      <p className="mt-1 text-xs text-slate-500">
                        Display order: {index + 1}
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        disabled={index === 0}
                        onClick={() => moveSlide(index, -1)}
                        className="rounded-lg border px-3 py-2 font-black disabled:opacity-30"
                        title="Move slide up"
                      >
                        ↑
                      </button>

                      <button
                        type="button"
                        disabled={
                          index === form.slides.length - 1
                        }
                        onClick={() => moveSlide(index, 1)}
                        className="rounded-lg border px-3 py-2 font-black disabled:opacity-30"
                        title="Move slide down"
                      >
                        ↓
                      </button>

                      <button
                        type="button"
                        disabled={form.slides.length === 1}
                        onClick={() =>
                          removeSlide(slide.id)
                        }
                        className="rounded-lg border border-red-200 px-3 py-2 text-sm font-black text-red-600 disabled:opacity-30"
                      >
                        Remove
                      </button>
                    </div>
                  </div>

                  <div className="grid gap-4 md:grid-cols-[220px_1fr]">
                    <div>
                      <label className="flex aspect-[4/3] cursor-pointer items-center justify-center overflow-hidden rounded-xl border border-dashed border-green-300 bg-green-50 text-center text-xs font-black text-green-700">
                        {slide.image ? (
                          <img
                            src={slide.image}
                            alt={slide.title || `Slide ${index + 1}`}
                            className="h-full w-full object-cover"
                          />
                        ) : uploading ===
                          `slide-${slide.id}` ? (
                          "Uploading..."
                        ) : (
                          "Upload Slide Image"
                        )}

                        <input
                          type="file"
                          accept="image/jpeg,image/png,image/webp,image/avif"
                          className="hidden"
                          disabled={!!uploading}
                          onChange={(event) =>
                            uploadSlideImage(
                              event,
                              slide.id
                            )
                          }
                        />
                      </label>
                    </div>

                    <div className="space-y-4">
                      <label className="block text-sm font-bold">
                        Slide Category
                        <select
                          className={inputClass}
                          value={slide.category || "overview"}
                          onChange={(event) =>
                            updateSlide(
                              slide.id,
                              "category",
                              event.target.value
                            )
                          }
                        >
                          <option value="overview">
                            🏙 Project Overview
                          </option>
                          <option value="floorplan">
                            📐 Floor Plan
                          </option>
                          <option value="amenity">
                            🏊 Amenity
                          </option>
                          <option value="interior">
                            🛋 Interior
                          </option>
                          <option value="location">
                            📍 Location
                          </option>
                          <option value="investment">
                            📈 Investment
                          </option>
                        </select>
                      </label>

                      <label className="block text-sm font-bold">
                        Slide Title
                        <input
                          className={inputClass}
                          value={slide.title}
                          onChange={(event) =>
                            updateSlide(
                              slide.id,
                              "title",
                              event.target.value
                            )
                          }
                          placeholder="Example: Premium Villa Exterior"
                        />
                      </label>

                      <label className="block text-sm font-bold">
                        Short Description
                        <textarea
                          className={`${inputClass} min-h-24 resize-y`}
                          value={slide.description}
                          onChange={(event) =>
                            updateSlide(
                              slide.id,
                              "description",
                              event.target.value
                            )
                          }
                          placeholder="Optional details about this view"
                        />
                      </label>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </section>
          )}

          <label className="mt-5 flex items-center gap-3 rounded-xl bg-slate-50 p-4 text-sm font-bold">
            <input
              type="checkbox"
              checked={form.active}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  active: event.target.checked,
                }))
              }
              className="h-5 w-5 accent-green-600"
            />
            Activate advertisement immediately
          </label>

          <button
            type="button"
            onClick={createAd}
            disabled={saving || !!uploading}
            className="mt-5 w-full rounded-xl bg-green-600 px-5 py-4 text-sm font-black text-white shadow-lg shadow-green-600/20 hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {saving
              ? editingAdId
                ? "Updating Advertisement..."
                : "Creating Advertisement..."
              : editingAdId
                ? "Update Sponsored Advertisement"
                : "Create Sponsored Advertisement"}
          </button>

          {editingAdId && (
            <button
              type="button"
              onClick={cancelEdit}
              disabled={saving || !!uploading}
              className="mt-3 w-full rounded-xl border border-slate-300 bg-white px-5 py-3 text-sm font-black text-slate-700 hover:bg-slate-50 disabled:opacity-60"
            >
              Cancel Edit
            </button>
          )}
        </section>

        <section className="mt-8">
          <div className="mb-4 flex items-end justify-between">
            <div>
              <p className="text-xs font-black uppercase tracking-wider text-green-700">
                Campaigns
              </p>
              <h2 className="mt-1 text-2xl font-black">
                Existing Advertisements
              </h2>
            </div>

            <span className="text-sm font-bold text-slate-500">
              {ads.length} total
            </span>
          </div>

          {loading ? (
            <div className="rounded-2xl border bg-white p-8 text-center font-bold text-slate-500">
              Loading advertisements...
            </div>
          ) : ads.length === 0 ? (
            <div className="rounded-2xl border bg-white p-8 text-center text-sm text-slate-500">
              No sponsored advertisements created yet.
            </div>
          ) : (
            <div className="grid gap-5 lg:grid-cols-2">
              {ads.map((ad) => (
                <article
                  key={ad.id}
                  className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
                >
                  {(() => {
                    const previewImage =
                      ad.desktopImage ||
                      ad.slides?.find(
                        (slide) =>
                          Boolean(
                            slide.image?.trim()
                          )
                      )?.image ||
                      "";

                    return previewImage ? (
                      <img
                        src={previewImage}
                        alt={
                          ad.title ||
                          "Sponsored advertisement"
                        }
                        className="aspect-[16/6] w-full object-cover"
                      />
                    ) : (
                      <div className="flex aspect-[16/6] w-full items-center justify-center bg-slate-100 text-sm font-bold text-slate-400">
                        No advertisement image
                      </div>
                    );
                  })()}

                  <div className="p-5">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="text-[10px] font-black uppercase tracking-wider text-green-700">
                          {ad.adType === "showcase"
                            ? "PROJECT SHOWCASE"
                            : "HOMEPAGE BANNER"}
                          {" · "}
                          {ad.sponsorName}
                        </p>
                        <h3 className="mt-1 text-lg font-black">
                          {ad.title}
                        </h3>
                      </div>

                      <span
                        className={`rounded-full px-3 py-1 text-[10px] font-black ${
                          ad.active
                            ? "bg-green-50 text-green-700"
                            : "bg-slate-100 text-slate-500"
                        }`}
                      >
                        {ad.active ? "ACTIVE" : "PAUSED"}
                      </span>
                    </div>

                    <p className="mt-3 text-sm text-slate-600">
                      {ad.subtitle || "No subtitle"}
                    </p>

                    <p className="mt-2 text-xs font-bold text-green-700">
                      {(ad.slides || []).length} media slides
                    </p>

                    <div className="mt-4 grid grid-cols-3 gap-2 text-center text-xs">
                      <div className="rounded-xl bg-slate-50 p-3">
                        <p className="font-black">
                          {ad.placement}
                        </p>
                        <p className="mt-1 text-slate-500">
                          Placement
                        </p>
                      </div>

                      <div className="rounded-xl bg-slate-50 p-3">
                        <p className="font-black">
                          {ad.impressions || 0}
                        </p>
                        <p className="mt-1 text-slate-500">
                          Impressions
                        </p>
                      </div>

                      <div className="rounded-xl bg-slate-50 p-3">
                        <p className="font-black">
                          {ad.clicks || 0}
                        </p>
                        <p className="mt-1 text-slate-500">
                          Clicks
                        </p>
                      </div>
                    </div>

                    <div className="mt-5 flex flex-wrap gap-3">

                      <button
                        type="button"
                        onClick={() =>
                          startEdit(ad)
                        }
                        className="flex-1 rounded-xl bg-slate-900 px-4 py-3 text-sm font-black text-white hover:bg-slate-800"
                      >
                        ✎ Edit
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          toggleAd(ad)
                        }
                        className="flex-1 rounded-xl border border-green-600 px-4 py-3 text-sm font-black text-green-700 hover:bg-green-50"
                      >
                        {ad.active
                          ? "Pause"
                          : "Activate"}
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          removeAd(ad.id)
                        }
                        className="rounded-xl border border-red-200 px-4 py-3 text-sm font-black text-red-600 hover:bg-red-50"
                      >
                        Delete
                      </button>

                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
