import { useRef } from 'react';

/**
 * 为一组"可能还没有服务器 id"的对象生成稳定、不重复的 React key。
 *
 * 适用场景：表单里可以动态增删的条目（如选项列表），新建的条目在保存前没有
 * `id`，且内容本身（如多语言 text 对象）无法直接拼接成唯一字符串。
 *
 * 已有 `id` 的条目直接复用该 id；没有 `id` 的条目按对象引用缓存一个随机生成
 * 的 uuid，只要对象引用不变（即使内容被修改），key 就保持稳定。
 */
export function useStableKey<T extends { id?: string }>() {
  const keysRef = useRef(new WeakMap<T, string>());

  return (item: T): string => {
    if (item.id) return item.id;
    const cache = keysRef.current;
    let key = cache.get(item);
    if (!key) {
      key = crypto.randomUUID();
      cache.set(item, key);
    }
    return key;
  };
}
