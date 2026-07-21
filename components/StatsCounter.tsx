"use client";

import { useEffect, useState } from "react";

type Props = {
  end: number;
  suffix?: string;
  label: string;
};

export default function StatsCounter({
  end,
  suffix = "+",
  label,
}: Props) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let current = 0;

    const increment = Math.max(1, Math.ceil(end / 80));

    const timer = setInterval(() => {
      current += increment;

      if (current >= end) {
        current = end;
        clearInterval(timer);
      }

      setCount(current);
    }, 20);

    return () => clearInterval(timer);
  }, [end]);

  return (
    <div className="text-center">
      <h2 className="text-4xl font-extrabold">
        {count}
        {suffix}
      </h2>

      <p className="mt-2 text-white">
        {label}
      </p>
    </div>
  );
}