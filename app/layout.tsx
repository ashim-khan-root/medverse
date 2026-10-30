import type { Metadata, Viewport } from "next";
import { Nunito } from "next/font/google";
import "./globals.css";
import { SiteNav } from "@/components/nav";

const nunito = Nunito({
  subsets: ["latin"],
  weight: ["400", "600", "700", "800", "900"],
  variable: "--font-nunito",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "MedVerse — Learn Health, Playfully",
    template: "%s · MedVerse",
  },
  description:
    "A playful health-learning hub for students: first-aid quizzes, health myths, a body explorer, medicine lookup, habit streaks, and nearby care. Educational use only.",
  applicationName: "MedVerse",
  authors: [{ name: "MedVerse — student project" }],
  keywords: [
    "health education",
    "first aid",
    "students",
    "anatomy",
    "medicine",
    "habits",
  ],
};

export const viewport: Viewport = {
  themeColor: "#fbf6f0",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${nunito.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-xl focus:bg-white focus:px-4 focus:py-2 focus:font-bold focus:shadow-lg"
        >
          Skip to content
        </a>
        <SiteNav />
        <main id="main" className="flex-1 pb-28 pt-6 md:pb-16">
          {children}
        </main>
        <footer className="mx-auto w-full max-w-6xl px-4 pb-28 text-center text-xs font-semibold text-muted sm:px-6 md:pb-10">
          MedVerse · Educational use only — not medical advice.
        </footer>
      </body>
    </html>
  );
}
