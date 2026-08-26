"use client";

import { useState } from "react";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/components/AuthProvider";

type Props = {
  requiredLoanAmount: number;
  estimatedEligibleAmount: number;
};

export default function LoanApplicationForm({
  requiredLoanAmount,
  estimatedEligibleAmount,
}: Props) {
  const { user } = useAuth();

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState(user?.email || "");
  const [employmentType, setEmploymentType] = useState("");
  const [contactTime, setContactTime] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  async function submitApplication(e: React.FormEvent) {
    e.preventDefault();

    try {
      setLoading(true);
      setSuccess(false);

      const leadId = `LOAN-${Date.now()}`;

      const loanData = {
        leadId,

        customerName: name.trim(),
        customerPhone: phone.trim(),
        customerEmail: email.trim(),

        buyerId: user?.uid || "",
        buyerEmail: user?.email || "",

        monthlyIncome: 0,
        requiredLoanAmount,
        estimatedEligibleAmount,

        employmentType,
        preferredContactTime: contactTime,

        status: "new",
        source: "propertyhub",

        // Future authorized partner integration
        partnerId: "",
        partnerName: "",
        externalApplicationId: "",

        // Future sanction/disbursement tracking
        sanctionedAmount: 0,
        disbursedAmount: 0,

        // Future commission reconciliation
        commissionPercent: 0,
        commissionAmount: 0,
        commissionStatus: "not_connected",

        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      };

      console.log("🔐 LOAN AUTH UID:", user?.uid || "NOT LOGGED IN");
      console.log("🔐 LOAN AUTH EMAIL:", user?.email || "NO EMAIL");
      console.log("📋 LOAN DATA:", loanData);

      await addDoc(
        collection(db, "loanApplications"),
        loanData
      );

      setSuccess(true);

      setName("");
      setPhone("");
      setEmail(user?.email || "");
      setEmploymentType("");
      setContactTime("");
    } catch (error) {
      console.error("Loan application error:", error);

      const message =
        error instanceof Error
          ? error.message
          : String(error);

      alert(`Loan application error: ${message}`);
    } finally {
      setLoading(false);
    }
  }

  if (success) {
    return (
      <div className="mt-8 rounded-2xl border border-[#d4a855]/30 bg-[#d4a855]/10 p-6">
        <p className="text-sm font-semibold uppercase tracking-wider text-[#d4a855]">
          Application Submitted
        </p>

        <h3 className="mt-2 text-2xl font-black text-[#f2ede4]">
          Thank you! Your loan requirement has been received.
        </h3>

        <p className="mt-3 text-sm leading-6 text-[#bdb7ad]">
          Our team will review your requirement and contact you regarding
          available lending options.
        </p>

        <button
          onClick={() => setSuccess(false)}
          className="mt-5 rounded-xl border border-[#d4a855]/40 px-5 py-2 font-bold text-[#d4a855] transition hover:bg-[#d4a855]/10"
        >
          Submit Another Application
        </button>
      </div>
    );
  }

  return (
    <div className="mt-8 rounded-2xl border border-white/10 bg-black/20 p-6">
      <h3 className="text-2xl font-black text-[#f2ede4]">
        Submit Your Loan Requirement
      </h3>

      <p className="mt-2 text-sm text-[#aaa49a]">
        Share your details and our team can help you explore suitable loan
        options.
      </p>

      <form onSubmit={submitApplication} className="mt-6 space-y-4">
        <input
          type="text"
          placeholder="Full Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="w-full rounded-xl border border-white/10 bg-white/[0.04] p-4 text-white outline-none transition placeholder:text-[#77736d] focus:border-[#d4a855]"
        />

        <input
          type="tel"
          placeholder="Mobile Number"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          required
          className="w-full rounded-xl border border-white/10 bg-white/[0.04] p-4 text-white outline-none transition placeholder:text-[#77736d] focus:border-[#d4a855]"
        />

        <input
          type="email"
          placeholder="Email Address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full rounded-xl border border-white/10 bg-white/[0.04] p-4 text-white outline-none transition placeholder:text-[#77736d] focus:border-[#d4a855]"
        />

        <select
          value={employmentType}
          onChange={(e) => setEmploymentType(e.target.value)}
          required
          className="w-full rounded-xl border border-white/10 bg-[#10151f] p-4 text-white outline-none focus:border-[#d4a855]"
        >
          <option value="">Employment Type</option>
          <option value="salaried">Salaried</option>
          <option value="self_employed">Self Employed</option>
          <option value="business">Business Owner</option>
          <option value="professional">Professional</option>
        </select>

        <select
          value={contactTime}
          onChange={(e) => setContactTime(e.target.value)}
          required
          className="w-full rounded-xl border border-white/10 bg-[#10151f] p-4 text-white outline-none focus:border-[#d4a855]"
        >
          <option value="">Preferred Contact Time</option>
          <option value="morning">Morning</option>
          <option value="afternoon">Afternoon</option>
          <option value="evening">Evening</option>
        </select>

        <div className="rounded-xl border border-[#d4a855]/20 bg-[#d4a855]/5 p-4 text-sm">
          <div className="flex justify-between gap-4">
            <span className="text-[#aaa49a]">Required Loan</span>
            <strong className="text-[#d4a855]">
              ₹ {requiredLoanAmount.toLocaleString("en-IN")}
            </strong>
          </div>

          <div className="mt-2 flex justify-between gap-4">
            <span className="text-[#aaa49a]">Estimated Eligibility</span>
            <strong className="text-[#d4a855]">
              ₹ {estimatedEligibleAmount.toLocaleString("en-IN")}
            </strong>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-xl bg-[#d4a855] px-6 py-4 font-black text-[#080b12] transition hover:bg-[#e0b866] disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ? "Submitting..." : "Submit Loan Requirement"}
        </button>

        <p className="text-center text-xs leading-5 text-[#77736d]">
          Eligibility shown is an estimate only and does not constitute loan
          approval or an offer from any bank or lender.
        </p>
      </form>
    </div>
  );
}
