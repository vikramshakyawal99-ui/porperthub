"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";

import {
  User,
  onAuthStateChanged
} from "firebase/auth";

import {
  doc,
  getDoc
} from "firebase/firestore";

import {
  auth,
  db
} from "@/lib/firebase";


type AuthContextType = {
  user: User | null;
  role: string | null;
  loading: boolean;
};


const AuthContext = createContext<AuthContextType>({
  user:null,
  role:null,
  loading:true,
});


export function AuthProvider({
  children
}:{
  children:ReactNode;
}){


const [user,setUser]=useState<User|null>(null);
const [role,setRole]=useState<string|null>(null);
const [loading,setLoading]=useState(true);



useEffect(()=>{


console.log("AUTH LISTENER STARTED");


const unsubscribe = onAuthStateChanged(
auth,
async(firebaseUser)=>{


console.log("FIREBASE UID:", firebaseUser?.uid);
console.log("FIREBASE EMAIL:", firebaseUser?.email);



try{


setUser(firebaseUser);



if(firebaseUser){


try{


const userRef = doc(
db,
"users",
firebaseUser.uid
);


const token = await firebaseUser.getIdTokenResult(true);

const claimRole = token.claims.role;

console.log(
"CLAIM ROLE:",
claimRole
);


if(claimRole){

setRole(
claimRole as string
);


}else{


const userRef = doc(
db,
"users",
firebaseUser.uid
);


const snap = await getDoc(userRef);


if(snap.exists()){

setRole(
snap.data().role || null
);


}else{

setRole(null);

}


}



}
catch(error){


console.log(
"USER DOC ERROR:",
error
);


setRole(null);


}



}else{


console.log(
"NO USER LOGIN"
);


setRole(null);


}



}
catch(error){


console.log(
"AUTH ERROR:",
error
);


setRole(null);


}
finally{


console.log(
"AUTH LOADING FALSE"
);


setLoading(false);


}



});


return ()=>unsubscribe();


},[]);



return (

<AuthContext.Provider
value={{
user,
role,
loading
}}
>

{children}

</AuthContext.Provider>

);


}



export const useAuth = ()=>useContext(AuthContext);
