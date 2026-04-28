"use client";

import { SessionProvider } from "next-auth/react";
import { Toaster } from "react-hot-toast";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      {children}
      <Toaster
        position="top-center"
        toastOptions={{
          duration: 3000,
          style: {
            background: "#1A1A1A",
            color: "#fff",
            borderRadius: "12px",
            fontSize: "14px",
            padding: "12px 16px",
          },
          success: { iconTheme: { primary: "#FFD700", secondary: "#1A1A1A" } },
        }}
      />
    </SessionProvider>
  );
}
