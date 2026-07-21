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

  const totalPayment = emi * months;
  const interest = totalPayment - loan;

  const score =
    loan < 5000000
      ? 9
      : loan < 10000000
      ? 8
      : 7;

  return (
    <div className="mt-10 rounded-3xl bg-zinc-900 p-8 shadow-xl">

      <h2 className="text-3xl font-bold">
        🏦 Smart EMI Calculator
      </h2>

      <p className="mt-2 text-gray-300">
        Check your property affordability instantly
      </p>


      <div className="mt-8 space-y-6">


        <div>
          <label className="font-semibold">
            Loan Amount
          </label>

          <input
            type="range"
            min="1000000"
            max="50000000"
            step="500000"
            value={loan}
            onChange={(e)=>setLoan(Number(e.target.value))}
            className="w-full"
          />

          <p className="font-bold">
            ₹ {loan.toLocaleString()}
          </p>
        </div>


        <div>
          <label className="font-semibold">
            Interest Rate
          </label>

          <input
            type="range"
            min="5"
            max="15"
            step="0.1"
            value={rate}
            onChange={(e)=>setRate(Number(e.target.value))}
            className="w-full"
          />

          <p className="font-bold">
            {rate}%
          </p>
        </div>


        <div>
          <label className="font-semibold">
            Tenure
          </label>

          <input
            type="range"
            min="5"
            max="30"
            value={years}
            onChange={(e)=>setYears(Number(e.target.value))}
            className="w-full"
          />

          <p className="font-bold">
            {years} Years
          </p>
        </div>


        <div className="grid gap-5 md:grid-cols-3">

          <div className="rounded-2xl bg-blue-600 p-5 text-white">
            <p>Monthly EMI</p>
            <h3 className="text-3xl font-bold">
              ₹ {Math.round(emi).toLocaleString()}
            </h3>
          </div>


          <div className="rounded-2xl bg-zinc-950 p-5">
            <p>Total Interest</p>
            <h3 className="text-2xl font-bold">
              ₹ {Math.round(interest).toLocaleString()}
            </h3>
          </div>


          <div className="rounded-2xl bg-green-100 p-5">
            <p>Affordability Score</p>
            <h3 className="text-3xl font-bold">
              {score}/10
            </h3>
          </div>

        </div>

      </div>

    </div>
  );
}
