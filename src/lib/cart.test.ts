import { describe, expect, it } from "vitest";
import {
  addCartLine,
  cartCount,
  cartSubtotal,
  changeQuantity,
  createWhatsAppMessage,
  createWhatsAppUrl,
  removeCartLine,
  type CartLine,
} from "./cart";

const sampleItem = {
  productId: "pizza-demo",
  name: "Pizza exemple",
  size: { id: "small", label: "Petite · exemple", priceAr: 10000 },
  extras: [{ id: "cheese", label: "Supplément · exemple", priceAr: 2000 }],
};

describe("cart helpers", () => {
  it("adds matching configurations together and computes a total", () => {
    const once = addCartLine([], sampleItem);
    const twice = addCartLine(once, sampleItem);

    expect(twice).toHaveLength(1);
    expect(cartCount(twice)).toBe(2);
    expect(cartSubtotal(twice)).toBe(24000);
  });

  it("keeps different sizes and extras as separate lines", () => {
    const first = addCartLine([], sampleItem);
    const second = addCartLine(first, {
      ...sampleItem,
      size: { id: "large", label: "Grande · exemple", priceAr: 15000 },
    });

    expect(second).toHaveLength(2);
  });

  it("decrements quantities and removes a line at zero", () => {
    const lines = addCartLine([], sampleItem);
    const key = lines[0].key;
    const two = changeQuantity(addCartLine(lines, sampleItem), key, -1);
    const none = changeQuantity(two, key, -1);

    expect(two[0].quantity).toBe(1);
    expect(none).toEqual([]);
  });

  it("removes a line explicitly", () => {
    const lines: CartLine[] = addCartLine([], sampleItem);
    expect(removeCartLine(lines, lines[0].key)).toEqual([]);
  });

  it("omits unverified prices from the WhatsApp message", () => {
    const lines = addCartLine([], sampleItem);
    const message = createWhatsAppMessage(lines, false);

    expect(message).toContain("Pizza exemple");
    expect(message).toContain("Supplément · exemple");
    expect(message).not.toContain("12 000");
    expect(message).not.toContain("Total :");
    expect(message).toContain("n'est pas confirmée");
  });

  it("includes totals only when explicitly permitted", () => {
    const message = createWhatsAppMessage(addCartLine([], sampleItem), true);

    expect(message).toContain("12 000 Ar");
    expect(message).toContain("Total :");
  });

  it("builds an encoded WhatsApp URL", () => {
    const url = createWhatsAppUrl("261328853996", "Bonjour & merci");

    expect(url).toContain("https://wa.me/261328853996?text=");
    expect(url).toContain("Bonjour%20%26%20merci");
  });
});
