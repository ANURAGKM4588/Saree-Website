export function QuantityStepper({
  value,
  onChange,
}: {
  value: number;
  onChange: (next: number) => void;
}) {
  return (
    <div className="inline-flex items-center border border-border">
      <button
        type="button"
        aria-label="Decrease quantity"
        onClick={() => onChange(value - 1)}
        className="px-3 py-2 text-sm text-muted-foreground transition-colors hover:text-brand"
      >
        −
      </button>
      <span className="w-8 text-center text-sm tabular-nums">{value}</span>
      <button
        type="button"
        aria-label="Increase quantity"
        onClick={() => onChange(value + 1)}
        className="px-3 py-2 text-sm text-muted-foreground transition-colors hover:text-brand"
      >
        +
      </button>
    </div>
  );
}