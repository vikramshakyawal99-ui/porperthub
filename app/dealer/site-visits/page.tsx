"use client";

export default function DealerSiteVisits(){

  return (

    <div className="min-h-screen bg-zinc-100 p-8">

      <div className="max-w-6xl mx-auto">


        <h1 className="text-3xl font-bold text-blue-700">
          Site Visits
        </h1>

        <p className="text-gray-500 mt-2">
          Manage customer property visit schedules
        </p>



        <div className="grid md:grid-cols-3 gap-6 mt-8">


          <div className="bg-white rounded-2xl shadow p-6">

            <h2 className="font-semibold">
              Total Visits
            </h2>

            <p className="text-4xl font-bold text-blue-700 mt-3">
              0
            </p>

          </div>



          <div className="bg-white rounded-2xl shadow p-6">

            <h2 className="font-semibold">
              Upcoming
            </h2>

            <p className="text-4xl font-bold text-green-600 mt-3">
              0
            </p>

          </div>



          <div className="bg-white rounded-2xl shadow p-6">

            <h2 className="font-semibold">
              Completed
            </h2>

            <p className="text-4xl font-bold text-gray-700 mt-3">
              0
            </p>

          </div>


        </div>



        <div className="mt-8 bg-white rounded-2xl shadow p-8 text-center">


          <div className="text-5xl">
            📅
          </div>


          <h2 className="text-xl font-bold mt-4">
            No Site Visits Scheduled
          </h2>


          <p className="text-gray-500 mt-2">
            Customer bookings will appear here.
          </p>


        </div>



      </div>


    </div>

  );

}
