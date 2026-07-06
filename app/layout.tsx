import type { Metadata } from "next";
import { JetBrains_Mono, Newsreader } from "next/font/google";
import "./globals.css";

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
});

const newsreader = Newsreader({
  variable: "--font-newsreader",
  subsets: ["latin"],
  style: ["normal", "italic"],
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  title: "Quiz Claude Code",
  description:
    "Quiz de perguntas Verdadeiro ou Falso sobre o Claude Code, em três níveis de dificuldade.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pt-BR"
      className={`${jetbrainsMono.variable} ${newsreader.variable} h-full`}
    >
      <body className="min-h-screen antialiased">{children}</body>
    </html>
  );
}
