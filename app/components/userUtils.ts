export type UserProfile = {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  isLoggedIn: boolean;
};

const USER_KEY = "divucloset-user";

export function getUser(): UserProfile | null {
  if (typeof window === "undefined") return null;
  const data = localStorage.getItem(USER_KEY);
  return data ? JSON.parse(data) : null;
}

export function saveUser(user: UserProfile) {
  if (typeof window === "undefined") return;
  localStorage.setItem(USER_KEY, JSON.stringify(user));
  window.dispatchEvent(new Event("userUpdated"));
}

export function clearUser() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(USER_KEY);
  window.dispatchEvent(new Event("userUpdated"));
}