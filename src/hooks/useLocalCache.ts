/** localStorage 操作 composable
 * Feat：@vueuse/core
 * Version: 1.0.0
 */

import { useLocalStorage } from '@vueuse/core';

const defCache: {
    token: string;
    theme: 'light' | 'dark' | 'xmas' | 'newYear';
    lang: 'zh-Hant' | 'zh-Hans' | 'en-US' | 'ja-JP';
    [key: string]: string;
} = {
    token: '',
    theme: 'light',
    lang: 'zh-Hant',
};

type LocalCacheValueType = typeof defCache;
type Keys = Extract<keyof LocalCacheValueType, string>;

export function useLocalCache() {
    function getCache<T extends Keys>(key: T): LocalCacheValueType [T] {
        return useLocalStorage(key, defCache[key]).value;
    }

    function setCache<T extends Keys>(key: T, value: LocalCacheValueType [T]) {
        useLocalStorage(key, defCache[key]).value = value;
    }

    function removeCache(key: Keys) {
        useLocalStorage(key, defCache[key]).value = null;
    }

    function clearCache() {
        localStorage.clear();
    }

    return { getCache, setCache, removeCache, clearCache };
}
