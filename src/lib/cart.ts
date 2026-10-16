import type { MenuOption } from "../config/site";

export type CartLine = {
  key: string;
  productId: string;
  name: string;
  size: MenuOption;
  extras: MenuOption[];
  quantity: number;
};

export type NewCartLine = Omit<CartLine, "key" | "quantity">;

export function lineKey(line: Pick<NewCartLine, "productId" | "size" | "extras">) {
  const extrasKey = line.extras
    .map((extra) => extra.id)
    .sort()
    .join(",");
  return `${line.productId}:${line.size.id}:${extrasKey}`;
}

export function addCartLine(lines: CartLine[], item: NewCartLine): CartLine[] {
  const key = lineKey(item);
  const existing = lines.find((line) => line.key === key);

  if (existing) {
    return lines.map((line) =>
      line.key === key ? { ...line, quantity: line.quantity + 1 } : line,
    );
  }

  return [...lines, { ...item, key, quantity: 1 }];
}

export function changeQuantity(lines: CartLine[], key: string, delta: number): CartLine[] {
  return lines.flatMap((line) => {
    if (line.key !== key) return [line];
    const quantity = line.quantity + delta;
    return quantity > 0 ? [{ ...line, quantity }] : [];
  });
}

export function removeCartLine(lines: CartLine[], key: string): CartLine[] {
  return lines.filter((line) => line.key !== key);
}

export function cartCount(lines: CartLine[]) {
  return lines.reduce((total, line) => total + line.quantity, 0);
}

export function cartSubtotal(lines: CartLine[]) {
  return lines.reduce(
    (total, line) =>
      total +
      (line.size.priceAr + line.extras.reduce((sum, extra) => sum + extra.priceAr, 0)) *
        line.quantity,
    0,
  );
}

export function formatAriary(amount: number) {
  return `${new Intl.NumberFormat("fr-FR", { maximumFractionDigits: 0 }).format(amount)} Ar`;
}

export function createWhatsAppMessage(lines: CartLine[], includePrices: boolean) {
  const products = lines.map((line) => {
    const extras =
      line.extras.length > 0
        ? `\n   Suppléments : ${line.extras.map((extra) => extra.label).join(", ")}`
        : "";
    const price = includePrices
      ? ` — ${formatAriary(
          (line.size.priceAr + line.extras.reduce((sum, extra) => sum + extra.priceAr, 0)) *
            line.quantity,
        )}`
      : "";

    return `• ${line.quantity} × ${line.name} (${line.size.label})${price}${extras}`;
  });

  const total = includePrices ? `\n\nTotal : ${formatAriary(cartSubtotal(lines))}` : "";

  return [
    "Bonjour Oh! La! La Pizza's,",
    "",
    "Je souhaite me renseigner sur cette demande :",
    ...products,
    total,
    "",
    "Merci de me confirmer la disponibilité et les modalités. Je comprends que cette demande n'est pas confirmée avant votre réponse.",
  ]
    .filter(Boolean)
    .join("\n");
}

export function createWhatsAppUrl(phone: string, message: string) {
  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
}
