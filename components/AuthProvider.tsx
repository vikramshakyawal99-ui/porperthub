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


console.log("FIREBASE USER:", firebaseUser?.uid);



try{


setUser(firebaseUser);



if(firebaseUser){


try{


const userRef = doc(
db,
"users",
firebaseUser.uid
);


const snap = await getDoc(userRef);



if(snap.exists()){


const userRole = snap.data().role;


console.log(
"USER ROLE:",
userRole
);


setRole(
userRole || "user"
);


}else{


console.log(
"USER DOCUMENT NOT FOUND"
);


setRole("user");


}



}
catch(error){


console.log(
"USER DOC ERROR:",
error
);


setRole("user");


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


setRole("user");


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
