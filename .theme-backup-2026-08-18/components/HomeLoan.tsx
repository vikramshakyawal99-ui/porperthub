"use client";

import { useState } from "react";
import LoanEligibility from "./LoanEligibility";

export default function HomeLoan() {
  const [showLoanTools, setShowLoanTools] = useState(false);

  return (
    <section className="bg-white py-24 text-slate-900">

      <div className="mx-auto max-w-7xl px-6">

        <div className="grid gap-12 rounded-[2rem] border border-green-100 bg-green-50 p-8 md:p-12 lg:grid-cols-2 lg:items-center">

          <div>

            <span className="inline-flex rounded-full border border-green-200 bg-white px-5 py-2 text-sm font-semibold text-green-700 shadow-sm">
              🏦 Home Loan Assistance
            </span>

            <h2 className="mt-6 text-4xl font-black leading-tight tracking-tight md:text-5xl">
              Get Your Dream Home Loan
              <br />
              <span className="text-green-600">
                With Easy Eligibility Check
              </span>
            </h2>

            <p className="mt-6 max-w-xl text-lg leading-8 text-slate-600">
              Check your eligibility, calculate EMI and explore home loan
              options from leading banking partners.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">

              <button
                onClick={() => setShowLoanTools(true)}
                className="
                  rounded-xl
                  bg-green-600
                  px-8 py-3
                  font-black
                  text-white
                  shadow-sm
                  transition
                  hover:bg-green-700
                "
              >
                Apply for Loan
              </button>

              <button
                onClick={() => setShowLoanTools(true)}
                className="
                  rounded-xl
                  border border-green-200
                  bg-white
                  px-8 py-3
                  font-bold
                  text-green-700
                  transition
                  hover:bg-green-100
                "
              >
                Check Eligibility
              </button>

            </div>

          </div>

          <div className="grid grid-cols-2 gap-5">

            {[
              ["EMI Starts", "₹799/Lakh"],
              ["Interest Rate", "7.85%"],
              ["Partner Banks", "20+"],
              ["Approval Time", "24 hrs"],
            ].map(([title, value]) => (
              <div
                key={title}
                className="
                  rounded-3xl
                  border border-green-100
                  bg-white
                  p-6
                  text-center
                  shadow-sm
                  transition
                  hover:-translate-y-1
                  hover:shadow-md
                "
              >
                <h3 className="text-lg font-bold text-slate-600">
                  {title}
                </h3>

                <p className="mt-3 text-3xl font-black text-green-600">
                  {value}
                </p>
              </div>
            ))}

          </div>

        </div>

        {showLoanTools && (
          <div className="mt-12">
            <LoanEligibility />
          </div>
        )}

        <div className="mt-16">

          <div className="mb-7 text-center">

            <span className="text-sm font-semibold uppercase tracking-[0.2em] text-green-600">
              Banking Partners
            </span>

            <h3 className="mt-2 text-2xl font-black text-slate-900">
              Trusted Banking Partners
            </h3>

          </div>

          <div className="grid grid-cols-2 gap-4 md:grid-cols-6">

            {[
              "SBI",
              "HDFC",
              "ICICI",
              "Axis",
              "PNB",
              "Bank of Baroda",
            ].map((bank) => (
              <div
                key={bank}
                className="
                  rounded-xl
                  border border-slate-200
                  bg-white
                  p-4
                  text-center
                  font-black
                  text-slate-700
                  shadow-sm
                  transition
                  hover:border-green-200
                  hover:bg-green-50
                  hover:text-green-700
                "
              >
                {bank}
              </div>
            ))}

          </div>

        </div>

      </div>

    </section>
  );
}
