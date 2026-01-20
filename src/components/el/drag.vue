<script setup lang="ts">
    import { useDraggable, useElementBounding } from '@vueuse/core';

    interface iPosition {
        x: number;
        y: number;
    }

    const props = defineProps<{
        x: number;
        y: number;
        order: number;
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
</script>

<template>
    <div ref="drag" class="drag" :style="style">
        <span class="order"> {{ order }}</span>
        <span class="text">
            <slot></slot>
        </span>
    </div>
</template>

<style lang="scss">
    .drag {
        position: fixed;
        cursor: grab;
        .order {
            @include setFlex();
            position: absolute;
            top: -10px;
            left: -10px;
            background: #e78183;
            @include setSize(30px, 30px);
            border-radius: 50%;
            border: 1px solid #ccc;
            font-size: 18px;
            color: #fff;
            user-select: none;
        }
        .text {
            position: absolute;
            top: calc(100% + 15px);
            left: 50%;
            background: var(--color-extreme-reverse);
            @include setSize(auto, auto);
            padding: 10px 20px;
            border-radius: 20px;
            box-shadow: 0 0 5px 1px rgba(0, 0, 0, .15);
            white-space: nowrap;
            opacity: 0;
            transition: .2s $cubic-FiSo;
            transform: translateX(-50%);
            user-select: none;
        }
        &:active {
            cursor: grabbing;
        }
        &:hover {
            .text {
                opacity: 1;
            }
        }
    }
</style>