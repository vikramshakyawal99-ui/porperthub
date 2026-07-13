"use client";

import { useState } from "react";
import { properties } from "../../data/properties";


export default function ComparePage() {

  const [selected, setSelected] = useState<number[]>([]);


  function toggle(id:number) {

    if(selected.includes(id)) {

      setSelected(
        selected.filter(
          (item)=>item !== id
        )
      );

    } else {

      if(selected.length < 2) {
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

    <main className="min-h-screen bg-gray-50 px-6 py-16">

      <div className="mx-auto max-w-7xl">

        <h1 className="mb-10 text-center text-4xl font-bold">
          ⚖️ Compare Properties
        </h1>


        <div className="grid gap-6 md:grid-cols-4">

          {properties.map((property)=>(

            <button
              key={property.id}
              onClick={()=>toggle(property.id)}
              className={`rounded-2xl bg-white p-6 text-left shadow ${
                selected.includes(property.id)
                ? "border-4 border-blue-600"
                : ""
              }`}
            >

              <h2 className="text-xl font-bold">
                {property.title}
              </h2>

              <p className="mt-2">
                📍 {property.location}
              </p>

              <p className="mt-2">
                💰 {property.price}
              </p>


            </button>

          ))}

        </div>



        {compare.length === 2 && (

          <div className="mt-12 grid gap-8 md:grid-cols-2">


            {compare.map((p)=>(

              <div
                key={p.id}
                className="rounded-3xl bg-white p-8 shadow-xl"
              >

                <h2 className="text-2xl font-bold">
                  {p.title}
                </h2>

                <hr className="my-5"/>


                <p>🏢 Builder: {p.builder}</p>
                <p>🛏 Bedrooms: {p.bedrooms}</p>
                <p>📐 Area: {p.area}</p>
                <p>⭐ Rating: {p.rating}</p>


              </div>

            ))}


          </div>

        )}


      </div>

    </main>

  );

}
