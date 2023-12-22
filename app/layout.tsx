import type { Metadata } from "next";
import { Inter } from "next/font/google";

import "./globals.css";
import "react-toastify/dist/ReactToastify.css";
import "zenn-content-css";

import Layout from "@/app/_components/layout";
import ToastProvider from "@/app/_providor/ToastProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Note",
  description: "Next Note",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <body className={inter.className}>
        <ToastProvider>
          <Layout>{children}</Layout>
        </ToastProvider>
      </body>
    </html>
  );
}
