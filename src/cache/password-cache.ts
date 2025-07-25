import { TTLCache } from "../types/ttl-cache";

const PASSWORD_TTL = 60 * 1000; // 1 minute
const cachedPassword: TTLCache<string> = { value: "", expires: 0 };

export function getCachedPassword() {
  if (cachedPassword.expires <= Date.now()) return null;
  return cachedPassword.value;
}

export function updateCachedPassword(password: string) {
  cachedPassword.expires = Date.now() + PASSWORD_TTL;
  cachedPassword.value = password;
}
