import { Analytics } from "@vercel/analytics/react";
import "./globals.css";

export const metadata = {
  title: "Compute Trading Intel — Last Myle Engineering",
  description:
    "Weekly intelligence on the compute-trading market: GPU futures, price indexes, and spot marketplaces. Last Myle Engineering research.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
