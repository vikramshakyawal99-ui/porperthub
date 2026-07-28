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



export default function OwnerNotifications(){


const {user}=useAuth();

const [notifications,setNotifications]=useState<Notification[]>([]);
const [loading,setLoading]=useState(true);



useEffect(()=>{


if(!user) return;


const q=query(

collection(db,"notifications"),

where("ownerId","==",user.uid),

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





const unread = notifications.filter(
(item)=>!item.read
).length;




if(loading){

return(

<div className="p-8">
Loading Notifications...
</div>

);

}





return(


<div className="min-h-screen bg-zinc-950 text-white p-8">


<div className="max-w-5xl mx-auto">


<div className="flex justify-between items-center mb-8">


<h1 className="text-3xl font-bold">
🔔 Notifications
</h1>


<div className="bg-red-600 px-4 py-2 rounded-xl">
Unread: {unread}
</div>


</div>





{
notifications.length===0 ?

<div className="bg-zinc-900 p-6 rounded-xl">
No notifications yet
</div>


:


<div className="space-y-5">


{
notifications.map((item)=>(


<div

key={item.id}

onClick={()=>markRead(item.id)}

className={`p-6 rounded-2xl cursor-pointer ${
item.read
?
"bg-zinc-900"
:
"bg-blue-900"
}`}

>


<h2 className="text-xl font-bold">
{item.title}
</h2>


<p className="mt-2">
{item.message}
</p>



{
item.propertyTitle &&

<p className="mt-3 text-sm text-gray-300">
🏠 Property: {item.propertyTitle}
</p>

}



<p className="mt-3 text-sm">

{
item.read
?
"✅ Read"
:
"🔵 New"
}

</p>


</div>


))

}


</div>

}


</div>


</div>


);


}
