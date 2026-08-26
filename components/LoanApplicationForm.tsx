"use client";

import { useState } from "react";
import {
  addDoc,
  collection,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/components/AuthProvider";
import type { BankOffer } from "./HomeLoan";

type Props = {
  requiredLoanAmount: number;
  estimatedEligibleAmount: number;
  monthlyIncome?: number;
  tenureYears?: number;
  selectedBank?: BankOffer | null;
  estimatedEmi?: number;
};

function formatMoney(value: number) {
  return `₹${Math.round(value).toLocaleString("en-IN")}`;
}

export default function LoanApplicationForm({
  requiredLoanAmount,
  estimatedEligibleAmount,
  monthlyIncome = 0,
  tenureYears = 20,
  selectedBank = null,
  estimatedEmi = 0,
}: Props) {
  const { user } = useAuth();

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState(
    user?.email || ""
  );
  const [city, setCity] = useState("Jaipur");
  const [employmentType, setEmploymentType] =
    useState("");
  const [contactTime, setContactTime] =
    useState("");
  const [propertyStatus, setPropertyStatus] =
    useState("");
  const [consent, setConsent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  async function submitApplication(
    event: React.FormEvent
  ) {
    event.preventDefault();

    const digits = phone.replace(/\D/g, "");

    if (digits.length < 10 || digits.length > 13) {
      alert("Please enter a valid mobile number.");
      return;
    }

    if (!consent) {
      alert(
        "Please accept the contact consent to continue."
      );
      return;
    }

    try {
      setLoading(true);
      setSuccess(false);

      const loanData = {
        leadId: `LOAN-${Date.now()}`,

        customerName: name.trim(),
        customerPhone: phone.trim(),
        customerEmail: email.trim(),
        customerCity: city.trim(),

        buyerId: user?.uid || "",
        buyerEmail: user?.email || "",

        monthlyIncome: Number(monthlyIncome),
        requiredLoanAmount: Number(
          requiredLoanAmount
        ),
        estimatedEligibleAmount: Number(
          estimatedEligibleAmount
        ),
        tenureYears: Number(tenureYears),

        employmentType,
        preferredContactTime: contactTime,
        propertyStatus,

        selectedBankId: selectedBank?.id || "",
        selectedBankName:
          selectedBank?.name || "",
        displayedInterestRate:
          selectedBank?.rate || 0,
        displayedInterestRateLabel:
          selectedBank?.rateLabel || "",
        estimatedEmi: Number(estimatedEmi),
        bankRateSource:
          selectedBank?.sourceUrl || "",

        consentAccepted: true,
        consentText:
          "Customer consented to be contacted regarding home loan options.",

        status: "new",
        source: "propertyhub",

        partnerId: "",
        partnerName: "",
        externalApplicationId: "",

        sanctionedAmount: 0,
        disbursedAmount: 0,

        commissionPercent: 0,
        commissionAmount: 0,
        commissionStatus: "not_connected",

        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      };

      await addDoc(
        collection(db, "loanApplications"),
        loanData
      );

      setSuccess(true);
    } catch (error) {
      console.error(
        "Loan application error:",
        error
      );

      alert(
        `Loan application error: ${
          error instanceof Error
            ? error.message
            : String(error)
        }`
      );
    } finally {
      setLoading(false);
    }
  }

  if (success) {
    return (
      <div className="mt-10 rounded-3xl border border-green-200 bg-green-50 p-8 text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-green-600 text-2xl text-white">
          ✓
        </div>

        <h3 className="mt-5 text-2xl font-black text-slate-900">
          Loan enquiry received
        </h3>

        <p className="mx-auto mt-3 max-w-xl leading-7 text-slate-600">
          Your preference for{" "}
          <strong>
            {selectedBank?.name ||
              "a home-loan option"}
          </strong>{" "}
          has been recorded. Our team will review your
          requirement and contact you.
        </p>

        <button
          type="button"
          onClick={() => setSuccess(false)}
          className="mt-6 rounded-xl border border-green-600 bg-white px-6 py-3 font-black text-green-700"
        >
          Submit another enquiry
        </button>
      </div>
    );
  }

  return (
    <div className="mt-10 rounded-[28px] border border-green-100 bg-white p-6 shadow-xl shadow-green-900/5 lg:p-9">
      <div className="flex flex-col gap-5 border-b border-slate-100 pb-7 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.16em] text-green-700">
            Selected Bank
          </p>

          <h3 className="mt-2 text-2xl font-black text-slate-900">
            Apply with{" "}
            {selectedBank?.name ||
              "selected lender"}
          </h3>
        </div>

        <div className="rounded-2xl bg-green-50 px-5 py-3">
          <p className="text-xs text-slate-500">
            Indicative EMI
          </p>
          <p className="mt-1 text-xl font-black text-green-700">
            {formatMoney(estimatedEmi)} / month
          </p>
        </div>
      </div>

      <form
        onSubmit={submitApplication}
        className="mt-7"
      >
        <div className="grid gap-4 md:grid-cols-2">
          <input
            type="text"
            placeholder="Full name"
            value={name}
            onChange={(event) =>
              setName(event.target.value)
            }
            required
            className="rounded-xl border border-slate-200 bg-white p-4 text-slate-900 outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100"
          />

          <input
            type="tel"
            placeholder="Mobile number"
            value={phone}
            onChange={(event) =>
              setPhone(event.target.value)
            }
            required
            className="rounded-xl border border-slate-200 bg-white p-4 text-slate-900 outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100"
          />

          <input
            type="email"
            placeholder="Email address"
            value={email}
            onChange={(event) =>
              setEmail(event.target.value)
            }
            className="rounded-xl border border-slate-200 bg-white p-4 text-slate-900 outline-none focus:border-green-500"
          />

          <input
            type="text"
            placeholder="City"
            value={city}
            onChange={(event) =>
              setCity(event.target.value)
            }
            required
            className="rounded-xl border border-slate-200 bg-white p-4 text-slate-900 outline-none focus:border-green-500"
          />

          <select
            value={employmentType}
            onChange={(event) =>
              setEmploymentType(
                event.target.value
              )
            }
            required
            className="rounded-xl border border-slate-200 bg-white p-4 text-slate-900 outline-none focus:border-green-500"
          >
            <option value="">
              Employment type
            </option>
            <option value="salaried">
              Salaried
            </option>
            <option value="self_employed">
              Self employed
            </option>
            <option value="business">
              Business owner
            </option>
            <option value="professional">
              Professional
            </option>
          </select>

          <select
            value={propertyStatus}
            onChange={(event) =>
              setPropertyStatus(
                event.target.value
              )
            }
            required
            className="rounded-xl border border-slate-200 bg-white p-4 text-slate-900 outline-none focus:border-green-500"
          >
            <option value="">
              Property status
            </option>
            <option value="identified">
              Property identified
            </option>
            <option value="searching">
              Still searching
            </option>
            <option value="under_construction">
              Under construction
            </option>
            <option value="balance_transfer">
              Balance transfer
            </option>
          </select>

          <select
            value={contactTime}
            onChange={(event) =>
              setContactTime(event.target.value)
            }
            required
            className="rounded-xl border border-slate-200 bg-white p-4 text-slate-900 outline-none focus:border-green-500 md:col-span-2"
          >
            <option value="">
              Preferred contact time
            </option>
            <option value="morning">
              Morning
            </option>
            <option value="afternoon">
              Afternoon
            </option>
            <option value="evening">
              Evening
            </option>
          </select>
        </div>

        <div className="mt-6 grid gap-3 rounded-2xl bg-slate-50 p-5 sm:grid-cols-2 lg:grid-cols-4">
          {[
            [
              "Loan amount",
              formatMoney(requiredLoanAmount),
            ],
            [
              "Monthly income",
              formatMoney(monthlyIncome),
            ],
            [
              "Tenure",
              `${tenureYears} years`,
            ],
            [
              "Indicative rate",
              selectedBank?.rateLabel || "—",
            ],
          ].map(([label, value]) => (
            <div key={label}>
              <p className="text-xs text-slate-500">
                {label}
              </p>
              <p className="mt-1 font-black text-slate-900">
                {value}
              </p>
            </div>
          ))}
        </div>

        <label className="mt-6 flex cursor-pointer items-start gap-3 rounded-xl border border-slate-200 p-4">
          <input
            type="checkbox"
            checked={consent}
            onChange={(event) =>
              setConsent(event.target.checked)
            }
            className="mt-1 h-4 w-4 accent-green-600"
          />

          <span className="text-xs leading-5 text-slate-600">
            I consent to PropertyHub contacting me
            regarding this home-loan enquiry. I
            understand that rates and approval are
            subject to the selected bank’s assessment
            and current policy.
          </span>
        </label>

        <button
          type="submit"
          disabled={loading || !consent}
          className="mt-6 w-full rounded-xl bg-green-600 px-6 py-4 font-black text-white shadow-md shadow-green-600/20 hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading
            ? "Submitting enquiry..."
            : `Submit enquiry for ${
                selectedBank?.shortName ||
                "selected bank"
              }`}
        </button>
      </form>
    </div>
  );
}
