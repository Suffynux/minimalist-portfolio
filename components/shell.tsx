export function GridBackdrop() {
  return <div className="grid-backdrop pointer-events-none fixed inset-0 z-0" />;
}

export function PageShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative min-h-screen overflow-x-hidden bg-bone text-ink">
      <GridBackdrop />
      {children}
    </div>
  );
}
