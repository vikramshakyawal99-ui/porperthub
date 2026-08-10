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


  },[user,role]);

  const ownerRoles = [
    "property_owner",
    "hostel_owner",
    "pg_owner",
    "room_owner",
    "resale_seller"
  ];

  function getDashboardLink(){
    if(role==="admin"){
      return "/admin";
    }

    if(role && ownerRoles.includes(role)){
      return "/owner/dashboard";
    }

    return "/buyer/dashboard";
  }


  async function handleLogout() {
    await signOut(auth);
    window.location.href = "/";
  }

  return (
    <nav className="sticky top-0 z-50 border-b border-[#d4a855]/20 bg-[#17130f]/80 backdrop-blur-xl shadow-lg">

      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">

        <Link
          href="/"
          className="text-3xl font-extrabold tracking-wide text-[#d4a855]"
        >
          🏠 PropertyHub
        </Link>


        <button
          onClick={()=>setMenuOpen(!menuOpen)}
          className="md:hidden rounded-lg bg-[#d4a855] px-3 py-2 text-white"
        >
          ☰
        </button>


        <div className="hidden md:flex items-center gap-6 text-sm font-semibold text-[#eee5d8]">


          <Link href="/">
            Home
          </Link>


          <Link href="/favorites">
            ❤️ Favorites
          </Link>


          <Link href="/compare">
            ⚖️ Compare
          </Link>


          {user ? (

            <div className="flex items-center gap-4">

              <div className="relative group">

                <button
                  className="rounded-xl bg-[#d4a855] px-5 py-2 text-white hover:bg-[#e1b968]"
                >
                  👤 Profile
                </button>


                <div className="absolute right-0 top-12 hidden w-56 rounded-2xl bg-white p-3 shadow-2xl group-hover:block">


                  <Link
                    href="/profile"
                    className="block rounded-xl px-4 py-3 text-[#2a241c] hover:bg-[#f3eadb]"
                  >
                    👤 My Profile
                  </Link>


                  <Link
                    href={getDashboardLink()}
                    className="block rounded-xl px-4 py-3 text-[#2a241c] hover:bg-[#f3eadb]"
                  >
                    📊 Dashboard
                  </Link>


                  <Link
                    href="/my-enquiries"
                    className="block rounded-xl px-4 py-3 text-[#2a241c] hover:bg-[#f3eadb]"
                  >
                    📩 My Enquiries
                  </Link>


                  <Link
                    href="/notifications"
                    className="block rounded-xl px-4 py-3 text-[#2a241c] hover:bg-[#f3eadb]"
                  >
                    🔔 Notifications
                  </Link>


                  <button
                    onClick={handleLogout}
                    className="mt-2 w-full rounded-xl bg-red-500 px-4 py-3 text-left font-bold text-white hover:bg-red-600"
                  >
                    🚪 Logout
                  </button>


                </div>

              </div>










            </div>

          ) : (

            <>

              <Link
                href="/buyer-login"
                className="rounded-xl bg-[#d4a855] px-5 py-2 text-white"
              >
                Login
              </Link>


              <Link
                href="/buyer-login?signup=true"
                className="rounded-xl bg-[#9b7a3c] px-5 py-2 text-white"
              >
                Sign Up
              </Link>

            </>

          )}


        </div>



        {menuOpen && (
          <div className="absolute left-0 top-full w-full bg-[#17130f] border-t border-[#d4a855]/20 p-5 md:hidden">

            <div className="flex flex-col gap-4 text-[#eee5d8] font-semibold">

              <Link href="/" onClick={()=>setMenuOpen(false)}>
                Home
              </Link>

              <div className="rounded-2xl bg-white/5 p-4">
                <p className="mb-3 text-[#d4a855]">
                  🏠 Buy Property
                </p>

                <div className="flex flex-col gap-3">

                  <Link href="/properties?type=flat" onClick={()=>setMenuOpen(false)}>
                    🏠 Flat
                  </Link>

                  <Link href="/properties?type=villa" onClick={()=>setMenuOpen(false)}>
                    🏡 Villa
                  </Link>

                  <Link href="/properties?type=plot" onClick={()=>setMenuOpen(false)}>
                    🌳 Plot
                  </Link>

                </div>
              </div>


              <div className="rounded-2xl bg-white/5 p-4">
                <p className="mb-3 text-[#d4a855]">
                  🔑 Rent
                </p>

                <div className="flex flex-col gap-3">

                  <Link href="/properties?purpose=rent" onClick={()=>setMenuOpen(false)}>
                    🏢 Flat Rent
                  </Link>

                  <Link href="/properties?type=room_rent" onClick={()=>setMenuOpen(false)}>
                    🛏 Room
                  </Link>

                </div>
              </div>


              <Link href="/properties?type=pg" onClick={()=>setMenuOpen(false)}>
                🛏 PG
              </Link>


              <Link href="/properties?type=hostel" onClick={()=>setMenuOpen(false)}>
                🏫 Hostel
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


                  <Link href={getDashboardLink()} onClick={()=>setMenuOpen(false)}>
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
                    <Link href="/owner/dashboard" onClick={()=>setMenuOpen(false)}>
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

                  <Link href="/buyer-login" onClick={()=>setMenuOpen(false)}>
                    Login
                  </Link>

                  <Link href="/buyer-login?signup=true" onClick={()=>setMenuOpen(false)}>
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
