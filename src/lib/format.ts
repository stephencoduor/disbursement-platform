const zmwFormatter = new Intl.NumberFormat("en-ZM", {
  style: "currency",
  currency: "ZMW",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

export function fmtZMW(amount: number): string {
  return zmwFormatter.format(amount);
}

export function fmtCompact(value: number): string {
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}M`;
  if (value >= 1_000) return `${(value / 1_000).toFixed(1)}K`;
  return value.toFixed(0);
}

export function fmtDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-ZM", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function fmtDateTime(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-ZM", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function fmtPhone(phone: string): string {
  // Format +260971234567 as +260 97 123 4567
  const clean = phone.replace(/\s/g, "");
  if (clean.startsWith("+260") && clean.length === 13) {
    return `${clean.slice(0, 4)} ${clean.slice(4, 6)} ${clean.slice(6, 9)} ${clean.slice(9)}`;
  }
  return phone;
}
