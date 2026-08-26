"use client";

import { useState } from "react";
import LoanApplicationForm from "./LoanApplicationForm";

export default function LoanEligibility() {
  const [income, setIncome] = useState(50000);
  const [loan, setLoan] = useState(5000000);
  const [result, setResult] = useState<number | null>(null);

  function checkEligibility() {
    const estimated = Math.max(
      0,
      Math.min(loan, income * 60)
    );

    setResult(estimated);
  }

  return (
    <div className="rounded-3xl border border-[#d4a855]/20 bg-white/[0.04] p-8 shadow-xl backdrop-blur">
      <h2 className="text-3xl font-black text-[#f2ede4]">
        Check Home Loan Eligibility
      </h2>

      <p className="mt-2 text-[#bdb7ad]">
        Get an estimated eligibility amount based on your income and
        required loan amount.
      </p>

      <div className="mt-8 space-y-6">

        {/* MONTHLY INCOME */}
        <div>
          <label className="font-semibold text-[#e8dfd0]">
            Monthly Income
          </label>

          <input
            type="range"
            min="15000"
            max="500000"
            step="5000"
            value={income}
            onChange={(e) => setIncome(Number(e.target.value))}
            className="mt-3 w-full accent-[#d4a855]"
          />

          <p className="mt-2 font-bold text-[#d4a855]">
            ₹ {income.toLocaleString("en-IN")}
          </p>
        </div>

        {/* REQUIRED LOAN */}
        <div>
          <label className="font-semibold text-[#e8dfd0]">
            Required Loan
          </label>

          <input
            type="range"
            min="500000"
            max="50000000"
            step="500000"
            value={loan}
            onChange={(e) => setLoan(Number(e.target.value))}
            className="mt-3 w-full accent-[#d4a855]"
          />

          <p className="mt-2 font-bold text-[#d4a855]">
            ₹ {loan.toLocaleString("en-IN")}
          </p>
        </div>

        {/* CHECK BUTTON */}
        <button
          onClick={checkEligibility}
          className="w-full rounded-xl bg-[#d4a855] py-3 font-black text-[#080b12] transition hover:bg-[#e0b866]"
        >
          Check Eligibility
        </button>

        {/* RESULT */}
        {result !== null && (
          <>
            <div className="rounded-2xl border border-[#d4a855]/30 bg-[#d4a855]/10 p-5">
              <p className="text-sm text-[#bdb7ad]">
                Estimated eligible loan amount
              </p>

              <p className="mt-2 text-3xl font-black text-[#d4a855]">
                ₹ {result.toLocaleString("en-IN")}
              </p>

              <p className="mt-2 text-xs text-[#aaa49a]">
                This is an estimate for guidance only, not a loan approval.
              </p>
            </div>

            {/* APPLICATION FORM */}
            <LoanApplicationForm
              requiredLoanAmount={loan}
              estimatedEligibleAmount={result}
            />
          </>
        )}
      </div>
    </div>
  );
}
