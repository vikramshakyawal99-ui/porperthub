"use client";

import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";
import { useState } from "react";

type Props = {
  onLocationSelect: (data:any)=>void;
};

const center = {
  lat: 26.9124,
  lng: 75.7873,
};


export default function LocationPicker({
  onLocationSelect
}:Props){

  const {isLoaded} = useJsApiLoader({

    googleMapsApiKey:
      process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ""

  });


  const [position,setPosition] = useState(center);


  function handleMapClick(e:any){

    const lat =
      e.latLng.lat();

    const lng =
      e.latLng.lng();


    setPosition({
      lat,
      lng
    });


    onLocationSelect({

      latitude:lat,
      longitude:lng

    });

  }



  if(!isLoaded){

    return (
      <p>
        Loading Map...
      </p>
    );

  }



  return (

    <div className="mt-5">

      <h3 className="mb-3 text-xl font-bold">
        📍 Select Property Location
      </h3>


      <GoogleMap

        mapContainerStyle={{
          width:"100%",
          height:"400px",
          borderRadius:"20px"
        }}

        center={position}

        zoom={13}

        onClick={handleMapClick}

      >

        <Marker position={position}/>


      </GoogleMap>


      <p className="mt-3 text-sm">
        Latitude: {position.lat}
        <br/>
        Longitude: {position.lng}
      </p>


    </div>

  );

}
