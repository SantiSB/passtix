import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "PassTix",
  description: "Ticket Management System",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
