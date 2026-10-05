"use client";

import { useEffect } from "react";
import { supabase } from "../lib/supabase";

export default function VisitTracker() {
  useEffect(() => {
    const trackVisit = async () => {
      try {
        let visitorId = localStorage.getItem("friends_shop_visitor_id");

        if (!visitorId) {
          visitorId =
            crypto.randomUUID?.() ||
            `${Date.now()}-${Math.random().toString(36).slice(2)}`;

          localStorage.setItem("friends_shop_visitor_id", visitorId);
        }

        const today = new Date().toISOString().slice(0, 10);
        const visitKey = `friends_shop_visit_${today}`;

        // একই দিনে একই ব্রাউজার থেকে বারবার visitor তৈরি হবে না
        if (localStorage.getItem(visitKey)) {
          return;
        }

        const {
          data: { user },
        } = await supabase.auth.getUser();

        const { error } = await supabase.from("site_visitors").insert({
          visitor_id: visitorId,
          user_id: user?.id ?? null,
          page: window.location.pathname,
        });

        if (error) {
          console.error("Visitor insert error:", error);
          return;
        }

        localStorage.setItem(visitKey, "1");
      } catch (error) {
        console.error("Visitor tracking error:", error);
      }
    };

    trackVisit();
  }, []);

  return null;
}
