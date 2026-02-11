import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { cn } from "@crunch-ui/utils";
import { Legals, Toaster } from "@crunch-ui/core";
import localFont from "next/font/local";
import { TopNavbar } from "@/ui/navigation/topNavbar";
import "./globals.css";
import ReactQuery from "./react-query";
import Providers from "./providers";

const departure = localFont({
  src: "../../public/fonts/DepartureMono/DepartureMono-Regular.woff2",
  variable: "--font-departure",
});

export const metadata: Metadata = {
  title: {
    template: "%s | CrunchDAO Coordinator Platform",
    default: "CrunchDAO",
  },
  openGraph: {
    title: {
      template: "%s | CrunchDAO Coordinator Platform",
      default: "CrunchDAO",
    },
  },
  other: {
    "darkreader-lock": "1",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={cn(
          "flex flex-col pointer-events-auto!",
          GeistSans.variable,
          departure.variable
        )}
      >
        <ReactQuery>
          <Providers>
            <TopNavbar />
            {children}
            <Legals className="min-w-full px-6 pt-12 mt-auto" />
            <Toaster />
          </Providers>
        </ReactQuery>
      </body>
    </html>
  );
}
