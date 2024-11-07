import type { Metadata } from "next";
import "./globals.css";
import { roboto, young_serif } from "@/lib/fonts/fonts";

export const metadata: Metadata = {
  title: "Legiscan",
  description: "Review Legal Documents Fast.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${roboto.className} ${young_serif.variable}`}
      >
        {children}
      </body>
    </html>
  );
}
