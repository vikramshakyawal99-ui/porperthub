"use client";

import { useState } from "react";

export default function EMICalculator() {
  const [loan, setLoan] = useState(5000000);
  const [rate, setRate] = useState(8);
  const [years, setYears] = useState(20);

  const monthlyRate = rate / 12 / 100;
  const months = years * 12;

  const emi =
    monthlyRate === 0
      ? loan / months
      : (loan *
          monthlyRate *
          Math.pow(1 + monthlyRate, months)) /
        (Math.pow(1 + monthlyRate, months) - 1);

  return (
    <div className="mt-8 rounded-xl bg-gray-50 p-6">
      <h2 className="mb-5 text-2xl font-bold">
        EMI Calculator
      </h2>

      <div className="space-y-4">

        <input
          type="number"
          value={loan}
          onChange={(e) => setLoan(Number(e.target.value))}
          className="w-full rounded border p-3"
          placeholder="Loan Amount"
        />

        <input
          type="number"
          value={rate}
          onChange={(e) => setRate(Number(e.target.value))}
          className="w-full rounded border p-3"
          placeholder="Interest Rate (%)"
        />

        <input
          type="number"
          value={years}
          onChange={(e) => setYears(Number(e.target.value))}
          className="w-full rounded border p-3"
          placeholder="Loan Tenure (Years)"
        />

        <div className="rounded-lg bg-blue-600 p-4 text-white">
          <h3 className="text-xl font-bold">
            Monthly EMI
          </h3>

          <p className="mt-2 text-3xl font-bold">
            ₹ {Math.round(emi).toLocaleString()}
          </p>
        </div>

      </div>
    </div>
  );
}