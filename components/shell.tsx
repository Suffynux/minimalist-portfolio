export function GridBackdrop() {
  return <div className="grid-backdrop pointer-events-none fixed inset-0 z-0" />;
}

export function PageShell({ children }: { children: React.ReactNode }) {
  // overflow-x-clip, not -hidden. Any overflow other than visible/clip makes
  // this div a scroll container, which breaks two things descendants rely on:
  // position:sticky (it sticks to this div, which never scrolls) and
  // preserve-3d (the context is flattened). clip only clips.
  return (
    <div className="relative min-h-screen overflow-x-clip bg-bone pb-[calc(96px+env(safe-area-inset-bottom))] text-ink md:pb-0">
      <GridBackdrop />
      {children}
    </div>
  );
}
