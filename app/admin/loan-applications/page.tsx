"use client";

import { useEffect, useState } from "react";
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  updateDoc,
} from "firebase/firestore";
import { db } from "@/lib/firebase";

type LoanApplication = {
  id: string;
  leadId?: string;
  customerName?: string;
  customerPhone?: string;
  customerEmail?: string;
  customerCity?: string;
  monthlyIncome?: number;
  requiredLoanAmount?: number;
  estimatedEligibleAmount?: number;
  tenureYears?: number;
  employmentType?: string;
  propertyStatus?: string;
  selectedBankId?: string;
  selectedBankName?: string;
  displayedInterestRate?: number;
  displayedInterestRateLabel?: string;
  estimatedEmi?: number;
  bankRateSource?: string;
  consentAccepted?: boolean;
  preferredContactTime?: string;
  status?: string;
  partnerName?: string;
  sanctionedAmount?: number;
  disbursedAmount?: number;
  commissionStatus?: string;
  notes?: string;
  followUpDate?: string;
  createdAt?: any;
};

function formatMoney(value?: number) {
  return `₹ ${(value || 0).toLocaleString("en-IN")}`;
}

function formatDate(timestamp: any) {
  if (!timestamp?.toDate) return "—";

  return timestamp.toDate().toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function LoanApplicationsPage() {
  const [applications, setApplications] = useState<LoanApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState<string | null>(null);

  async function fetchApplications() {
    try {
      const snap = await getDocs(
        collection(db, "loanApplications")
      );

      const data = snap.docs.map((item) => ({
        id: item.id,
        ...item.data(),
      })) as LoanApplication[];

      setApplications(data);
    } catch (error) {
      console.error("Loan Applications Error:", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchApplications();
  }, []);

  async function updateStatus(id: string, status: string) {
    try {
      await updateDoc(
        doc(db, "loanApplications", id),
        { status }
      );

      setApplications((prev) =>
        prev.map((application) =>
          application.id === id
            ? { ...application, status }
            : application
        )
      );
    } catch (error) {
      console.error("Status update error:", error);
      alert("Status update failed.");
    }
  }

  async function updateApplicationDetails(
    id: string,
    notes: string,
    followUpDate: string
  ) {
    try {
      setSavingId(id);

      await updateDoc(
        doc(db, "loanApplications", id),
        {
          notes,
          followUpDate,
          updatedAt: new Date(),
        }
      );

      setApplications((prev) =>
        prev.map((application) =>
          application.id === id
            ? {
                ...application,
                notes,
                followUpDate,
              }
            : application
        )
      );

      alert("✅ Loan application updated.");
    } catch (error) {
      console.error("Loan details update error:", error);
      alert("❌ Failed to save application details.");
    } finally {
      setSavingId(null);
    }
  }

  async function deleteApplication(id: string) {
    if (!confirm("Delete this loan application?")) return;

    try {
      await deleteDoc(
        doc(db, "loanApplications", id)
      );

      setApplications((prev) =>
        prev.filter((application) => application.id !== id)
      );
    } catch (error) {
      console.error("Delete error:", error);
      alert("Delete failed.");
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 p-8 text-slate-900">
        Loading Loan Applications...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-8 text-slate-900">

      <div className="mb-8">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-green-700">
          Finance
        </p>

        <h1 className="mt-2 text-3xl font-black">
          Loan Applications
        </h1>

        <p className="mt-2 text-slate-500">
          Manage customer loan requirements and track application progress.
        </p>
      </div>

      {applications.length === 0 ? (
        <div className="rounded-2xl bg-white p-8 text-slate-500">
          No Loan Applications Found
        </div>
      ) : (
        <div className="grid gap-6">

          {applications.map((application) => (
            <div
              key={application.id}
              className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
            >

              <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">

                {/* CUSTOMER */}
                <div className="min-w-0">

                  <div className="flex flex-wrap items-center gap-3">
                    <h2 className="text-xl font-black">
                      {application.customerName || "No Name"}
                    </h2>

                    <span className="rounded-full bg-green-600/10 px-3 py-1 text-xs font-bold text-green-700">
                      {application.leadId || application.id}
                    </span>
                  </div>

                  <div className="mt-4 space-y-2 text-sm text-slate-600">
                    <p>
                      📞 {application.customerPhone || "No Phone"}
                    </p>

                    <p>
                      ✉️ {application.customerEmail || "No Email"}
                    </p>

                    <p>
                      💼 {application.employmentType || "—"}
                    </p>

                    <p>
                      🕐 Preferred Contact:{" "}
                      {application.preferredContactTime || "—"}
                    </p>

                    <p className="text-xs text-slate-400">
                      Applied: {formatDate(application.createdAt)}
                    </p>
                  </div>
                </div>

                {/* SELECTED BANK */}
                <div className="min-w-[280px] rounded-2xl border border-green-100 bg-green-50 p-5">
                  <p className="text-xs font-black uppercase tracking-[0.14em] text-green-700">
                    Selected Bank
                  </p>

                  <h3 className="mt-2 text-lg font-black text-slate-900">
                    {application.selectedBankName ||
                      "No bank selected"}
                  </h3>

                  <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <p className="text-xs text-slate-500">
                        Displayed Rate
                      </p>
                      <p className="mt-1 font-black text-green-700">
                        {application.displayedInterestRateLabel ||
                          (application.displayedInterestRate
                            ? `${application.displayedInterestRate}% p.a.`
                            : "—")}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs text-slate-500">
                        Estimated EMI
                      </p>
                      <p className="mt-1 font-black text-slate-900">
                        {formatMoney(application.estimatedEmi)}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs text-slate-500">
                        Tenure
                      </p>
                      <p className="mt-1 font-bold text-slate-900">
                        {application.tenureYears
                          ? `${application.tenureYears} years`
                          : "—"}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs text-slate-500">
                        Monthly Income
                      </p>
                      <p className="mt-1 font-bold text-slate-900">
                        {formatMoney(application.monthlyIncome)}
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 border-t border-green-200 pt-3 text-xs text-slate-600">
                    <p>
                      📍 {application.customerCity || "City not provided"}
                    </p>

                    <p className="mt-2">
                      🏠 Property:{" "}
                      {application.propertyStatus
                        ?.replaceAll("_", " ") || "—"}
                    </p>

                    <p className="mt-2">
                      Consent:{" "}
                      <strong
                        className={
                          application.consentAccepted
                            ? "text-green-700"
                            : "text-slate-500"
                        }
                      >
                        {application.consentAccepted
                          ? "Accepted"
                          : "Legacy lead"}
                      </strong>
                    </p>
                  </div>

                  {application.bankRateSource && (
                    <a
                      href={application.bankRateSource}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-4 inline-flex text-xs font-black text-green-700 hover:underline"
                    >
                      Official bank rate source ↗
                    </a>
                  )}
                </div>

                {/* LOAN SUMMARY */}
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">

                  <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">
                    <p className="text-xs text-slate-400">
                      Required
                    </p>
                    <p className="mt-1 font-black text-green-700">
                      {formatMoney(application.requiredLoanAmount)}
                    </p>
                  </div>

                  <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">
                    <p className="text-xs text-slate-400">
                      Eligibility
                    </p>
                    <p className="mt-1 font-black text-green-700">
                      {formatMoney(application.estimatedEligibleAmount)}
                    </p>
                  </div>

                  <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">
                    <p className="text-xs text-slate-400">
                      Sanctioned
                    </p>
                    <p className="mt-1 font-black">
                      {formatMoney(application.sanctionedAmount)}
                    </p>
                  </div>

                  <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">
                    <p className="text-xs text-slate-400">
                      Disbursed
                    </p>
                    <p className="mt-1 font-black">
                      {formatMoney(application.disbursedAmount)}
                    </p>
                  </div>

                </div>
              </div>

              {/* ADMIN CRM */}
              <div className="mt-6 grid gap-4 border-t border-slate-200 pt-5 md:grid-cols-3">

                <div className="md:col-span-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Admin Notes
                  </label>

                  <textarea
                    id={`loan-notes-${application.id}`}
                    defaultValue={application.notes || ""}
                    placeholder="Add customer conversation, document status, follow-up details..."
                    rows={3}
                    className="mt-2 w-full rounded-xl border border-slate-200/10 bg-slate-50/30 p-3 text-sm text-slate-900 outline-none transition placeholder:text-zinc-600 focus:border-green-200"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Follow-up Date
                  </label>

                  <input
                    id={`loan-followup-${application.id}`}
                    type="date"
                    defaultValue={application.followUpDate || ""}
                    className="mt-2 w-full rounded-xl border border-slate-200/10 bg-slate-50/30 p-3 text-sm text-slate-900 outline-none focus:border-green-200"
                  />

                  <button
                    onClick={() =>
                      updateApplicationDetails(
                        application.id,
                        (
                          document.getElementById(
                            `loan-notes-${application.id}`
                          ) as HTMLTextAreaElement
                        ).value,
                        (
                          document.getElementById(
                            `loan-followup-${application.id}`
                          ) as HTMLInputElement
                        ).value
                      )
                    }
                    disabled={savingId === application.id}
                    className="mt-3 w-full rounded-xl bg-green-600 px-4 py-3 text-sm font-black text-white transition hover:bg-[#e0b866] disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {savingId === application.id
                      ? "Saving..."
                      : "Save CRM Details"}
                  </button>
                </div>

              </div>

              {/* WORKFLOW */}
              <div className="mt-6 border-t border-slate-200 pt-5">

                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

                  <div>
                    <p className="text-xs uppercase tracking-wider text-slate-400">
                      Partner
                    </p>

                    <p className="mt-1 font-bold">
                      {application.partnerName || "Not Connected"}
                    </p>

                    <p className="mt-2 text-xs text-slate-400">
                      Commission:{" "}
                      {application.commissionStatus || "not_connected"}
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-3">

                    <select
                      value={application.status || "new"}
                      onChange={(e) =>
                        updateStatus(
                          application.id,
                          e.target.value
                        )
                      }
                      className="rounded-xl border border-slate-200/10 bg-slate-50 px-4 py-3 text-sm font-bold text-slate-900 outline-none focus:border-green-200"
                    >
                      <option value="new">New</option>
                      <option value="contacted">Contacted</option>
                      <option value="documents_pending">
                        Documents Pending
                      </option>
                      <option value="application_submitted">
                        Application Submitted
                      </option>
                      <option value="under_review">
                        Under Review
                      </option>
                      <option value="sanctioned">
                        Sanctioned
                      </option>
                      <option value="disbursed">
                        Disbursed
                      </option>
                      <option value="rejected">
                        Rejected
                      </option>
                    </select>

                    <a
                      href={`tel:${application.customerPhone || ""}`}
                      className="rounded-xl bg-green-600 px-5 py-3 font-black text-white transition hover:bg-[#e0b866]"
                    >
                      Call Customer
                    </a>

                    <button
                      onClick={() =>
                        deleteApplication(application.id)
                      }
                      className="rounded-xl bg-red-600 px-5 py-3 font-bold text-slate-900 transition hover:bg-red-500"
                    >
                      Delete
                    </button>

                  </div>
                </div>
              </div>

            </div>
          ))}

        </div>
      )}
    </div>
  );
}
