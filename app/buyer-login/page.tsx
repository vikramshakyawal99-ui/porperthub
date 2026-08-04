"use client";

import {useState} from "react";

import {
signInWithEmailAndPassword,
createUserWithEmailAndPassword
} from "firebase/auth";

import {
doc,
setDoc,
getDoc
} from "firebase/firestore";

import {
auth,
db
} from "@/lib/firebase";


export default function BuyerLogin(){

const redirect =
typeof window !== "undefined"
  ? new URLSearchParams(window.location.search).get("redirect") || "/properties"
  : "/properties";


const [name,setName]=useState("");
const [email,setEmail]=useState("");
const [password,setPassword]=useState("");

const [isSignup,setIsSignup]=useState(false);

const [loading,setLoading]=useState(false);



async function handleSubmit(e:React.FormEvent){

e.preventDefault();

setLoading(true);


try{


let user;


if(isSignup){


const result =
await createUserWithEmailAndPassword(
auth,
email,
password
);


user=result.user;


await setDoc(
doc(db,"users",user.uid),
{
name,
email,
role:"buyer",
createdAt:new Date()
}
);



}
else{


const result =
await signInWithEmailAndPassword(
auth,
email,
password
);


user=result.user;


const snap =
await getDoc(
doc(db,"users",user.uid)
);


if(!snap.exists()){

await setDoc(
doc(db,"users",user.uid),
{
email,
role:"buyer",
createdAt:new Date()
}
);

}


}



alert("Login successful");


window.location.href=redirect;


}
catch(error:any){

alert(error.message);

}


setLoading(false);


}




return (

<div className="min-h-screen flex items-center justify-center bg-zinc-950 p-6">


<div className="bg-zinc-900 p-8 rounded-2xl w-full max-w-md">


<h1 className="text-3xl font-bold text-center mb-6 text-white">

{isSignup ? "Create Buyer Account" : "Buyer Login"}

</h1>



<form
onSubmit={handleSubmit}
className="space-y-4"
>


{isSignup && (

<input
className="w-full p-3 rounded text-black"
placeholder="Name"
value={name}
onChange={(e)=>setName(e.target.value)}
required
/>

)}



<input
className="w-full p-3 rounded text-black"
placeholder="Email"
type="email"
value={email}
onChange={(e)=>setEmail(e.target.value)}
required
/>



<input
className="w-full p-3 rounded text-black"
placeholder="Password"
type="password"
value={password}
onChange={(e)=>setPassword(e.target.value)}
required
/>



<button
disabled={loading}
className="w-full bg-blue-600 p-3 rounded text-white"
>

{loading ? "Please wait..." : 
(isSignup ? "Create Account" : "Login")}

</button>


</form>



<button

onClick={()=>setIsSignup(!isSignup)}

className="mt-5 text-cyan-400"

>

{
isSignup
?
"Already have account? Login"
:
"New buyer? Create account"
}

</button>



</div>


</div>

);


}
