// Decorative shield marking Staff protected by the Manager; the square's
// accessible label already announces the protection.
export default function ShieldIcon({ className }: { className?: string }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 12 14" className={className}>
      <path d="M6 0 12 2.5V7c0 3.5-2.6 6-6 7-3.4-1-6-3.5-6-7V2.5Z" />
    </svg>
  );
}
