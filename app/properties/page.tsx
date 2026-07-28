import { Suspense } from "react";
import PropertiesContent from "./PropertiesContent";


export default function PropertiesPage(){

  return (

    <Suspense
      fallback={
        <main className="flex min-h-screen items-center justify-center">
          Loading...
        </main>
      }
    >

      <PropertiesContent />

    </Suspense>

  );

}
