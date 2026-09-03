"use client";

import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

export default function AdminGuard({
  children,
}: {
  children: React.ReactNode;
}) {
  const [allowed, setAllowed] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const checkAdmin = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        window.location.href = "/login";
        return;
      }

      const { data: roleData } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", user.id)
        .single();

      if (roleData?.role !== "admin") {
        window.location.href = "/";
        return;
      }

      setAllowed(true);
      setChecking(false);
    };

    checkAdmin();
  }, []);

  if (checking) {
    return (
      <div style={{ padding: "30px", textAlign: "center" }}>
        🔐 Checking admin access...
      </div>
    );
  }

  if (!allowed) return null;

  return <>{children}</>;
}

