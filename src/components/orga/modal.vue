<script setup lang="ts">
    const props = withDefaults(defineProps<{
        open?: boolean;
        title?: string;
        class?: string;
    }>(), {
        open: false,
        title: '',
        class: '',
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
            <div v-show="open" class="modalBlock" :class="class" @click.self="close">
                <section class="modalBox">
                    <MoleModalHeader>
                        <template #close>
                            <ElSvgIcon name="close" class="close"  @click="close"></ElSvgIcon>
                        </template>

                        <template #icon>
                            <slot v-if="$slots.icon" name="icon"></slot>
                        </template>

                        <span class="text"> {{ title }} </span>

                        <template #tabs>
                            <slot v-if="$slots.tabs" name="tabs"></slot>
                        </template>
                    </MoleModalHeader>

                    <div class="content">
                        <slot></slot>
                    </div>
                </section>
            </div>
        </transition>
    </Teleport>
</template>

<style lang="scss">
    .modalBlock {
        position: fixed;
        top: 0;
        left: 0;
        @include setFlex();
        @include setSize(100%, 100%);
        background: rgba(0, 0, 0, .5);
        z-index: 100;
        .modalBox {
            @include setFlex(space-between, stretch, 0, column);

            @include setSize(100%, 100%);
            max-width: calc(100% - 80px);
            max-height: calc(100% - 80px);
            .content {
                flex: 1;
                border-radius: 25px;
                background: #fff;
                @include setSize(100%, calc(100% - 55px));
                // padding: 30px 50px 45px;
                padding: 35px 40px 40px;
                border-radius: 30px 50px 50px;

                // overflow-y: auto;

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

        &.vascular {
            .modalBox {
                max-width: 1380px;
                max-height: 85vh;
            }
        }
    }
</style>