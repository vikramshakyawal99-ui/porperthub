"use client";

import { useEffect, useState, type ReactNode } from "react";

type Props = {
  children: ReactNode;
  fallback?: ReactNode;
};

export default function PropertyDetailDeferred({
  children,
  fallback = null,
}: Props) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setReady(true);
    }, 300);

    return () => clearTimeout(timer);
  }, []);

  return ready ? children : fallback;
}
