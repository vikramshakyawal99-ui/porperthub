"use client";

import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";
import { useState } from "react";

type Props = {
  onLocationSelect: (data:any)=>void;
};

const center = {
  lat:26.9124,
  lng:75.7873,
};

const containerStyle = {
  width:"100%",
  height:"400px",
};


export default function LocationPicker({
  onLocationSelect
}:Props){


const {isLoaded}=useJsApiLoader({

googleMapsApiKey:
process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ""

});


const [position,setPosition]=useState(center);



const handleClick=(e:google.maps.MapMouseEvent)=>{


if(!e.latLng) return;


const lat=e.latLng.lat();

const lng=e.latLng.lng();


console.log("MAP CLICK LOCATION:",{
latitude:lat,
longitude:lng
});


setPosition({
lat,
lng
});


onLocationSelect({

latitude:lat,

longitude:lng

});


};



if(!isLoaded){

return <div>Loading Map...</div>;

}



return (

<GoogleMap

mapContainerStyle={containerStyle}

center={position}

zoom={13}

onClick={handleClick}

>

<Marker position={position}/>

</GoogleMap>

);


}
