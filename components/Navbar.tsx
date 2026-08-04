"use client";

import Link from "next/link";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useAuth } from "./AuthProvider";
import { useEffect, useState } from "react";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { db } from "@/lib/firebase";

export default function Navbar() {
  const { user, role } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  const [unreadNotifications,setUnreadNotifications]=useState(0);


  useEffect(()=>{

    if(!user){
      setUnreadNotifications(0);
      return;
    }


    let field = "buyerId";


    


    if(
      role==="property_owner" ||
      role==="hostel_owner" ||
      role==="pg_owner" ||
      role==="room_owner" ||
      role==="resale_seller"
    ){
      field = "ownerId";
    }


    const q=query(
      collection(db,"notifications"),
      where(field,"==",user.uid),
      where("read","==",false)
    );


    const unsub=onSnapshot(q,(snap)=>{

      setUnreadNotifications(snap.size);

    });


    return ()=>unsub();


  },[user]);

  async function handleLogout() {
    await signOut(auth);
    window.location.href = "/";
  }

  return (
    <nav className="sticky top-0 z-50 border-b border-white/10 bg-zinc-950/80 backdrop-blur-xl shadow-lg">

      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">

        <Link
          href="/"
          className="text-3xl font-extrabold tracking-wide text-blue-400"
        >
          🏠 PropertyHub
        </Link>


        <button
          onClick={()=>setMenuOpen(!menuOpen)}
          className="md:hidden rounded-lg bg-blue-600 px-3 py-2 text-white"
        >
          ☰
        </button>


        <div className="hidden md:flex items-center gap-6 text-sm font-semibold text-gray-200">


          <Link href="/">
            Home
          </Link>


          <Link href="/properties">
            Buy
          </Link>


          <Link href="/favorites">
            ❤️ Favorites
          </Link>


          <Link href="/compare">
            ⚖️ Compare
          </Link>


          {user ? (

            <div className="flex items-center gap-4">

              <Link
                href="/profile"
                className="rounded-xl bg-cyan-600 px-4 py-2 text-white hover:bg-cyan-700"
              >
                👤 Profile
              </Link>


              <Link
                href="/buyer/dashboard"
                className="rounded-xl bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
              >
                👤 Dashboard
              </Link>


              <Link
                href="/my-enquiries"
                className="rounded-xl bg-purple-600 px-4 py-2 text-white hover:bg-purple-700"
              >
                📩 My Enquiries
              </Link>


              <Link
                href="/notifications"
                className="relative rounded-xl bg-yellow-600 px-4 py-2 text-white hover:bg-yellow-700"
              >
                🔔 Notifications

                {unreadNotifications > 0 && (
                  <span className="absolute -right-2 -top-2 rounded-full bg-red-600 px-2 py-1 text-xs font-bold">
                    {unreadNotifications}
                  </span>
                )}

              </Link>


              <button
                onClick={handleLogout}
                className="rounded-xl bg-red-600 px-5 py-2 text-white hover:bg-red-700"
              >
                Logout
              </button>

            </div>

          ) : (

            <>

              <Link
                href="/login"
                className="rounded-xl bg-blue-600 px-5 py-2 text-white"
              >
                Login
              </Link>


              <Link
                href="/signup"
                className="rounded-xl bg-green-600 px-5 py-2 text-white"
              >
                Sign Up
              </Link>

            </>

          )}


        </div>



        {menuOpen && (
          <div className="absolute left-0 top-full w-full bg-zinc-950 border-t border-white/10 p-5 md:hidden">

            <div className="flex flex-col gap-4 text-gray-200 font-semibold">

              <Link href="/" onClick={()=>setMenuOpen(false)}>
                Home
              </Link>

              <Link href="/properties" onClick={()=>setMenuOpen(false)}>
                Buy
              </Link>

              <Link href="/favorites" onClick={()=>setMenuOpen(false)}>
                ❤️ Favorites
              </Link>

              <Link href="/compare" onClick={()=>setMenuOpen(false)}>
                ⚖️ Compare
              </Link>


              {user ? (
                <>

                  <Link href="/profile" onClick={()=>setMenuOpen(false)}>
                    👤 Profile
                  </Link>


                  <Link href="/buyer/dashboard" onClick={()=>setMenuOpen(false)}>
                    👤 Dashboard
                  </Link>


                  <Link href="/my-enquiries" onClick={()=>setMenuOpen(false)}>
                    📩 My Enquiries
                  </Link>


                  <Link href="/notifications" onClick={()=>setMenuOpen(false)}>
                    🔔 Notifications
                  </Link>


                  {(role==="property_owner" ||
                    role==="hostel_owner" ||
                    role==="pg_owner" ||
                    role==="room_owner" ||
                    role==="resale_seller") && (
                    <Link href="/owner" onClick={()=>setMenuOpen(false)}>
                      🏢 Owner Dashboard
                    </Link>
                  )}


                  {role==="admin" && (
                    <Link href="/admin" onClick={()=>setMenuOpen(false)}>
                      ⚙️ Admin Panel
                    </Link>
                  )}


                  <button
                    onClick={handleLogout}
                    className="text-left text-red-400"
                  >
                    Logout
                  </button>

                </>
              ) : (
                <>

                  <Link href="/login" onClick={()=>setMenuOpen(false)}>
                    Login
                  </Link>

                  <Link href="/signup" onClick={()=>setMenuOpen(false)}>
                    Sign Up
                  </Link>

                </>
              )}

            </div>

          </div>
        )}


      </div>

    </nav>
  );
}
