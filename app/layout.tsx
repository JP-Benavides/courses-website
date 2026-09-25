import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Coursebook",
  description: "Explore NYU courses and preview your course-advising MCP account.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
