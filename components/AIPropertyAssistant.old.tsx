"use client";

import { useState } from "react";

export default function AIPropertyAssistant() {
  const [open, setOpen] = useState(false);
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");

  function askAI() {
    const q = question.toLowerCase();

    if (q.includes("3 bhk")) {
      setAnswer(
        "Jaipur me 3 BHK properties available hain. Vaishali Nagar me Luxury 3 BHK Apartment ₹85 Lakh me available hai."
      );
    } else if (q.includes("villa")) {
      setAnswer(
        "Jagatpura me Premium Villa ₹1.45 Cr me available hai."
      );
    } else if (q.includes("jaipur")) {
      setAnswer(
        "Jaipur me Vaishali Nagar, Jagatpura aur Mansarovar me properties available hain."
      );
    } else {
      setAnswer(
        "Main aapko property location, price, BHK aur features ke baare me help kar sakta hu."
      );
    }
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
            onChange={(e) => setQuestion(e.target.value)}
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
            <p className="mt-4 text-gray-700">
              {answer}
            </p>
          )}

        </div>
      )}
    </>
  );
}
