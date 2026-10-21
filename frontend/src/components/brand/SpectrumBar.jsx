export default function SpectrumBar({ className = '' }) {
  return (
    <div
      className={`spectrum-bar h-[3px] w-full ${className}`}
      aria-hidden="true"
    />
  );
}
