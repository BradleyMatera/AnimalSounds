import "./globals.css";
import Providers from "@/components/providers";
import { basePath, withBasePath } from "@/lib/base-path";

const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000").replace(/\/$/, "");
const metadataBaseUrl = `${siteUrl}${basePath}`;

export const metadata = {
  metadataBase: new URL(metadataBaseUrl),
  title: {
    default: "Animal Sounds Soundboard",
    template: "%s | Animal Sounds"
  },
  description:
    "Interactive animal soundboard built with Next.js, Bun, and NextUI featuring rich imagery, accessibility, and offline-ready audio.",
  keywords: [
    "animal sounds",
    "soundboard",
    "next.js",
    "nextui",
    "bun"
  ],
  openGraph: {
    title: "Animal Sounds Soundboard",
    description:
      "Discover a beautifully designed animal soundboard powered by Next.js, Bun, and NextUI.",
    url: metadataBaseUrl,
    siteName: "Animal Sounds",
    images: [
      {
        url: withBasePath("/images/lion.jpg"),
        width: 1200,
        height: 630,
        alt: "Animal Sounds Soundboard preview"
      }
    ],
    locale: "en_US",
    type: "website"
  },
  twitter: {
    card: "summary_large_image",
    title: "Animal Sounds Soundboard",
    description:
      "Experience immersive wildlife audio powered by Next.js, Bun, and NextUI",
    images: [withBasePath("/images/lion.jpg")],
    creator: "@animalsounds"
  }
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-background text-foreground antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
