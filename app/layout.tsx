import type { Metadata, Viewport } from "next";
import Link from "next/link";
import { Baloo_2, Gaegu, JetBrains_Mono, Lexend } from "next/font/google";
import Nav from "@/components/Nav";
import CozyDock from "@/components/CozyDock";
import Leaves from "@/components/Leaves";
import SmoothScroll from "@/components/SmoothScroll";
import { EXAMS_URL, FEPREP_URL, MATERIAL_URL } from "@/lib/sections";
import "./globals.css";

/* Baloo 2 = bubbly headings · Lexend = body text designed for easier reading · Gaegu = handwritten notes */
const baloo = Baloo_2({ subsets: ["latin"], variable: "--f-baloo", weight: ["500", "600", "700", "800"] });
const lexend = Lexend({ subsets: ["latin"], variable: "--f-lexend", weight: ["300", "400", "500", "600", "700"] });
const gaegu = Gaegu({ subsets: ["latin"], variable: "--f-gaegu", weight: ["400", "700"] });
const mono = JetBrains_Mono({ subsets: ["latin"], variable: "--f-mono", weight: ["400", "700"] });

export const metadata: Metadata = {
  title: { default: "FE Café ☕ · Cozy Foundation Exam Prep", template: "%s · FE Café ☕" },
  description:
    "A cozy, cute, ADHD-friendly study café for UCF's CS Foundation Exam (COP 3502). Analogies, pictures, mnemonics, playgrounds and the missing puzzle pieces lectures skip.",
  icons: { icon: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>☕</text></svg>" },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f7f1fc" },
    { media: "(prefers-color-scheme: dark)", color: "#1b1426" },
  ],
};

/* Runs before paint so there's no flash of the wrong theme. */
const themeScript = `(function(){try{var t=localStorage.getItem('fe-cafe-theme');if(!t){t=matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light'}document.documentElement.dataset.theme=t}catch(e){document.documentElement.dataset.theme='light'}})();`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${baloo.variable} ${lexend.variable} ${gaegu.variable} ${mono.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body>
        <SmoothScroll />
        <Leaves />
        <Nav />
        <main style={{ position: "relative", zIndex: 2 }}>{children}</main>
        <footer className="footer">
          <div className="wrap" style={{ display: "flex", flexWrap: "wrap", gap: 24, justifyContent: "space-between" }}>
            <div>
              <strong>☕ FE Café</strong>, a cozy corner for the UCF CS Foundation Exam.
              <br />
              Made with 🍵 and too many analogies. Not an official UCF site.
            </div>
            <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
              <Link href="/menu">Menu</Link>
              <a href={MATERIAL_URL} target="_blank" rel="noreferrer">COP3502 notes ↗</a>
              <a href={EXAMS_URL} target="_blank" rel="noreferrer">Official past exams ↗</a>
              <a href={FEPREP_URL} target="_blank" rel="noreferrer">feprep.net ↗</a>
            </div>
          </div>
        </footer>
        <CozyDock />
      </body>
    </html>
  );
}
