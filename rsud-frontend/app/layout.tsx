// app/layout.tsx
import type { Metadata } from "next";
import "./globals.css"; // <--- Pastikan baris ini ada agar globals.css terbaca

export const metadata: Metadata = {
  title: "RSUD App",
  description: "Sistem Antrian RSUD",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      {/* Hapus atribut className="dark" atau sejenisnya jika ada di tag body */}
      <body>
        {children}
      </body>
    </html>
  );
}