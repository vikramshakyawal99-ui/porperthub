import Image from "next/image";
import Link from "next/link";
import { dealers } from "../data/dealers";

export default function PropertyDealers(){

return (

<section className="py-20 bg-slate-950">

<div className="max-w-7xl mx-auto px-6">

<div className="text-center mb-12">

<h2 className="text-4xl font-black text-white">
🤝 Trusted Property Dealers
</h2>

<p className="mt-3 text-slate-400">
Connect with verified real estate experts
</p>

</div>


<div className="grid md:grid-cols-3 gap-8">

{dealers.map((dealer)=>(

<div
key={dealer.id}
className="
rounded-3xl
border border-yellow-500/20
bg-white/5
p-6
text-center
backdrop-blur-xl
hover:border-yellow-400
transition
"
>

<Image
src={dealer.image}
width={120}
height={120}
alt={dealer.name}
className="mx-auto rounded-full border-4 border-yellow-500 shadow-xl"
/>


<h3 className="mt-5 text-xl font-bold text-white">
{dealer.name}
</h3>


<p className="mt-2 text-slate-400">
📍 {dealer.location}
</p>


<p className="mt-3 text-sm text-slate-300">
{dealer.experience}
</p>


<p className="mt-3 text-yellow-400 font-bold">
⭐ {dealer.rating} Rating
</p>


<p className="text-white mt-2">
🏠 {dealer.listings}+ Properties
</p>


<div className="flex justify-center gap-3 mt-6">

<a
href={`tel:${dealer.phone}`}
className="rounded-xl bg-yellow-500 px-4 py-2 text-sm font-bold text-black"
>
📞 Call
</a>


<a
href={`https://wa.me/${dealer.phone.replace(/\D/g,'')}`}
className="rounded-xl border border-green-500 px-4 py-2 text-sm font-bold text-green-400"
>
🟢 WhatsApp
</a>

</div>


<Link
href={`/dealers/${dealer.id}`}
className="block mt-5 text-yellow-400 font-bold"
>
View Profile →
</Link>


</div>

))}

</div>


<div className="mt-12 text-center">

<Link
href="/dealers"
className="inline-block rounded-xl bg-yellow-500 px-8 py-3 font-bold text-black"
>
Explore More Dealers →
</Link>

</div>


</div>

</section>

)

}
