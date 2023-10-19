<script setup lang="ts">
    import { useDraggable } from '@vueuse/core'

    const props = withDefaults(defineProps<{
        open?: boolean;
        title?: string;
    }>(), {
        open: false,
        title: '',
    });

    const emit = defineEmits<{
        (e: 'close'): void;
    }>();

    const close = () => {
        emit('close');
    };
</script>

<template>
    <Teleport to="body">
        <transition name="fade" mode="out-in">
            <div v-show="open" class="modalBlock" @click.self="close">

                    <section class="modalBox">
                        <header class="header">
                            <span class="title">{{ title }}</span>
                            <ElSvgIcon name="cross-small" class="btn" @click="close"></ElSvgIcon>
                        </header>
                        <div class="content">
                            <slot></slot>
                        </div>
                        <footer class="footer">
                            <ElBtn>上傳圖片</ElBtn>
                            <ElBtn>儲 存</ElBtn>
                        </footer>
                    </section>
            </div>
        </transition>
    </Teleport>
</template>

<style lang="scss">
    .modalBlock {
        @include setFlex();
        position: fixed;
        top: 0;
        left: 0;
        @include setSize(100%, 100%);
        background: rgba(0, 0, 0, .5);
        z-index: 999;
        .modalBox {
            @include setFlex(space-between, stretch, 30px, column);
            background: #fff;
            @include setSize(calc(100% - 40px), calc(100% - 40px));
            max-width: 1360px;
            max-height: 900px;
            padding: 0 50px 45px;
            border-radius: 50px;

            overflow-x: hidden;
            overflow-y: auto;

            .header {
                position: relative;
                @include setFlex(space-between, flex-start);
                padding-left: 0;

                .title {
                    background: $colorMain;
                    padding: 15px 50px;

                    border-radius: 0 0 50px 0;
                    color: #fff;

                    transform: translateX(-50px);
                }
                .icon {
                    position: absolute;
                    top: 20px;
                    right: -8px;
                    fill: #707070;
                    @include setSize(35px, 35px);
                    z-index: 1;
                }
            }

            .content {
                flex: 1;
                // background: #e3e3e3;
                border-radius: 25px;
                // padding: 25px;

                 // 卷軸體
                &::-webkit-scrollbar {
                    background: #fff;
                    width: 7px;
                    border-radius: 3.5px;
                }
                // 卷軸底
                &::-webkit-scrollbar-thumb {
                    background: $colorMain;
                    border-radius: 7px;
                    border: 0.5px solid rgba(153, 153, 153, 0.25);
                    // box-shadow: 0 0 10px 2px #20476e;
    }
                overflow-y: auto;
            }

            .footer {
                @include setFlex(flex-end, center, 15px);

                .Btn {
                    background: $colorMain;
                    padding: 20px;
                    color: #FCFCFC;
                }
            }
        }
    }
</style>