<script setup lang="ts">
    import { useDraggable, useElementBounding } from '@vueuse/core';

    interface iPosition {
        x: number;
        y: number;
    }

    const props = defineProps<{
        x: number;
        y: number;
        dragWidth: number;
        dragHeight: number;
        container?: HTMLElement | null;
    }>();

    const emit = defineEmits<{
        'update:position': [position: iPosition];
    }>();

    const drag = ref<HTMLElement | null>(null);

    // 預設值
    const {
        top: boundsTop,
        left: boundsLeft,
        right: boundsRight,
        bottom: boundsBottom,
    } = useElementBounding(props.container);

    const defPosition: iPosition = {
        x: props.x,
        y: props.y
    };

    // Draggable 化
    const { style } = useDraggable(drag, {
        // containerElement: props.container,
        initialValue: {
            x: defPosition.x,
            y: defPosition.y
        },
        onMove(position: iPosition) {
            if (position.x < boundsLeft.value) {
                position.x = boundsLeft.value;
            } else if (position.x + props.dragWidth > boundsRight.value) {
                position.x = boundsRight.value - props.dragWidth;
            }

            if (position.y < boundsTop.value) {
                position.y = boundsTop.value;
            } else if (position.y + props.dragHeight > boundsBottom.value) {
                position.y = boundsBottom.value - props.dragHeight;
            }
        },
        onEnd: (position: iPosition) => {
            emit('update:position', { x: position.x, y: position.y });
        },
    });

    props.container?.style.setProperty('background', '#333');
</script>

<template>
    <div ref="drag" class="drag" :style="style">
        <slot></slot>
    </div>
</template>

<style lang="scss">
    .drag {
        position: fixed;
        cursor: grab;
        &:active {
            cursor: grabbing;
        }
    }
</style>