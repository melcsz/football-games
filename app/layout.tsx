import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { Header } from "@/components/ui/Header";
import { Footer } from "@/components/ui/Footer";
import { SITE_TITLE } from "@/lib/core/constants";

const sans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-sans",
  weight: "100 900",
  display: "swap",
});

const mono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-mono",
  weight: "100 900",
  display: "swap",
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://weknowball.com";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: SITE_TITLE,
    template: `%s · ${SITE_TITLE}`,
  },
  description:
    "WeKnowBall — football quiz games. Daily TenaBall and more coming.",
  openGraph: {
    title: SITE_TITLE,
    description:
      "Daily TenaBall: name the top ten. Casual or Ranked mode. Pick answers from the pool.",
    type: "website",
    url: siteUrl,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${sans.variable} ${mono.variable} min-h-screen bg-[var(--background)] font-sans antialiased`}
      >
        <Header />
        <div className="mx-auto grid w-full max-w-[1520px] grid-cols-1 gap-6 px-4 pb-8 pt-4 sm:px-6 min-[1400px]:grid-cols-[140px_minmax(0,1200px)_140px]">
          <AdGutter />
          <div className="min-w-0">
            <TopAdSlot />
            <main className="min-h-[calc(100vh-12rem)]">
              {children}
            </main>
          </div>
          <AdGutter />
        </div>
        <Footer />
      </body>
    </html>
  );
}

function AdGutter() {
  return (
    <aside
      className="sticky top-20 hidden h-[42rem] min-[1400px]:block"
      aria-label="Ad space"
    />
  );
}

function TopAdSlot() {
  return <div className="h-[90px] w-full" aria-label="Ad space" />;
}
