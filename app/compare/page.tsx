"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { properties } from "../../data/properties";
import Navbar from "../../components/Navbar";

export default function ComparePage() {

  const [compareIds, setCompareIds] = useState<number[]>([]);

  useEffect(() => {
    const ids = JSON.parse(
      localStorage.getItem("compareProperties") || "[]"
    ) as number[];

    setCompareIds(ids);
  }, []);


  function removeCompare(id: number) {

    const updated = compareIds.filter(
      (propertyId) => propertyId !== id
    );

    setCompareIds(updated);

    localStorage.setItem(
      "compareProperties",
      JSON.stringify(updated)
    );
  }


  const compareProperties = properties.filter((property) =>
    compareIds.includes(property.id)
  );


  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-gray-100 py-10">

        <div className="mx-auto max-w-7xl px-6">

          <h1 className="mb-8 text-4xl font-bold">
            ⚖️ Compare Properties
          </h1>


          {compareProperties.length === 0 ? (

            <div className="rounded-3xl bg-white p-10 text-center shadow">

              <h2 className="text-3xl font-bold">
                No Properties Selected
              </h2>

              <p className="mt-4 text-gray-600">
                Add properties from details page to compare.
              </p>

              <Link
                href="/"
                className="mt-6 inline-block rounded-xl bg-blue-600 px-6 py-3 font-bold text-white"
              >
                Browse Properties
              </Link>

            </div>

          ) : (

            <div className="overflow-x-auto rounded-2xl bg-white shadow-xl">

              <table className="min-w-full">

                <thead className="bg-blue-600 text-white">

                  <tr>

                    <th className="p-4 text-left">
                      Feature
                    </th>

                    {compareProperties.map((property)=>(

                      <th
                        key={property.id}
                        className="p-4 text-left"
                      >

                        {property.title}

                        <button
                          onClick={() => removeCompare(property.id)}
                          className="ml-3 rounded bg-red-500 px-3 py-1 text-sm"
                        >
                          Remove
                        </button>

                      </th>

                    ))}

                  </tr>

                </thead>


                <tbody>

                  <Row title="Price" values={compareProperties.map(p=>p.price)} />

                  <Row title="Location" values={compareProperties.map(p=>p.location)} />

                  <Row title="Builder" values={compareProperties.map(p=>p.builder)} />

                  <Row title="Bedrooms" values={compareProperties.map(p=>String(p.bedrooms))} />

                  <Row title="Bathrooms" values={compareProperties.map(p=>String(p.bathrooms))} />

                  <Row title="Area" values={compareProperties.map(p=>p.area)} />

                  <Row title="Parking" values={compareProperties.map(p=>p.parking)} />

                  <Row title="Possession" values={compareProperties.map(p=>p.possession)} />

                  <Row title="Rating" values={compareProperties.map(p=>`${p.rating}/5 ⭐`)} />

                </tbody>

              </table>

            </div>

          )}

        </div>

      </main>

    </>
  );
}



function Row({
  title,
  values,
}: {
  title:string;
  values:string[];
}) {

  return (

    <tr className="border-b">

      <td className="bg-gray-50 p-4 font-bold">
        {title}
      </td>


      {values.map((value,index)=>(

        <td
          key={index}
          className="p-4"
        >
          {value}
        </td>

      ))}

    </tr>

  );
}
