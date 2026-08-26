"use client";

import { useEffect, useState } from "react";

import {
  collection,
  onSnapshot,
  query,
  where,
  orderBy,
  updateDoc,
  doc
} from "firebase/firestore";

import { db } from "@/lib/firebase";
import { useAuth } from "@/components/AuthProvider";


interface Notification {

id:string;
title:string;
message:string;
propertyTitle?:string;
read?:boolean;
createdAt?:any;

}


export default function NotificationsPage(){


const {user}=useAuth();

const [notifications,setNotifications]=useState<Notification[]>([]);
const [loading,setLoading]=useState(true);



useEffect(()=>{


if(!user) return;


const q=query(

collection(db,"notifications"),

where("buyerId","==",user.uid),

orderBy("createdAt","desc")

);



const unsub=onSnapshot(q,(snapshot)=>{


const data=snapshot.docs.map(item=>({

id:item.id,
...item.data()

})) as Notification[];


setNotifications(data);

setLoading(false);


});


return ()=>unsub();


},[user]);




async function markRead(id:string){


await updateDoc(

doc(db,"notifications",id),

{
read:true
}

);


}




if(loading){

return(

<div className="p-10 text-xl">
Loading notifications...
</div>

)

}



return(

<div className="min-h-screen bg-slate-50 text-slate-900 p-6">


<h1 className="text-3xl font-bold mb-8">
🔔 Notifications
</h1>



{
notifications.length===0 ?

<p className="text-slate-500">
No notifications yet
</p>

:

<div className="space-y-4">


{
notifications.map((item)=>(

<div

key={item.id}

className={`p-5 rounded-xl ${
item.read
?
"bg-white"
:
"bg-[#0B0F14]"
}`}

>


<h2 className="text-xl font-bold">
{item.title}
</h2>


<p className="mt-2">
{item.message}
</p>


{
item.propertyTitle && (

<p className="text-gray-300 mt-2">
🏠 {item.propertyTitle}
</p>

)

}



{
!item.read && (

<button

onClick={()=>markRead(item.id)}

className="mt-4 bg-green-600 px-4 py-2 rounded-lg"

>
Mark Read
</button>

)

}



</div>

))

}


</div>

}



</div>

);


}
