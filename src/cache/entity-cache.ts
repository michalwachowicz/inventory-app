import { Entity } from "../types/entity";

export const cache = {
  genres: new Map<number, Entity>(),
  authors: new Map<number, Entity>(),
};

export type CacheKey = keyof typeof cache;

export function getCachedEntityList(key: CacheKey): Entity[] {
  return [...cache[key].values()];
}

export function getCachedEntity(key: CacheKey, id: number) {
  return cache[key].get(id);
}

export function updateCachedEntityList(key: CacheKey, list: Entity[]) {
  const map = new Map<number, Entity>();
  for (const entity of list) map.set(entity.id, entity);

  cache[key] = map;
}

export function cacheEntity(key: CacheKey, entity: Entity) {
  cache[key].set(entity.id, entity);
}

export function deleteCachedEntity(key: CacheKey, id: number) {
  cache[key].delete(id);
}

export function isCacheEntityKey(value: string): value is CacheKey {
  return Object.keys(cache).includes(value);
}
