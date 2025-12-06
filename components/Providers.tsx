"use client";

import { RepairProvider } from "@/context/RepairContext";
import { ReactNode } from "react";

export function Providers({ children }: { children: ReactNode }) {
  return <RepairProvider>{children}</RepairProvider>;
}

