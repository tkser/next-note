import type { Metadata } from "next";
import { cookies } from "next/headers";
import { Inter } from "next/font/google";

import "./globals.css";
import "react-toastify/dist/ReactToastify.css";
import "zenn-content-css";

import { loginWithToken } from "@/app/_libs/auth";
import Layout from "@/app/_components/layout";
import ToastProvider from "@/app/_providor/ToastProvider";
import AuthProvider from "./_providor/AuthProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Note",
  description: "Next Note",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const token = cookies().get("token");
  const user = token ? await loginWithToken(token.value) : null;
  return (
    <html lang="ja">
      <body className={inter.className}>
        <AuthProvider user={user}>
          <ToastProvider>
            <Layout>{children}</Layout>
          </ToastProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
