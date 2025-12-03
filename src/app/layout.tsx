import { GeistSans } from "geist/font/sans";
import { cn } from "@crunch-ui/utils";
import { Toaster } from "@crunch-ui/core";
import localFont from "next/font/local";
import "./globals.css";
import ReactQuery from "./react-query";
import type { Metadata } from "next";
import Providers from "./providers";
import "./globals.css";

const departure = localFont({
  src: "../../public/fonts/DepartureMono/DepartureMono-Regular.woff2",
  variable: "--font-departure",
});

export const metadata: Metadata = {
  title: {
    template: "%s | CrunchDAO",
    default: "CrunchDAO",
  },
  openGraph: {
    title: {
      template: "%s | CrunchDAO",
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
          "h-screen flex !pointer-events-auto",
          GeistSans.variable,
          departure.variable
        )}
      >
        <ReactQuery>
          <Providers>
            {children}
            <Toaster />
          </Providers>
        </ReactQuery>
      </body>
    </html>
  );
}
