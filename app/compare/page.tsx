"use client";

import { useState } from "react";
import Image from "next/image";
import { properties } from "../../data/properties";

export default function ComparePage() {

  const [selected, setSelected] = useState<number[]>([]);

  function toggle(id:number) {

    if(selected.includes(id)) {

      setSelected(
        selected.filter((item)=>item !== id)
      );

    } else {

      if(selected.length < 3) {
        setSelected([
          ...selected,
          id
        ]);
      }

    }
  }


  const compare =
    properties.filter((p)=>
      selected.includes(p.id)
    );


  return (

    <main className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-blue-50 px-6 py-16">

      <div className="mx-auto max-w-7xl">


        <div className="text-center mb-12">

          <span className="rounded-full bg-blue-100 px-5 py-2 text-sm font-bold text-blue-700">
            Smart Comparison
          </span>

          <h1 className="mt-5 text-5xl font-black text-slate-900">
            Compare Properties
          </h1>

          <p className="mt-3 text-slate-600">
            Select properties and compare their features easily
          </p>

        </div>



        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">


          {properties.map((property)=>(

            <button
              key={property.id}
              onClick={()=>toggle(property.id)}
              className={`
                text-left
                rounded-3xl
                bg-white
                text-slate-900
                border
                p-5
                shadow-lg
                transition
                hover:-translate-y-2
                ${
                  selected.includes(property.id)
                  ? "border-blue-600 ring-2 ring-blue-200"
                  : "border-slate-200"
                }
              `}
            >

              <div className="h-40 overflow-hidden rounded-2xl bg-slate-100">

                {property.image && (

                  <Image
                    src={property.image}
                    alt={property.title}
                    width={400}
                    height={250}
                    className="h-full w-full object-cover"
                  />

                )}

              </div>


              <h2 className="mt-5 text-xl font-black text-slate-900">
                {property.title}
              </h2>


              <p className="mt-2 text-sm text-slate-600">
                📍 {property.location}
              </p>


              <p className="mt-3 font-bold text-blue-600">
                💰 {property.price}
              </p>


              {selected.includes(property.id) && (

                <div className="mt-4 rounded-xl bg-blue-600 px-3 py-2 text-center text-sm font-bold text-white">
                  Added ✓
                </div>

              )}

            </button>

          ))}


        </div>



        {compare.length > 0 && (

          <div className="mt-14 overflow-x-auto">

            <div className="grid min-w-[700px] gap-6 md:grid-cols-3">


              {compare.map((p)=>(

                <div
                  key={p.id}
                  className="
                  rounded-3xl
                  bg-white
                  text-slate-900
                  p-7
                  shadow-xl
                  border
                  border-slate-200
                  "
                >

                  <h2 className="text-2xl font-black text-slate-900">
                    {p.title}
                  </h2>


                  <div className="mt-6 space-y-3 text-slate-700">

                    <p>🏢 Builder: {p.builder || "N/A"}</p>

                    <p>🛏 Bedrooms: {p.bedrooms || "N/A"}</p>

                    <p>📐 Area: {p.area || "N/A"}</p>

                    <p>⭐ Rating: {p.rating || "N/A"}</p>

                    <p>📍 Location: {p.location}</p>

                  </div>


                </div>

              ))}


            </div>

          </div>

        )}


      </div>

    </main>

  );
}
