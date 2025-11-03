import "./globals.css";
import Providers from "@/components/providers";

export const metadata = {
  metadataBase: new URL("https://animal-sounds.local"),
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
    url: "https://animal-sounds.local",
    siteName: "Animal Sounds",
    images: [
      {
        url: "/images/lion.jpg",
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
  images: ["/images/lion.jpg"],
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
