"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import {
collection,
onSnapshot,
query,
where,
orderBy,
updateDoc,
doc,
writeBatch
} from "firebase/firestore";

import { db } from "@/lib/firebase";
import { useAuth } from "@/components/AuthProvider";


interface Notification {

id:string;
title:string;
message:string;

propertyTitle?:string;

notificationKey?:string;

type?:string;

leadId?:string;

propertyId?:string;

priority?:string;

read?:boolean;

createdAt?:any;

}



export default function OwnerNotifications(){


const {user}=useAuth();

const router=useRouter();


const [notifications,setNotifications]=useState<Notification[]>([]);

const [loading,setLoading]=useState(true);

const [filter,setFilter]=useState("all");



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




async function markAllRead(){


const batch=writeBatch(db);


notifications

.filter(item=>!item.read)

.forEach(item=>{


batch.update(

doc(db,"notifications",item.id),

{

read:true

}

);


});


await batch.commit();


}





function openNotification(item:Notification){


markRead(item.id);


if(item.leadId){

router.push(
`/owner/leads/${item.leadId}`
);

return;

}


if(item.propertyId){

router.push(
`/properties/${item.propertyId}`
);

return;

}


}





function icon(
type?:string,
title?:string
){


if(
type==="followup" ||
title?.includes("Follow")
)

return "📅";


if(type==="lead")

return "🔥";


if(type==="view")

return "👀";


return "🔔";


}




const unread =
notifications.filter(
item=>!item.read
).length;




const filteredNotifications =

notifications.filter(item=>{


if(filter==="all")
return true;


if(filter==="followup")
return (
item.type==="followup" ||
item.title.includes("Follow")
);


if(filter==="lead")
return item.type==="lead";


if(filter==="view")
return item.type==="view";


return true;


});






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

🔔 Owner Notifications

</h1>


<div className="flex gap-3">


<div className="bg-red-600 px-4 py-2 rounded-xl">

Unread {unread}

</div>



<button

onClick={markAllRead}

className="bg-[#60A5FA] px-4 py-2 rounded-xl"

>

Mark All Read

</button>


</div>


</div>





<div className="flex gap-3 mb-6">


{
[
["all","All"],
["followup","📅 Follow-up"],
["lead","🔥 Leads"],
["view","👀 Views"]

].map(item=>(


<button

key={item[0]}

onClick={()=>setFilter(item[0])}

className={`px-4 py-2 rounded-xl ${
filter===item[0]
?
"bg-[#60A5FA]"
:
"bg-zinc-800"
}`}

>

{item[1]}

</button>


))

}


</div>






{
filteredNotifications.length===0 ?


<div className="bg-zinc-900 p-6 rounded-xl">

No notifications yet

</div>



:


<div className="space-y-5">


{

filteredNotifications.map(item=>(


<div

key={item.id}

onClick={()=>openNotification(item)}

className={`p-6 rounded-2xl cursor-pointer border ${
item.read
?
"bg-zinc-900 border-zinc-800"
:
"bg-[#0B0F14] border-[#60A5FA]"
}`}


>


<div className="flex gap-4">


<div className="text-3xl">

{icon(item.type,item.title)}

</div>


<div className="flex-1">


<div className="flex justify-between">


<h2 className="text-xl font-bold">

{item.title}

</h2>


{
item.priority &&

<span className="text-sm bg-red-600 px-3 py-1 rounded-full">

{item.priority}

</span>

}


</div>



<p className="mt-2 text-gray-200">

{item.message}

</p>




{
item.propertyTitle &&

<p className="mt-3 text-sm text-gray-300">

🏠 {item.propertyTitle}

</p>

}



<p className="mt-3 text-sm">

{
item.read
?
"✅ Read"
:
"🆕 New"
}

</p>



</div>


</div>


</div>


))

}


</div>


}



</div>


</div>


);


}
