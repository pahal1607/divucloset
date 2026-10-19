import { supabase } from "./supabaseClient";
import { toError } from "./errorUtils";

export type OrderStatus =
  | "Pending Payment"
  | "Payment Verification"
  | "Confirmed"
  | "Processing"
  | "Shipped"
  | "Delivered"
  | "Cancelled";

export type OrderInput = {
  user_id: string;
  order_id: string;
  customer_name: string;
  phone: string;
  address: string;
  payment_app: string;
  utr_number: string;
  screenshot_name: string;
  total: number;
  status: OrderStatus;
  expected_delivery: string;
  stock_applied: boolean;
};

export type OrderItemInput = {
  order_id: number;
  product_id: number | null;
  product_name: string;
  size: string;
  quantity: number;
  price: number;
};

export async function createOrder(order: OrderInput) {
  const { data, error } = await supabase
    .from("orders")
    .insert([order])
    .select()
    .single();

  if (error) throw toError(error);
  return data;
}

export async function createOrderItems(items: OrderItemInput[]) {
  const { data, error } = await supabase
    .from("order_items")
    .insert(items)
    .select();

  if (error) throw toError(error);
  return data;
}

export async function getMyOrders(userId: string) {
  const { data, error } = await supabase
    .from("orders")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) throw toError(error);
  return data;
}

export async function getAllOrders() {
  const { data, error } = await supabase
    .from("orders")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw toError(error);
  return data;
}

export async function getOrderItems(orderId: number) {
  const { data, error } = await supabase
    .from("order_items")
    .select("*")
    .eq("order_id", orderId);

  if (error) throw toError(error);
  return data;
}

export async function updateOrderFields(
  id: number,
  updates: Partial<{
    status: OrderStatus;
    stock_applied: boolean;
    expected_delivery: string;
  }>
) {
  const { data, error } = await supabase
    .from("orders")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) throw toError(error);
  return data;
}

export function generateOrderId() {
  const random = Math.floor(1000 + Math.random() * 9000);
  return `DC${random}${Date.now().toString().slice(-4)}`;
}

export function getExpectedDeliveryDate(daysToAdd = 5) {
  const date = new Date();
  date.setDate(date.getDate() + daysToAdd);
  return date.toISOString().split("T")[0];
}