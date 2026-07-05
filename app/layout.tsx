import type { Metadata } from "next";
import { JetBrains_Mono } from "next/font/google";
import "./globals.css";

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
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
    <html lang="pt-BR" className={`${jetbrainsMono.variable} h-full`}>
      <body className="min-h-screen flex justify-center bg-bg p-3 text-text antialiased sm:p-6">
        <div className="term-window flex w-full max-w-2xl flex-col">
          <div className="term-titlebar">
            <span className="term-dot bg-error" aria-hidden />
            <span className="term-dot bg-accent-muted" aria-hidden />
            <span className="term-dot bg-success" aria-hidden />
            <span className="term-path">visitante@quiz-claude:~</span>
          </div>
          <div className="flex flex-1 flex-col">{children}</div>
        </div>
      </body>
    </html>
  );
}
