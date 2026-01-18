"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { useEffect } from "react";

declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
  }
}

export default function AnalyticsTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    const url = pathname + (searchParams?.toString() ? `?${searchParams}` : "");

    if (window.gtag) {
      window.gtag("config", "G-CBPWBNP98C", {
        page_path: url,
      });
    }
  }, [pathname, searchParams]);

  return null;
}
