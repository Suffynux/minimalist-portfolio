export function GridBackdrop() {
  return (
    <div className="grid-backdrop pointer-events-none fixed inset-0 z-0" />
  );
}
export function PageShell({ children }: { children: React.ReactNode }) {
  return (
    <div
      id="top"
      className="inner-page relative min-h-screen overflow-x-clip bg-bone text-ink"
    >
      <main id="main-content">{children}</main>
    </div>
  );
}
