import type { Metadata } from "next";
import { IBM_Plex_Sans } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { ClerkProvider } from "@clerk/nextjs";

// This is a custom font that we're loading from Google Fonts using the next/font plugin for Next.js
const IBMPlexFont = IBM_Plex_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-ibm-plex",
});

// This is the metadata that will be used in the <head> of the HTML document that Next.js generates for us
export const metadata: Metadata = {
  title: "FR-PhotoEditor",
  description: "AI powered photo editor",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        {/* antialiased is a TailwindCSS class that applies font-smoothing to the text */}
        <body className={cn("font-IBMPlex antialiased", IBMPlexFont.variable)}>
          {/* IBMPlexFont.variable will apply the actual fonts */}
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
