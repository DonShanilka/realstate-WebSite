export function formatPrice(value: number): string {
  if (value >= 1_000_000) return `Rs. ${(value / 1_000_000).toFixed(1)}M`;
  return `Rs. ${Math.round(value).toLocaleString("en-LK")}`;
}

export function formatType(value: string | null): string {
  return value ? value.charAt(0) + value.slice(1).toLowerCase() : "Property";
}

export function location(parts: (string | null | undefined)[]): string {
  return parts.filter(Boolean).join(", ");
}

export function toNumber(value: string): number | undefined {
  if (value.trim() === "") return undefined;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : undefined;
}
