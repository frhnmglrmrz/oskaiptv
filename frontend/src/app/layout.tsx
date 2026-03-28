import type { Metadata } from "next";
import { Toaster } from "react-hot-toast";
import "./globals.css";

export const metadata: Metadata = {
  title: "OSKA IPTV Admin Panel",
  description: "Hotel IPTV Management System by OSKA",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              border: "3px solid #0a0a0a",
              boxShadow: "4px 4px 0px #0a0a0a",
              fontWeight: "700",
            },
          }}
        />
        {children}
      </body>
    </html>
  );
}
