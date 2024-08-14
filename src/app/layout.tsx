import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/provider/theme-provider";
const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default: "homi - Your AI Home Finder",
    template: "%s | homi",
  },
  description:
    "homi is your AI-powered assistant to find your perfect HOME. Discover, compare, and choose your ideal living space with ease.",
  keywords: [
    "home finder",
    "AI real estate",
    "property search",
    "homi",
    "smart home search",
  ],
  authors: [{ name: "homi Team" }],
  creator: "homi Inc.",
  publisher: "homi Inc.",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },

  twitter: {
    card: "summary_large_image",
    title: "homi - AI-Powered Home Finding Assistant",
    description: "Discover your dream home with homi's AI technology.",
    images: ["https://www.homi.ai/twitter-image.jpg"],
    creator: "@homiAI",
  },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },
  applicationName: "homi",
  category: "Real Estate",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} `}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
