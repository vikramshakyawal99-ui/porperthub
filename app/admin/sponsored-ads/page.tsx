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

type SponsoredAd = {
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
  impressions?: number;
  clicks?: number;
};

const emptyForm = {
  sponsorName: "",
  title: "",
  subtitle: "",
  startingPrice: "",
  desktopImage: "",
  mobileImage: "",
  ctaLabel: "Explore Project",
  targetUrl: "",
  placement: "both" as "website" | "app" | "both",
  startDate: "",
  endDate: "",
  priority: "1",
  active: true,
};

const inputClass =
  "mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-900 outline-none transition focus:border-green-500 focus:ring-4 focus:ring-green-100";

export default function SponsoredAdsPage() {
  const [ads, setAds] = useState<SponsoredAd[]>([]);
  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState<
    "" | "desktopImage" | "mobileImage"
  >("");

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

  async function createAd() {
    if (
      !form.sponsorName.trim() ||
      !form.title.trim() ||
      !form.desktopImage ||
      !form.mobileImage ||
      !form.targetUrl.trim()
    ) {
      alert(
        "Sponsor, title, both images and target link are required."
      );
      return;
    }

    try {
      setSaving(true);

      await addDoc(collection(db, "homepageAds"), {
        sponsorName: form.sponsorName.trim(),
        title: form.title.trim(),
        subtitle: form.subtitle.trim(),
        startingPrice: form.startingPrice.trim(),
        desktopImage: form.desktopImage,
        mobileImage: form.mobileImage,
        ctaLabel:
          form.ctaLabel.trim() || "Explore Project",
        targetUrl: form.targetUrl.trim(),
        placement: form.placement,
        startDate: form.startDate,
        endDate: form.endDate,
        priority:
          Number(form.priority) || 1,
        active: form.active,
        impressions: 0,
        clicks: 0,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });

      setForm(emptyForm);
      await fetchAds();

      alert("✅ Sponsored advertisement created.");
    } catch (error) {
      console.error("CREATE AD ERROR:", error);
      alert("Unable to create advertisement.");
    } finally {
      setSaving(false);
    }
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

            <div>
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

            <div>
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
              ? "Creating Advertisement..."
              : "Create Sponsored Advertisement"}
          </button>
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
                  <img
                    src={ad.desktopImage}
                    alt={ad.title}
                    className="aspect-[16/6] w-full object-cover"
                  />

                  <div className="p-5">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="text-[10px] font-black uppercase tracking-wider text-green-700">
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

                    <div className="mt-5 flex gap-3">
                      <button
                        type="button"
                        onClick={() => toggleAd(ad)}
                        className="flex-1 rounded-xl border border-green-600 px-4 py-3 text-sm font-black text-green-700 hover:bg-green-50"
                      >
                        {ad.active ? "Pause" : "Activate"}
                      </button>

                      <button
                        type="button"
                        onClick={() => removeAd(ad.id)}
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
