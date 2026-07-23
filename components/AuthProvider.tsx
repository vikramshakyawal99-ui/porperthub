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

import { auth, db } from "@/lib/firebase";


type AuthContextType = {
  user: User | null;
  role: string | null;
  loading: boolean;
};


const AuthContext = createContext<AuthContextType>({
  user: null,
  role: null,
  loading: true,
});


export function AuthProvider({
  children,
}: {
  children: ReactNode;
}) {

  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);


  useEffect(() => {

    const unsubscribe = onAuthStateChanged(
      auth,
      async(firebaseUser)=>{


        setUser(firebaseUser);


        if(firebaseUser){

          const userRef = doc(
            db,
            "users",
            firebaseUser.uid
          );


          const userSnap = await getDoc(userRef);


          if(userSnap.exists()){

            setRole(
              userSnap.data().role || "user"
            );

          }else{

            setRole("user");

          }


        }else{

          setRole(null);

        }


        setLoading(false);


      }
    );


    return ()=>unsubscribe();


  },[]);



  return (
    <AuthContext.Provider
      value={{
        user,
        role,
        loading,
      }}
    >

      {children}

    </AuthContext.Provider>
  );

}


export const useAuth = () => 
useContext(AuthContext);
