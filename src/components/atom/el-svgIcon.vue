<template>
    <div class="icon" :class="{btn: href !== ''}" @click="jump">
        <svg class="svg">
            <use :xlink:href="`#${name}`" />
        </svg>
    </div>
</template>

<script setup lang="ts">
    import { Router } from 'vue-router';

    // 用於存放元件的 props
    const props = defineProps({
        name: { type: String, required: true, default: 'circle' },
        href: { type: String, default: '' },

    });

    let router: Router | null = null;
    if(props.href !== ''){
        router = useRouter(); // 操作路由
    }

    // 跳轉
    const jump = () => {
        if (props.href !== '' && router) {
            router.push(props.href);
        }
    };
</script>

<style scoped lang="scss">
    .icon {
        position: relative;
        display: flex;
        align-items: center;
        justify-content: center;
        @include setSize(100%, 100%);
        fill: #bbb;
        overflow: hidden;
        transition: 0.2s $cubic-FiSo;
        .svg {
            display: flex;
            align-items: center;
            justify-content: center;
            @include setSize(100%, 100%);
        }

        &.btn {
            cursor: pointer;
            &:hover,
            &.current {
                fill: $colorMain;
            }
            // &.current {
            //     border: 1px solid $colorMain;
            // }
        }
    }
</style>
