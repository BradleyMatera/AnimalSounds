import "./globals.css";
import Providers from "@/components/providers";
import { basePath, withBasePath } from "@/lib/base-path";

const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000").replace(/\/$/, "");
const metadataBaseUrl = `${siteUrl}${basePath}`;

export const metadata = {
  metadataBase: new URL(metadataBaseUrl),
  title: {
    default: "Wildlife Sounds — Explore Nature Through Sound",
    template: "%s | Wildlife Sounds"
  },
  description:
    "Immerse yourself in a premium wildlife audio explorer. Discover animal calls from forests, oceans, savannas, and beyond with elegant design and accessible interaction.",
  keywords: [
    "wildlife sounds",
    "nature audio",
    "animal sounds",
    "sound explorer",
    "next.js",
    "framer motion",
    "tailwind"
  ],
  openGraph: {
    title: "Wildlife Sounds — Explore Nature Through Sound",
    description:
      "A premium wildlife audio explorer built with modern React, Framer Motion, and Tailwind CSS.",
    url: metadataBaseUrl,
    siteName: "Wildlife Sounds",
    images: [
      {
        url: withBasePath("/images/lion.jpg"),
        width: 1200,
        height: 630,
        alt: "Wildlife Sounds preview"
      }
    ],
    locale: "en_US",
    type: "website"
  },
  twitter: {
    card: "summary_large_image",
    title: "Wildlife Sounds — Explore Nature Through Sound",
    description:
      "Immerse yourself in nature through a premium wildlife audio experience.",
    images: [withBasePath("/images/lion.jpg")],
    creator: "@wildlifesounds"
  }
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body className="min-h-screen bg-nature-950 text-slate-50 antialiased selection:bg-nature-300/30">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
