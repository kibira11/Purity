"use client";

import { ProgressProvider } from "@/lib/store";
import { AuthProvider } from "@/lib/auth";
import { CloudSync } from "@/lib/sync";
import { PwaRegister } from "@/components/PwaRegister";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ProgressProvider>
      <AuthProvider>
        <CloudSync />
        <PwaRegister />
        {children}
      </AuthProvider>
    </ProgressProvider>
  );
}
