"use client";

import { useEffect } from "react";
import { getGuestToken } from "@/lib/api";

export default function GuestAuth() {
  useEffect(() => {
    void getGuestToken().catch(() => {
      // Keep the page usable; the next API call will retry and expose its error.
      console.error("Guest authorization failed. The next API request will retry.");
    });
  }, []);

  return null;
}
