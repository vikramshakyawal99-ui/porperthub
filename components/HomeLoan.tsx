"use client";

import { useMemo, useState } from "react";
import LoanApplicationForm from "./LoanApplicationForm";

export type BankOffer = {
  id: string;
  name: string;
  shortName: string;
  rate: number;
  rateLabel: string;
  tenureYears: number;
  processingFee: string;
  highlight: string;
  sourceUrl: string;
};

const bankOffers: BankOffer[] = [
  {
    id: "sbi",
    name: "State Bank of India",
    shortName: "SBI",
    rate: 7.25,
    rateLabel: "From 7.25% p.a.",
    tenureYears: 30,
    processingFee: "As per applicable scheme",
    highlight: "Large branch network",
    sourceUrl:
      "https://sbi.co.in/web/interest-rates/interest-rates/loan-schemes-interest-rates/home-loans-interest-rates-current",
  },
  {
    id: "hdfc",
    name: "HDFC Bank",
    shortName: "HDFC",
    rate: 7.75,
    rateLabel: "From 7.75% p.a.",
    tenureYears: 30,
    processingFee: "As per applicant profile",
    highlight: "Flexible repayment options",
    sourceUrl:
      "https://www.hdfc.com/checklist/home-loan-interest-rates",
  },
  {
    id: "axis",
    name: "Axis Bank",
    shortName: "AXIS",
    rate: 8.2,
    rateLabel: "8.20%–9.10% p.a.",
    tenureYears: 30,
    processingFee: "As per selected loan variant",
    highlight: "Multiple home-loan variants",
    sourceUrl:
      "https://www.axisbank.com/retail/loans/home-loan/axis-bank-home-loan/interest-rates-charges",
  },
  {
    id: "icici",
    name: "ICICI Bank",
    shortName: "ICICI",
    rate: 8.5,
    rateLabel: "From 8.50% p.a.",
    tenureYears: 30,
    processingFee: "Up to 2% + applicable taxes",
    highlight: "Digital application support",
    sourceUrl:
      "https://www.icicibank.com/personal-banking/loans/home-loan/interest-rates",
  },
];

function calculateEmi(
  principal: number,
  annualRate: number,
  years: number
) {
  if (principal <= 0 || annualRate <= 0 || years <= 0) {
    return 0;
  }

  const monthlyRate = annualRate / 12 / 100;
  const months = years * 12;
  const factor = Math.pow(1 + monthlyRate, months);

  return Math.round(
    (principal * monthlyRate * factor) /
      (factor - 1)
  );
}

function formatMoney(value: number) {
  return `₹${Math.round(value).toLocaleString("en-IN")}`;
}

export default function HomeLoan() {
  const [loanAmount, setLoanAmount] = useState(4000000);
  const [monthlyIncome, setMonthlyIncome] = useState(75000);
  const [tenureYears, setTenureYears] = useState(20);
  const [selectedBank, setSelectedBank] =
    useState<BankOffer | null>(null);
  const [sortBy, setSortBy] = useState<
    "rate" | "emi"
  >("rate");

  const offers = useMemo(() => {
    return bankOffers
      .map((bank) => ({
        ...bank,
        estimatedEmi: calculateEmi(
          loanAmount,
          bank.rate,
          tenureYears
        ),
      }))
      .sort((a, b) =>
        sortBy === "emi"
          ? a.estimatedEmi - b.estimatedEmi
          : a.rate - b.rate
      );
  }, [loanAmount, tenureYears, sortBy]);

  const estimatedEligibleAmount = Math.max(
    0,
    Math.round(monthlyIncome * 60)
  );

  function selectBank(bank: BankOffer) {
    setSelectedBank(bank);

    window.setTimeout(() => {
      document
        .getElementById("loan-application-form")
        ?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
    }, 100);
  }

  return (
    <section
      id="home-loan"
      className="scroll-mt-24 bg-[#fbfaf8] py-20 text-slate-900"
    >
      <div className="mx-auto max-w-7xl px-5 sm:px-6">
        <div className="text-center">
          <span className="inline-flex rounded-full bg-green-50 px-4 py-2 text-xs font-black uppercase tracking-[0.16em] text-green-700">
            Home Loan Marketplace
          </span>

          <h2 className="mt-5 text-3xl font-black tracking-tight sm:text-4xl lg:text-5xl">
            Compare Home Loan Offers
          </h2>

          <p className="mx-auto mt-4 max-w-2xl leading-7 text-slate-600">
            Enter your requirement, compare indicative
            bank offers and send an enquiry for the option
            you prefer.
          </p>
        </div>

        <div className="mt-10 grid gap-5 rounded-[28px] border border-green-100 bg-green-50/70 p-5 shadow-sm md:grid-cols-3 lg:p-7">
          <label>
            <span className="text-xs font-black uppercase tracking-wider text-slate-500">
              Required loan amount
            </span>

            <input
              type="number"
              min={500000}
              step={100000}
              value={loanAmount}
              onChange={(event) =>
                setLoanAmount(
                  Number(event.target.value) || 0
                )
              }
              className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-4 font-bold text-slate-900 outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100"
            />

            <p className="mt-2 text-sm font-black text-green-700">
              {formatMoney(loanAmount)}
            </p>
          </label>

          <label>
            <span className="text-xs font-black uppercase tracking-wider text-slate-500">
              Monthly income
            </span>

            <input
              type="number"
              min={10000}
              step={5000}
              value={monthlyIncome}
              onChange={(event) =>
                setMonthlyIncome(
                  Number(event.target.value) || 0
                )
              }
              className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-4 font-bold text-slate-900 outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100"
            />

            <p className="mt-2 text-sm font-black text-green-700">
              {formatMoney(monthlyIncome)} / month
            </p>
          </label>

          <label>
            <span className="text-xs font-black uppercase tracking-wider text-slate-500">
              Preferred tenure
            </span>

            <select
              value={tenureYears}
              onChange={(event) =>
                setTenureYears(
                  Number(event.target.value)
                )
              }
              className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-4 font-bold text-slate-900 outline-none focus:border-green-500"
            >
              {[10, 15, 20, 25, 30].map(
                (years) => (
                  <option key={years} value={years}>
                    {years} Years
                  </option>
                )
              )}
            </select>

            <p className="mt-2 text-sm text-slate-500">
              Eligibility estimate:{" "}
              <strong className="text-green-700">
                {formatMoney(
                  estimatedEligibleAmount
                )}
              </strong>
            </p>
          </label>
        </div>

        <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.16em] text-green-700">
              Indicative offers
            </p>

            <h3 className="mt-2 text-2xl font-black">
              Choose a preferred bank
            </h3>
          </div>

          <div className="flex rounded-xl border border-slate-200 bg-white p-1">
            <button
              type="button"
              onClick={() => setSortBy("rate")}
              className={`rounded-lg px-4 py-2 text-xs font-black ${
                sortBy === "rate"
                  ? "bg-green-600 text-white"
                  : "text-slate-500"
              }`}
            >
              Lowest Rate
            </button>

            <button
              type="button"
              onClick={() => setSortBy("emi")}
              className={`rounded-lg px-4 py-2 text-xs font-black ${
                sortBy === "emi"
                  ? "bg-green-600 text-white"
                  : "text-slate-500"
              }`}
            >
              Lowest EMI
            </button>
          </div>
        </div>

        <div className="mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {offers.map((bank) => (
            <article
              key={bank.id}
              className={`rounded-2xl border bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-lg ${
                selectedBank?.id === bank.id
                  ? "border-green-600 ring-2 ring-green-100"
                  : "border-slate-200"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="flex h-12 min-w-16 items-center justify-center rounded-xl bg-green-50 px-3 text-sm font-black text-green-700">
                  {bank.shortName}
                </span>

                {bank.id === offers[0]?.id && (
                  <span className="rounded-full bg-green-600 px-3 py-1 text-[10px] font-black text-white">
                    LOWEST
                  </span>
                )}
              </div>

              <h4 className="mt-5 text-lg font-black text-slate-900">
                {bank.name}
              </h4>

              <p className="mt-1 text-xs text-slate-500">
                {bank.highlight}
              </p>

              <div className="mt-5 rounded-xl bg-green-50 p-4">
                <p className="text-xs font-bold text-slate-500">
                  Interest rate
                </p>
                <p className="mt-1 text-xl font-black text-green-700">
                  {bank.rateLabel}
                </p>
              </div>

              <dl className="mt-5 space-y-3 text-sm">
                <div className="flex justify-between gap-3">
                  <dt className="text-slate-500">
                    Estimated EMI
                  </dt>
                  <dd className="font-black text-slate-900">
                    {formatMoney(bank.estimatedEmi)}
                  </dd>
                </div>

                <div className="flex justify-between gap-3">
                  <dt className="text-slate-500">
                    Max tenure
                  </dt>
                  <dd className="font-bold">
                    {bank.tenureYears} years
                  </dd>
                </div>

                <div>
                  <dt className="text-slate-500">
                    Processing fee
                  </dt>
                  <dd className="mt-1 font-semibold text-slate-700">
                    {bank.processingFee}
                  </dd>
                </div>
              </dl>

              <button
                type="button"
                onClick={() => selectBank(bank)}
                className="mt-6 w-full rounded-xl bg-green-600 px-4 py-3 font-black text-white hover:bg-green-700"
              >
                Apply with {bank.shortName}
              </button>

              <a
                href={bank.sourceUrl}
                target="_blank"
                rel="noreferrer"
                className="mt-3 block text-center text-xs font-bold text-green-700 hover:underline"
              >
                View official rate source ↗
              </a>
            </article>
          ))}
        </div>

        <p className="mt-5 text-center text-xs leading-5 text-slate-500">
          Rates shown are indicative public rates reviewed
          on 21 August 2026. Final rate, fees, eligibility
          and approval depend on the applicant profile,
          credit assessment and the bank’s current policy.
        </p>

        {selectedBank && (
          <div
            id="loan-application-form"
            className="scroll-mt-28"
          >
            <LoanApplicationForm
              requiredLoanAmount={loanAmount}
              estimatedEligibleAmount={
                estimatedEligibleAmount
              }
              monthlyIncome={monthlyIncome}
              tenureYears={tenureYears}
              selectedBank={selectedBank}
              estimatedEmi={calculateEmi(
                loanAmount,
                selectedBank.rate,
                tenureYears
              )}
            />
          </div>
        )}
      </div>
    </section>
  );
}
