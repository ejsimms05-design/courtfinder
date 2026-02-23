import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "CourtFinder — Find Free Courts Near You",
  description: "Discover free public basketball and tennis courts nearby.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
