export type OrderItem = {
  id: number;
  name: string;
  price: number;
  image: string;
  size: string;
  quantity: number;
};

export type OrderStatus =
  | "Pending Payment"
  | "Payment Verification"
  | "Confirmed"
  | "Processing"
  | "Shipped"
  | "Delivered"
  | "Cancelled";

export type Order = {
  orderId: string;
  customerName: string;
  phone: string;
  address: string;
  paymentApp: string;
  utrNumber: string;
  screenshotName: string;
  items: OrderItem[];
  total: number;
  status: OrderStatus;
  createdAt: string;
};

const ORDER_KEY = "divucloset-orders";

export function getOrders(): Order[] {
  if (typeof window === "undefined") return [];
  const data = localStorage.getItem(ORDER_KEY);
  return data ? JSON.parse(data) : [];
}

export function saveOrders(orders: Order[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(ORDER_KEY, JSON.stringify(orders));
  window.dispatchEvent(new Event("ordersUpdated"));
}

export function addOrder(order: Order) {
  const orders = getOrders();
  orders.unshift(order);
  saveOrders(orders);
}

export function findOrder(orderId: string, phone: string) {
  const orders = getOrders();
  return orders.find(
    (order) =>
      order.orderId.toLowerCase() === orderId.toLowerCase() &&
      order.phone === phone
  );
}

export function generateOrderId() {
  const random = Math.floor(1000 + Math.random() * 9000);
  return `DC${random}${Date.now().toString().slice(-4)}`;
}