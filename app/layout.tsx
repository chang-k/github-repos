import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "@/shared/lib/providers";

export const metadata: Metadata = {
  title: "GitHub Repository Search",
  description: "Search and explore GitHub repositories",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body className="antialiased bg-gray-50">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
