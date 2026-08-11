import { useEffect, useState } from "react";
import { useRouterState } from "@tanstack/react-router";

export function PageLoader() {
  const [initialLoading, setInitialLoading] = useState(true);
  const isNavigating = useRouterState({ select: (s) => s.status === "pending" });

  useEffect(() => {
    const timer = setTimeout(() => {
      setInitialLoading(false);
    }, 600);
    return () => clearTimeout(timer);
  }, []);

  const show = initialLoading || isNavigating;

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-background/95 backdrop-blur-md transition-opacity duration-500">
      <div className="relative flex items-center justify-center">
        {/* Soft gold glowing aura */}
        <div className="absolute h-28 w-28 rounded-full bg-gold/20 blur-xl animate-pulse" />

        {/* Outer dashed spinning ring */}
        <div className="h-24 w-24 rounded-full border-2 border-dashed border-gold/60 animate-[spin_8s_linear_infinite]" />

        {/* Rotating favicon logo icon */}
        <img
          src="/logo/Favicon.png"
          alt="Kadha Loading"
          width={64}
          height={64}
          className="favicon-spin absolute h-14 w-14 object-contain drop-shadow-md"
        />
      </div>
    </div>
  );
}
