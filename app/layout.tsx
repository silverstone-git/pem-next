import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import HeaderBar from "@/components/header-bar";
import { auth } from "./auth";
import { SessionProvider } from "next-auth/react";
import { ThemeProvider } from "@/components/theme-provider";
import { Braces, CircleUser, Instagram, Mail } from "lucide-react";
import Link from "next/link";
import { Toaster } from "@/components/ui/sonner"

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Please Explain Me",
  description: "Tech, Science, Space Blog.",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  return (
    <html lang="en">
      <head>
        {/*<script defer src="https://cdn.jsdelivr.net/gh/c-kick/mobileConsole/hnl.mobileconsole.min.js"></script>*/}
        <link rel="preconnect" href="https://fonts.googleapis.com"></link>
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        ></link>
        <link
          href="https://fonts.googleapis.com/css2?family=Whisper&display=swap"
          rel="stylesheet"
        ></link>
        <link
          rel="icon"
          href="/icon?<generated>"
          type="image/<generated>"
          sizes="<generated>"
        />
        {/*<link rel="icon" href="/favicon.ico" sizes="any" />*/}
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.css"
          integrity="sha384-n8MVd4RsNIU0tAv4ct0nTaAbDJwPJzDEaqSD1odI+WdtXRGWt2kTvGFasHpSy3SV"
          crossOrigin="anonymous"
        ></link>
      </head>

      <body className={inter.className}>
        <SessionProvider session={session}>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <HeaderBar></HeaderBar>
            <div className=" min-h-[90vh] ">{children}</div>
          </ThemeProvider>
        </SessionProvider>
        <div className="h-10"></div>
        <div className="w-full px-4 md:px-16 bg-zinc-100 dark:bg-zinc-900 dark:text-pink-300 text-pink-700 h-[15vh] flex justify-between items-center">
          <div className="font-whisper font-bold text-xl md:text-2xl">
            Please Explain Me
          </div>
          <div className="flex gap-4">
            <Link
              className="hover:text-zinc-900 hover:dark:text-white transition-colors"
              href={"https://instagram.com/@notcyto"}
              target="blank"
            >
              <Instagram></Instagram>
            </Link>
            <Link
              className="hover:text-zinc-900 hover:dark:text-white transition-colors"
              href={"mailto:aryan_sidhwani@protonmail.com"}
              target="blank"
            >
              <Mail></Mail>
            </Link>
            <Link
              className="hover:text-zinc-900 hover:dark:text-white transition-colors"
              href={"https://github.com/silverstone-git/pem-next/"}
              target="blank"
            >
              {" "}
              <Braces></Braces>
            </Link>
            <Link
              className="hover:text-zinc-900 hover:dark:text-white transition-colors"
              href={"https://aryan.cfd"}
              target="blank"
            >
              <CircleUser></CircleUser>
            </Link>
          </div>
        </div>
        <Toaster />
      </body>
    </html>
  );
}
