export default function SpaceBackground() {
  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_18%,rgba(125,92,255,0.24),transparent_30%),radial-gradient(circle_at_78%_6%,rgba(34,211,238,0.18),transparent_24%),radial-gradient(circle_at_50%_92%,rgba(79,70,229,0.20),transparent_34%),linear-gradient(135deg,#01020a_0%,#050819_42%,#030712_100%)]" />
      <div className="star-field absolute inset-0 opacity-80" />
      <div className="space-grid absolute inset-0 opacity-25" />
      <div className="nebula-drift absolute -left-32 top-24 h-96 w-96 rounded-full bg-cyan-400/10 blur-3xl" />
      <div className="nebula-drift-delayed absolute -right-36 top-1/3 h-[30rem] w-[30rem] rounded-full bg-violet-500/10 blur-3xl" />
      <div className="comet comet-one" />
      <div className="comet comet-two" />
    </div>
  );
}
