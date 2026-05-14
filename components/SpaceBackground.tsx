export default function SpaceBackground() {
  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      {/* Deep obsidian base */}
      <div className="absolute inset-0 bg-[linear-gradient(180deg,#050505_0%,#08080a_50%,#050505_100%)]" />

      {/* Aurora atmosphere — slow, premium */}
      <div className="aurora aurora-one" />
      <div className="aurora aurora-two" />
      <div className="aurora aurora-three" />

      {/* Architectural dot grid */}
      <div className="dot-grid absolute inset-0 opacity-50" />

      {/* Vertical accent beams */}
      <div className="beam beam-one" />
      <div className="beam beam-two" />
      <div className="beam beam-three" />

      {/* Vignette to frame the composition */}
      <div className="vignette absolute inset-0" />
    </div>
  );
}
