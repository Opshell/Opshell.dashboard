<script setup lang="ts">
    import { onMounted, onUnmounted, nextTick } from 'vue';


    onMounted(() => {
        const grid = document.querySelector(".orga-waterfalls-flow-block");
        const allItems = Array.from(document.querySelectorAll(".waterfalls-flow-card")) as HTMLElement[];

        const getRowHeight = () => parseInt(window.getComputedStyle(grid!).getPropertyValue("grid-auto-rows"));
        const getRowGap = () => parseInt(window.getComputedStyle(grid!).getPropertyValue("grid-row-gap"));

        const resizeGridItem = (item: HTMLElement) => {
            if (grid && allItems.length > 0) {
                let rowHeight = getRowHeight();
                let rowGap = getRowGap();

                let rowSpan = Math.ceil((item.querySelector(".wrap")!.getBoundingClientRect().height + rowGap) / (rowHeight + rowGap));
                item.style.gridRowEnd = `span ${rowSpan}`;
            }
        }

        const resizeAllGridItems = () => {
            setTimeout(() => {
                nextTick(() => {
                    allItems.forEach(ele => {
                        resizeGridItem(ele);
                    });
                });
            }, 100);
        }

        const handleResize = () => {
            resizeAllGridItems();
        }

        window.addEventListener("resize", handleResize);

        resizeAllGridItems();

        onUnmounted(() => {
            window.removeEventListener("resize", handleResize);
        });
    });

</script>

<template>
    <article ref="waterfallsDom" class="orga-waterfalls-flow-block">
        <slot></slot>
    </article>
</template>

<style lang="scss">
    .orga-waterfalls-flow-block {
        display: grid;
        grid-gap: 1rem;
        grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
        grid-auto-rows: 1rem;
        padding: 30px 0;
    }
</style>