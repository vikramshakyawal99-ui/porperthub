"use client";

import { FormEvent, useEffect, useState } from "react";
import {
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signInWithCustomToken,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import {
  doc,
  getDoc,
  serverTimestamp,
  setDoc,
} from "firebase/firestore";

import Link from "next/link";

import { auth, db } from "@/lib/firebase";

type AccountType = "customer" | "business";
type BusinessType = "dealer" | "builder";
type LoginMethod = "password" | "otp";

const OWNER_ROLES = [
  "property_owner",
  "hostel_owner",
  "pg_owner",
  "room_owner",
  "resale_seller",
];

function getDashboard(role?: string) {
  if (role === "property_dealer") {
    return "/dealer/dashboard";
  }

  if (role && OWNER_ROLES.includes(role)) {
    return "/owner/dashboard";
  }

  return "/properties";
}

function getReadableError(error: unknown) {
  const code =
    typeof error === "object" &&
    error !== null &&
    "code" in error
      ? String(error.code)
      : "";

  if (code === "auth/invalid-credential") {
    return "Email ya password sahi nahi hai.";
  }

  if (code === "auth/email-already-in-use") {
    return "Is email se account pehle se bana hua hai.";
  }

  if (code === "auth/weak-password") {
    return "Password kam se kam 6 characters ka rakhein.";
  }

  if (code === "auth/invalid-email") {
    return "Valid email address enter karein.";
  }

  return "Something went wrong. Please try again.";
}

export default function BuyerLogin() {
  const [isSignup, setIsSignup] = useState(false);
  const [accountType, setAccountType] =
    useState<AccountType>("customer");
  const [businessType, setBusinessType] =
    useState<BusinessType>("dealer");

  const [name, setName] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("Jaipur");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginMethod, setLoginMethod] =
    useState<LoginMethod>("password");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otpMessage, setOtpMessage] = useState("");

  const [redirectPath, setRedirectPath] =
    useState("/properties");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Hidden staff keyboard shortcut
  // Mac + Windows: Shift + A + R
  useEffect(() => {
    const pressedStaffKeys = new Set<string>();

    function handleStaffKeyDown(
      event: KeyboardEvent
    ) {
      pressedStaffKeys.add(
        event.key.toLowerCase()
      );

      const shiftPressed = event.shiftKey;
      const aPressed = pressedStaffKeys.has("a");
      const rPressed = pressedStaffKeys.has("r");

      if (
        shiftPressed &&
        aPressed &&
        rPressed
      ) {
        event.preventDefault();
        pressedStaffKeys.clear();

        window.location.href = "/staff-login";
      }
    }

    function handleStaffKeyUp(
      event: KeyboardEvent
    ) {
      pressedStaffKeys.delete(
        event.key.toLowerCase()
      );
    }

    function clearStaffKeys() {
      pressedStaffKeys.clear();
    }

    window.addEventListener(
      "keydown",
      handleStaffKeyDown
    );

    window.addEventListener(
      "keyup",
      handleStaffKeyUp
    );

    window.addEventListener(
      "blur",
      clearStaffKeys
    );

    return () => {
      window.removeEventListener(
        "keydown",
        handleStaffKeyDown
      );

      window.removeEventListener(
        "keyup",
        handleStaffKeyUp
      );

      window.removeEventListener(
        "blur",
        clearStaffKeys
      );
    };
  }, []);

  // Hidden staff access:
  // /buyer-login#staff → /staff-login
  useEffect(() => {
    function openStaffAccess() {
      if (
        window.location.hash.toLowerCase() === "#staff"
      ) {
        window.location.replace("/staff-login");
      }
    }

    openStaffAccess();

    window.addEventListener(
      "hashchange",
      openStaffAccess
    );

    return () => {
      window.removeEventListener(
        "hashchange",
        openStaffAccess
      );
    };
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(
      window.location.search
    );

    setIsSignup(params.get("signup") === "true");

    const requestedRedirect =
      params.get("redirect");

    const safeRedirect =
      requestedRedirect?.startsWith("/") &&
      !requestedRedirect.startsWith("//")
        ? requestedRedirect
        : "/properties";

    setRedirectPath(safeRedirect);
  }, []);

  function changeMode(signup: boolean) {
    setIsSignup(signup);
    setError("");

    const params = new URLSearchParams(
      window.location.search
    );

    if (signup) {
      params.set("signup", "true");
    } else {
      params.delete("signup");
    }

    const query = params.toString();

    window.history.replaceState(
      {},
      "",
      query
        ? `/buyer-login?${query}`
        : "/buyer-login"
    );
  }

  async function handleForgotPassword() {
    const cleanEmail =
      email.trim().toLowerCase();

    if (!cleanEmail) {
      setError(
        "Password reset ke liye email enter karein."
      );
      return;
    }

    try {
      setLoading(true);
      setError("");

      await sendPasswordResetEmail(
        auth,
        cleanEmail
      );

      setOtpMessage(
        "Password reset link aapke email par bhej diya gaya hai."
      );
    } catch (resetError) {
      console.error(
        "Password reset failed:",
        resetError
      );

      setError(
        getReadableError(resetError)
      );
    } finally {
      setLoading(false);
    }
  }

  async function sendEmailOtp() {
    const cleanEmail =
      email.trim().toLowerCase();

    if (!cleanEmail) {
      setError(
        "OTP ke liye email address enter karein."
      );
      return;
    }

    try {
      setLoading(true);
      setError("");
      setOtpMessage("");

      const result = await fetch(
        "/api/auth/email-otp/send",
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            email: cleanEmail,
          }),
        }
      );

      const data = await result.json();

      if (!result.ok || !data.success) {
        throw new Error(
          data.message ||
          "OTP send nahi ho paya."
        );
      }

      setOtpSent(true);
      setOtp("");
      setOtpMessage(data.message);
    } catch (otpError) {
      console.error(
        "Email OTP send failed:",
        otpError
      );

      setError(
        otpError instanceof Error
          ? otpError.message
          : "OTP send nahi ho paya."
      );
    } finally {
      setLoading(false);
    }
  }

  async function verifyEmailOtp(
    event: FormEvent
  ) {
    event.preventDefault();

    const cleanEmail =
      email.trim().toLowerCase();

    const cleanOtp =
      otp.replace(/\D/g, "");

    if (
      !cleanEmail ||
      cleanOtp.length !== 6
    ) {
      setError(
        "Email aur 6-digit OTP enter karein."
      );
      return;
    }

    try {
      setLoading(true);
      setError("");
      setOtpMessage("");

      const result = await fetch(
        "/api/auth/email-otp/verify",
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            email: cleanEmail,
            otp: cleanOtp,
          }),
        }
      );

      const data = await result.json();

      if (
        !result.ok ||
        !data.success ||
        !data.customToken
      ) {
        throw new Error(
          data.message ||
          "OTP verify nahi ho paya."
        );
      }

      const credential =
        await signInWithCustomToken(
          auth,
          data.customToken
        );

      const profileSnapshot =
        await getDoc(
          doc(
            db,
            "users",
            credential.user.uid
          )
        );

      const role = profileSnapshot.exists()
        ? String(
            profileSnapshot.data().role ||
            "buyer"
          )
        : "buyer";

      window.location.href =
        role === "buyer"
          ? redirectPath
          : getDashboard(role);
    } catch (verifyError) {
      console.error(
        "Email OTP verification failed:",
        verifyError
      );

      setError(
        verifyError instanceof Error
          ? verifyError.message
          : "OTP verify nahi ho paya."
      );
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();

    if (loading) return;

    setError("");
    setLoading(true);

    try {
      if (isSignup) {
        const result =
          await createUserWithEmailAndPassword(
            auth,
            email.trim(),
            password
          );

        const isBusiness =
          accountType === "business";

        await setDoc(
          doc(db, "users", result.user.uid),
          {
            uid: result.user.uid,
            name: name.trim(),
            email: email.trim().toLowerCase(),
            phone: phone.trim(),
            city: city.trim(),

            accountType: isBusiness
              ? "business"
              : "customer",

            role: isBusiness
              ? "property_dealer"
              : "buyer",

            businessType: isBusiness
              ? businessType
              : null,

            businessName: isBusiness
              ? businessName.trim()
              : null,

            canBuy: true,
            canListProperty: true,
            status: "active",
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
          }
        );

        window.location.href = isBusiness
          ? "/dealer/dashboard"
          : redirectPath;

        return;
      }

      const result =
        await signInWithEmailAndPassword(
          auth,
          email.trim(),
          password
        );

      const profileSnap = await getDoc(
        doc(db, "users", result.user.uid)
      );

      if (!profileSnap.exists()) {
        await setDoc(
          doc(db, "users", result.user.uid),
          {
            uid: result.user.uid,
            email:
              result.user.email ||
              email.trim().toLowerCase(),
            accountType: "customer",
            role: "buyer",
            canBuy: true,
            canListProperty: true,
            status: "active",
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
          }
        );

        window.location.href = redirectPath;
        return;
      }

      const profile = profileSnap.data();
      const role = String(profile.role || "buyer");

      if (role === "admin") {
        await signOut(auth);

        setError(
          "Admin login website ke secure Admin page se karein."
        );

        return;
      }

      const destination = getDashboard(role);

      window.location.href =
        role === "buyer"
          ? redirectPath
          : destination;
    } catch (submitError) {
      console.error(
        "Unified authentication failed:",
        submitError
      );

      setError(getReadableError(submitError));
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#F7FBF8] px-5 py-12">
      <div className="mx-auto grid min-h-[calc(100vh-6rem)] max-w-5xl overflow-hidden rounded-[32px] border border-[#D8EBDD] bg-white shadow-[0_24px_80px_rgba(20,83,45,0.12)] lg:grid-cols-[0.9fr_1.1fr]">
        <section className="relative hidden overflow-hidden bg-[#0F3D24] p-12 text-white lg:flex lg:flex-col lg:justify-between">
          <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-[#16A34A]/25 blur-3xl" />

          <div className="relative">
            <div className="inline-flex rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-black uppercase tracking-[0.18em] text-[#A7F3C1]">
              PropertyHub Account
            </div>

            <h2 className="mt-8 text-5xl font-black leading-[1.08] tracking-tight">
              One account.
              <br />
              Every property
              <br />
              opportunity.
            </h2>

            <p className="mt-6 max-w-sm text-base leading-7 text-white/70">
              Property search karein, favourites save karein,
              owner se connect karein ya apni property list
              karein.
            </p>
          </div>

          <div className="relative grid gap-3 text-sm font-bold text-white/85">
            <div className="rounded-2xl bg-white/10 px-5 py-4">
              ✓ Customer account for buyers and owners
            </div>

            <div className="rounded-2xl bg-white/10 px-5 py-4">
              ✓ Business account for dealers and builders
            </div>

            <div className="rounded-2xl bg-white/10 px-5 py-4">
              ✓ Same account across website and app
            </div>
          </div>
        </section>

        <section className="flex items-center p-6 sm:p-10 lg:p-14">
          <div className="w-full">
            <a
              href="/"
              className="inline-flex items-center gap-3 text-2xl font-black text-[#102A1A]"
            >
              <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#16A34A] text-white shadow-lg">
                ⌂
              </span>

              <span>
                Property
                <span className="text-[#16A34A]">
                  Hub
                </span>
              </span>
            </a>

            <div className="mt-9">
              <p className="text-sm font-black uppercase tracking-[0.16em] text-[#16A34A]">
                {isSignup
                  ? "Create your account"
                  : "Welcome back"}
              </p>

              <h1 className="mt-2 text-3xl font-black tracking-tight text-[#102A1A] sm:text-4xl">
                {isSignup
                  ? "Join PropertyHub"
                  : "Login to PropertyHub"}
              </h1>

              <p className="mt-3 text-sm leading-6 text-[#64756A]">
                {isSignup
                  ? "Choose your account type and get started."
                  : "Customer, owner, dealer and builder sab yahin se login karein."}
              </p>
            </div>

            {isSignup && (
              <div className="mt-7 grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() =>
                    setAccountType("customer")
                  }
                  className={`rounded-2xl border p-4 text-left transition ${
                    accountType === "customer"
                      ? "border-[#16A34A] bg-[#EAF7EE] shadow-sm"
                      : "border-[#D8EBDD] bg-white"
                  }`}
                >
                  <span className="text-2xl">👤</span>

                  <span className="mt-2 block font-black text-[#102A1A]">
                    Customer
                  </span>

                  <span className="mt-1 block text-xs leading-5 text-[#64756A]">
                    Buy, rent or list your own property
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() =>
                    setAccountType("business")
                  }
                  className={`rounded-2xl border p-4 text-left transition ${
                    accountType === "business"
                      ? "border-[#16A34A] bg-[#EAF7EE] shadow-sm"
                      : "border-[#D8EBDD] bg-white"
                  }`}
                >
                  <span className="text-2xl">🏢</span>

                  <span className="mt-2 block font-black text-[#102A1A]">
                    Dealer / Builder
                  </span>

                  <span className="mt-1 block text-xs leading-5 text-[#64756A]">
                    Manage listings, leads and business
                  </span>
                </button>
              </div>
            )}

            {!isSignup && (
              <div className="mt-7 grid grid-cols-2 gap-2 rounded-2xl bg-[#EAF7EE] p-1.5">
                <button
                  type="button"
                  onClick={() => {
                    setLoginMethod("password");
                    setError("");
                    setOtpMessage("");
                  }}
                  className={`rounded-xl px-4 py-3 text-sm font-black transition ${
                    loginMethod === "password"
                      ? "bg-white text-[#15803D] shadow-sm"
                      : "text-[#64756A]"
                  }`}
                >
                  Password
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setLoginMethod("otp");
                    setError("");
                    setOtpMessage("");
                  }}
                  className={`rounded-xl px-4 py-3 text-sm font-black transition ${
                    loginMethod === "otp"
                      ? "bg-white text-[#15803D] shadow-sm"
                      : "text-[#64756A]"
                  }`}
                >
                  Email OTP
                </button>
              </div>
            )}

            <form
              onSubmit={
                !isSignup &&
                loginMethod === "otp"
                  ? verifyEmailOtp
                  : handleSubmit
              }
              className="mt-7 space-y-4"
            >
              {isSignup && (
                <>
                  <label className="block">
                    <span className="mb-2 block text-sm font-bold text-[#294936]">
                      Full name
                    </span>

                    <input
                      type="text"
                      value={name}
                      onChange={(event) =>
                        setName(event.target.value)
                      }
                      placeholder="Enter your full name"
                      required
                      className="w-full rounded-2xl border border-[#D8EBDD] bg-[#F9FCFA] px-4 py-3.5 text-[#102A1A] outline-none transition placeholder:text-[#94A39A] focus:border-[#16A34A] focus:ring-4 focus:ring-[#16A34A]/10"
                    />
                  </label>

                  {accountType === "business" && (
                    <>
                      <div className="grid grid-cols-2 gap-3">
                        <button
                          type="button"
                          onClick={() =>
                            setBusinessType("dealer")
                          }
                          className={`rounded-xl border px-4 py-3 text-sm font-black ${
                            businessType === "dealer"
                              ? "border-[#16A34A] bg-[#EAF7EE] text-[#15803D]"
                              : "border-[#D8EBDD] text-[#64756A]"
                          }`}
                        >
                          Property Dealer
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            setBusinessType("builder")
                          }
                          className={`rounded-xl border px-4 py-3 text-sm font-black ${
                            businessType === "builder"
                              ? "border-[#16A34A] bg-[#EAF7EE] text-[#15803D]"
                              : "border-[#D8EBDD] text-[#64756A]"
                          }`}
                        >
                          Builder / Developer
                        </button>
                      </div>

                      <label className="block">
                        <span className="mb-2 block text-sm font-bold text-[#294936]">
                          Business name
                        </span>

                        <input
                          value={businessName}
                          onChange={(event) =>
                            setBusinessName(
                              event.target.value
                            )
                          }
                          placeholder="Enter business name"
                          required
                          className="w-full rounded-2xl border border-[#D8EBDD] bg-[#F9FCFA] px-4 py-3.5 text-[#102A1A] outline-none focus:border-[#16A34A] focus:ring-4 focus:ring-[#16A34A]/10"
                        />
                      </label>
                    </>
                  )}

                  <div className="grid gap-4 sm:grid-cols-2">
                    <label className="block">
                      <span className="mb-2 block text-sm font-bold text-[#294936]">
                        Phone number
                      </span>

                      <input
                        type="tel"
                        value={phone}
                        onChange={(event) =>
                          setPhone(event.target.value)
                        }
                        placeholder="10-digit mobile"
                        required
                        className="w-full rounded-2xl border border-[#D8EBDD] bg-[#F9FCFA] px-4 py-3.5 text-[#102A1A] outline-none focus:border-[#16A34A] focus:ring-4 focus:ring-[#16A34A]/10"
                      />
                    </label>

                    <label className="block">
                      <span className="mb-2 block text-sm font-bold text-[#294936]">
                        City
                      </span>

                      <input
                        value={city}
                        onChange={(event) =>
                          setCity(event.target.value)
                        }
                        placeholder="Your city"
                        required
                        className="w-full rounded-2xl border border-[#D8EBDD] bg-[#F9FCFA] px-4 py-3.5 text-[#102A1A] outline-none focus:border-[#16A34A] focus:ring-4 focus:ring-[#16A34A]/10"
                      />
                    </label>
                  </div>
                </>
              )}

              <label className="block">
                <span className="mb-2 block text-sm font-bold text-[#294936]">
                  Email address
                </span>

                <input
                  type="email"
                  value={email}
                  onChange={(event) =>
                    setEmail(event.target.value)
                  }
                  placeholder="you@example.com"
                  autoComplete="email"
                  required
                  className="w-full rounded-2xl border border-[#D8EBDD] bg-[#F9FCFA] px-4 py-3.5 text-[#102A1A] outline-none transition placeholder:text-[#94A39A] focus:border-[#16A34A] focus:ring-4 focus:ring-[#16A34A]/10"
                />
              </label>

              {(isSignup ||
                loginMethod === "password") && (
                <label className="block">
                  <span className="mb-2 block text-sm font-bold text-[#294936]">
                    Password
                  </span>

                  <input
                    type="password"
                    value={password}
                    onChange={(event) =>
                      setPassword(
                        event.target.value
                      )
                    }
                    placeholder="Minimum 6 characters"
                    autoComplete={
                      isSignup
                        ? "new-password"
                        : "current-password"
                    }
                    minLength={6}
                    required
                    className="w-full rounded-2xl border border-[#D8EBDD] bg-[#F9FCFA] px-4 py-3.5 text-[#102A1A] outline-none transition placeholder:text-[#94A39A] focus:border-[#16A34A] focus:ring-4 focus:ring-[#16A34A]/10"
                  />

                  {!isSignup && (
                    <button
                      type="button"
                      onClick={
                        handleForgotPassword
                      }
                      className="mt-3 block text-sm font-black text-[#16A34A] hover:text-[#15803D]"
                    >
                      Forgot Password?
                    </button>
                  )}
                </label>
              )}

              {!isSignup &&
                loginMethod === "otp" && (
                  <div className="space-y-4">
                    <button
                      type="button"
                      onClick={sendEmailOtp}
                      disabled={loading}
                      className="w-full rounded-2xl border border-[#16A34A] bg-[#EAF7EE] px-5 py-3.5 font-black text-[#15803D] transition hover:bg-[#DDF3E3] disabled:opacity-60"
                    >
                      {otpSent
                        ? "Resend Email OTP"
                        : "Send Email OTP"}
                    </button>

                    {otpSent && (
                      <label className="block">
                        <span className="mb-2 block text-sm font-bold text-[#294936]">
                          6-digit OTP
                        </span>

                        <input
                          value={otp}
                          onChange={(event) =>
                            setOtp(
                              event.target.value
                                .replace(/\D/g, "")
                                .slice(0, 6)
                            )
                          }
                          placeholder="Enter OTP"
                          inputMode="numeric"
                          autoComplete="one-time-code"
                          className="w-full rounded-2xl border border-[#D8EBDD] bg-[#F9FCFA] px-4 py-3.5 text-center text-xl font-black tracking-[0.35em] text-[#102A1A] outline-none focus:border-[#16A34A] focus:ring-4 focus:ring-[#16A34A]/10"
                        />
                      </label>
                    )}
                  </div>
                )}

              {otpMessage && (
                <div className="rounded-2xl border border-green-200 bg-green-50 px-4 py-3 text-sm font-semibold text-green-700">
                  {otpMessage}
                </div>
              )}

              {error && (
                <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-2xl bg-[#16A34A] px-5 py-4 font-black text-white shadow-[0_12px_28px_rgba(22,163,74,0.25)] transition hover:bg-[#15803D] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading
                  ? "Please wait..."
                  : isSignup
                    ? accountType === "business"
                      ? "Create Business Account →"
                      : "Create Customer Account →"
                    : loginMethod === "otp"
                      ? "Verify OTP & Login →"
                      : "Login Securely →"}
              </button>
            </form>

            <div className="mt-6 text-center text-sm text-[#64756A]">
              {isSignup
                ? "Already have an account?"
                : "New to PropertyHub?"}{" "}
              <button
                type="button"
                onClick={() =>
                  changeMode(!isSignup)
                }
                className="font-black text-[#16A34A] hover:text-[#15803D]"
              >
                {isSignup
                  ? "Login"
                  : "Create account"}
              </button>
            </div>

            {!isSignup && (
              <Link
                href="/dealer-login"
                className="mt-6 flex w-full items-center justify-between rounded-2xl border border-[#BFE5C9] bg-[#EAF7EE] px-5 py-4 transition hover:border-[#16A34A] hover:bg-[#DFF3E5]"
              >
                <span className="flex items-center gap-4">
                  <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-white text-2xl shadow-sm">
                    🏢
                  </span>

                  <span className="text-left">
                    <span className="block font-black text-[#102A1A]">
                      Dealer / Builder Login
                    </span>

                    <span className="mt-1 block text-xs text-[#64756A]">
                      Manage properties, leads and business
                    </span>
                  </span>
                </span>

                <span className="text-xl font-black text-[#16A34A]">
                  →
                </span>
              </Link>
            )}

            <p className="mt-7 text-center text-xs leading-5 text-[#839188]">
              Admin access is available only through the
              protected website Admin login.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
