/** useTheme 切換網站顏色主題
 * Feat：@vueuse/core
 * Version: 1.0.0
 */

import { useCssVar } from '@vueuse/core';
import { useLocalCache } from './useLocalCache';
const { setCache } = useLocalCache();

import light from '@/themes/light.ts';
import dark from '@/themes/dark.ts';
import xmas from '@/themes/xmas';
import newYear from '@/themes/newYear.ts';

const themes = {
	light,
    dark,
    xmas,
    newYear,
};

type Theme = typeof themes;
export type ThemeTypes = keyof Theme;
export type CssVarTypes = keyof Theme['light'];

export function useTheme(
	el: HTMLElement | Ref<HTMLElement | null | undefined>,
	type: Ref<ThemeTypes> = ref('light')
) {
	const colors: Record<CssVarTypes | string, Ref<any>> = {};

	const switchColor = () => {
		Object.keys(themes[type.value]).forEach((item) => {
			colors[item].value = themes[type.value][item as CssVarTypes];
		});
		setCache('theme', type.value);
	};

	Object.keys(themes.light).forEach((item) => {
		colors[item] = useCssVar(item, el);
	});

	switchColor();
}
