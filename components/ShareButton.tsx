"use client";

export default function ShareButton() {

  function shareProperty() {

    if (navigator.share) {

      navigator.share({
        title: "PropertyHub Property",
        text: "Check this amazing property",
        url: window.location.href,
      });

    } else {

      navigator.clipboard.writeText(
        window.location.href
      );

      alert("Property link copied!");

    }

  }


  return (
    <button
      onClick={shareProperty}
      className="rounded-xl bg-gray-800 px-6 py-3 font-bold text-white hover:bg-gray-900"
    >
      🔗 Share Property
    </button>
  );
}
