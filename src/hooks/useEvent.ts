export function useEventListener(target: Element, event: string, callback: any) {
    // 可以用字串形式的 CSS 選擇器來尋找目標Dom
    onMounted(() => target.addEventListener(event, callback))
    onUnmounted(() => target.removeEventListener(event, callback))
}