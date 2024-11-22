import type { Metadata } from "next";
import "./globals.css";
import { roboto, young_serif } from "@/lib/fonts/fonts";
import Navbar from "./components/navbar";

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
    <html lang="en" className="dark">
      <body className={`${roboto.className} ${young_serif.variable} bg-stone-950 text-white p-0 m-0`}
      >
        <main className="container mx-auto p-8">
          <section className="sticky top-0 mb-16">
            <Navbar />
          </section>
          {children}
        </main>

      </body>
    </html>
  );
}
