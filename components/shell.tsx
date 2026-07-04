export function GridBackdrop() {
  return <div className="grid-backdrop pointer-events-none fixed inset-0 z-0" />;
}

export function PageShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative min-h-screen overflow-x-hidden bg-bone pb-[calc(96px+env(safe-area-inset-bottom))] text-ink md:pb-0">
      <GridBackdrop />
      {children}
    </div>
  );
}
