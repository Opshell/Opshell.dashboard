// [-]關於這裡的型別，theme一定是string，並且讓loadTheme指定為一個Promise
export async function loadTheme(theme: string): Promise<void> {
    // 使用Object物件映射可以更好的處理動態載入Scss來源
    const themeMap: { [key: string]: () => Promise<any>  } = {
        normalTheme: () => import('@/assets/scss/themes/normal.scss'),
        darkTheme: () => import('@/assets/scss/themes/dark.scss'),
        xmasTheme: () => import('@/assets/scss/themes/xmas.scss'),
        newYearTheme: () => import('@/assets/scss/themes/new-year.scss'),
    };

    if (theme in themeMap) {
        const selectedThemeModule = await themeMap[theme]();
        applyThemeStyles(selectedThemeModule.default);
    } else {
        console.error(`Invalid theme: ${theme}`);
    }
}

/**
 * 根據API回傳的結果來套用指定主題
 * 並且在DOM上產生一組 <style id="theme-styles">
 */
function applyThemeStyles(styles: string): void {
    // 這裡要特別指定styleElement為一個HTMLStyleElement
    // 初始狀態下為Null，所以需要一個 or 運算符來預防TSLint噴出Error
    const styleElement = document.getElementById("theme-styles") as HTMLStyleElement | null;
    if (styleElement) {
        styleElement.textContent = styles;
    } else {
        const newStyleElement = document.createElement("style");
        newStyleElement.id = "theme-styles";
        newStyleElement.textContent = styles;
        document.head.appendChild(newStyleElement);
    }
}