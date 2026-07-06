export default function ChromeLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex min-h-screen justify-center bg-bg p-3 text-text antialiased sm:p-6">
      <div className="term-window flex w-full max-w-2xl flex-col">
        <div className="term-titlebar">
          <span className="term-dot bg-error" aria-hidden />
          <span className="term-dot bg-accent-muted" aria-hidden />
          <span className="term-dot bg-success" aria-hidden />
          <span className="term-path">visitante@quiz-claude:~</span>
        </div>
        <div className="flex flex-1 flex-col">{children}</div>
      </div>
    </div>
  );
}
