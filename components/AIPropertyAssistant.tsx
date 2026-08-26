"use client";

import { useState } from "react";

export default function AIPropertyAssistant() {

  const [message, setMessage] = useState("");
  const [answer, setAnswer] = useState(
    "Namaste 👋 Main aapki property related queries me help kar sakta hu."
  );


  function askAI() {

    if (!message) return;


    const text = message.toLowerCase();


    if (text.includes("investment")) {
      setAnswer(
        "Ye property investment ke liye achhi lag rahi hai kyunki location, connectivity aur amenities strong hain."
      );
    }

    else if (text.includes("emi")) {
      setAnswer(
        "EMI calculate karne ke liye upar diya gaya EMI Calculator use karein."
      );
    }

    else if (text.includes("location")) {
      setAnswer(
        "Location analysis ke hisab se nearby facilities aur connectivity achhi hai."
      );
    }

    else {
      setAnswer(
        "Main property price, location, EMI aur investment se jude sawalon me help kar sakta hu."
      );
    }

  }


  return (
    <section className="mt-10 rounded-3xl bg-gradient-to-r from-[#60A5FA] to-[#60A5FA] p-8 text-white shadow-xl">

      <h2 className="text-3xl font-bold">
        🤖 AI Property Assistant
      </h2>

      <p className="mt-2">
        Ask anything about this property
      </p>


      <div className="mt-6 flex flex-col gap-4 md:flex-row">

        <input
          value={message}
          onChange={(e)=>setMessage(e.target.value)}
          placeholder="Ask about investment, EMI, location..."
          className="flex-1 rounded-xl p-4 text-white"
        />


        <button
          onClick={askAI}
          className="rounded-xl bg-orange-500 px-8 py-4 font-bold"
        >
          Ask AI
        </button>

      </div>


      <div className="mt-6 rounded-2xl bg-zinc-900/20 p-5">
        {answer}
      </div>


    </section>
  );
}
