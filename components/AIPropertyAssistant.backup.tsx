"use client";

import { useState } from "react";
import { properties } from "../data/properties";

export default function AIPropertyAssistant() {
  const [open, setOpen] = useState(false);
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");

  function askAI() {
    const q = question.toLowerCase();

    let result = properties.filter((property) =>
      `${property.title} ${property.location} ${property.builder}`
        .toLowerCase()
        .includes(q)
    );

    if (result.length > 0) {
      setAnswer(
        result
          .map(
            (p) =>
              `${p.title} | ${p.location} | ${p.price} | ${p.bedrooms} BHK`
          )
          .join("\n")
      );
      return;
    }

    if (q.includes("2 bhk")) {
      const twoBhk = properties.filter(
        (p) => p.bedrooms === 2
      );

      setAnswer(
        twoBhk
          .map(
            (p) =>
              `${p.title} - ${p.price} (${p.location})`
          )
          .join("\n")
      );
      return;
    }

    if (q.includes("3 bhk")) {
      const threeBhk = properties.filter(
        (p) => p.bedrooms === 3
      );

      setAnswer(
        threeBhk
          .map(
            (p) =>
              `${p.title} - ${p.price} (${p.location})`
          )
          .join("\n")
      );
      return;
    }

    setAnswer(
      "Aap property ka location, budget, BHK ya builder ka naam puch sakte ho. Example: Jaipur 3 BHK, Villa, Manglam Group."
    );
  }

  return (
    <>
      <button
        onClick={() => setOpen(!open)}
        className="fixed bottom-6 right-6 rounded-full bg-blue-600 px-6 py-4 font-bold text-white shadow-xl"
      >
        🤖 AI Assistant
      </button>

      {open && (
        <div className="fixed bottom-24 right-6 w-80 rounded-2xl border bg-white p-5 shadow-2xl">

          <h2 className="text-xl font-bold">
            🤖 Property Assistant
          </h2>

          <input
            value={question}
            onChange={(e)=>setQuestion(e.target.value)}
            placeholder="Ask about property..."
            className="mt-4 w-full rounded-xl border p-3"
          />

          <button
            onClick={askAI}
            className="mt-3 w-full rounded-xl bg-blue-600 py-3 font-semibold text-white"
          >
            Ask
          </button>

          {answer && (
            <p className="mt-4 whitespace-pre-line text-gray-700">
              {answer}
            </p>
          )}

        </div>
      )}
    </>
  );
}
