"use client";

export default function DealerProfile(){

  return (

    <div className="min-h-screen bg-zinc-100 p-8">

      <div className="max-w-4xl mx-auto">


        <h1 className="text-3xl font-bold text-blue-700">
          Dealer Profile
        </h1>

        <p className="text-gray-500 mt-2">
          Manage your business information
        </p>



        <div className="mt-8 bg-white rounded-2xl shadow p-8">


          <div className="flex items-center gap-5">


            <div className="
              w-20
              h-20
              rounded-full
              bg-blue-700
              text-white
              flex
              items-center
              justify-center
              text-3xl
              font-bold
            ">
              D
            </div>


            <div>

              <h2 className="text-2xl font-bold">
                Dealer Name
              </h2>

              <p className="text-gray-500">
                Property Dealer
              </p>

            </div>


          </div>



          <div className="grid md:grid-cols-2 gap-5 mt-8">


            <div className="border rounded-xl p-4">

              <p className="text-gray-500">
                Business Name
              </p>

              <p className="font-semibold mt-1">
                Your Agency
              </p>

            </div>



            <div className="border rounded-xl p-4">

              <p className="text-gray-500">
                Mobile Number
              </p>

              <p className="font-semibold mt-1">
                +91 XXXXX XXXXX
              </p>

            </div>



            <div className="border rounded-xl p-4">

              <p className="text-gray-500">
                Email
              </p>

              <p className="font-semibold mt-1">
                dealer@email.com
              </p>

            </div>



            <div className="border rounded-xl p-4">

              <p className="text-gray-500">
                City
              </p>

              <p className="font-semibold mt-1">
                Jaipur
              </p>

            </div>


          </div>



          <button
            className="
            mt-8
            bg-blue-700
            text-white
            px-6
            py-3
            rounded-xl
            font-semibold
            "
          >
            Edit Profile
          </button>



        </div>


      </div>


    </div>

  );

}
