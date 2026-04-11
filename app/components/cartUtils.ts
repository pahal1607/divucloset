export type CartItem = {
  id: number;
  name: string;
  price: number;
  image: string;
  size: string;
  quantity: number;
};

const CART_KEY = "divucloset-cart";

export function getCart(): CartItem[] {
  if (typeof window === "undefined") return [];
  const data = localStorage.getItem(CART_KEY);
  return data ? JSON.parse(data) : [];
}

export function saveCart(cart: CartItem[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
  window.dispatchEvent(new Event("cartUpdated"));
}

export function addToCart(item: CartItem) {
  const cart = getCart();

  const existing = cart.find(
    (cartItem) => cartItem.id === item.id && cartItem.size === item.size
  );

  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push(item);
  }

  saveCart(cart);
}