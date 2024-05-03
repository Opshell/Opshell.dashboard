<script setup lang="ts">
    import { useDialogPluginComponent } from 'quasar';

    export interface iNotifyProps {
        type?: 'success' | 'warning' | 'error' | 'info'; // 狀態;
        title?: string;          // 標題
        message?: string;        // 內容
        duration?: number;       // 顯示時間
    };
    const props = withDefaults(defineProps<iNotifyProps>(), {
        type: "error",
        title: "Notify",
        message: "未知錯誤",
        duration: 0,
    });

    const iconName = computed(() => {
        switch (props.type) {
            case 'success':
                return 'check_circle';
            case 'warning':
                return 'warning';
            case 'info':
                return 'info';
            default:
                return 'cance';
        }
    });

    defineEmits([
        // REQUIRED; need to specify some events that your
        // component will emit through useDialogPluginComponent()
        ...useDialogPluginComponent.emits
    ]);
    const { dialogRef, onDialogHide, onDialogCancel } = useDialogPluginComponent();

    const onCancelClick = () => {
        onDialogCancel();
    }

    const progress = ref(10); // Add this line
    onMounted(() => {
        if (props.duration !== 0) {
            const intervalId = setInterval(() => {
                if (progress.value > 0) {
                    progress.value -= 1;
                } else {
                    clearInterval(intervalId);
                    nextTick(() => {
                        if (dialogRef.value) {
                            dialogRef.value.hide();
                        }
                    });
                }
            }, props.duration / 10);
        }
    });
</script>

<template>
    <q-dialog class="mole-notify" ref="dialogRef"
        transition-show="slide-up"
        @keyup.enter="onCancelClick"
        @hide="onDialogHide"
    >
        <section class="notify-wrap" :class="type">
            <div class="text-block">
                <header class="header">
                    <ElSvgIcon :name="iconName" />
                    <h6 class="title" v-html="title"></h6>
                </header>

                <p class="content" v-html="message"></p>
            </div>

            <q-circular-progress
                v-if="props.duration !== 0"
                class="progress"
                show-value
                :max="10"
                :value="progress"
                size="25px"
                font-size="12px"
                :thickness="0.2"
                :rounded="true"
            >
                <ElSvgIcon class="close-btn" name="close" @click="onCancelClick()"/>
            </q-circular-progress>
            <ElSvgIcon v-else class="close-btn" name="close" @click="onCancelClick()"/>
        </section>
    </q-dialog>
</template>

<style lang="scss">
    .mole-notify {
        .notify-wrap {
            position: relative;
            @include setFlex(space-between);
            gap: 10px;
            background: linear-gradient(0deg, rgba(255, 255, 255, 0.7) 0%, rgba(255, 212, 202, 0.7) 100%);
            @include setSize(100%, auto);
            max-width: 480px;

            padding: 15px;
            border-radius: 10px;
            box-shadow: 0px 10px 20px 0px rgba(0, 0, 0, .1);
            backdrop-filter: blur(8px);

            transition: .3s $cubic-FiSo;
            overflow: hidden;
            animation: fade-in .3s $cubic-FiSo .15s both;
            // animation: horizontally-shake .3s $cubic-FiSo;
        }

        .q-dialog{
            &__inner { // 解決按鈕不能按問題，預設會出現 .no-pointer-events
                pointer-events: auto !important;
            }
            &__backdrop {
                background: rgba(0, 0, 0, 0.2);

            }
        }
    }

    .notify-wrap {
        .text-block {
            @include setFlex(flex-start, stretch, 10px, column);
        }
        .header {
            position: relative;
            @include setFlex(flex-start, center, 3px);
            color: var(--color-extreme);
            font-size: 16px;

            .icon {
                fill: var(--color-error);
                @include setSize(30px, 30px);
            }
            .title {
                color: var(--color-error);
                font-size: 1rem;
                font-weight: 700;
                -webkit-text-stroke: 0;
                transform: translateY(1px);
            }
        }
        .content {
            flex: 1;
            padding: 0 0 0 32px;
            margin: 0;
            color: var(--color-extreme);
            font-size: 1rem;
            line-height: 1.6em;
            white-space: pre-line; // 遇到換行符號會換行
        }
        .close-btn {
            fill: var(--color-extreme);
            cursor: pointer;
        }



        &.warning {
            background: linear-gradient(360deg, rgba(255, 255, 255, 0.7) 0%, rgba(255, 243, 218, 0.7) 100%);
            .header {
                .icon { fill: var(--color-warning); }
                .title { color: var(--color-warning); }
            }
        }
        &.info {
            background: linear-gradient(0deg, rgba(255, 255, 255, 0.7) 0%, rgba(217, 237, 255, 0.7) 100%);
            .header {
                .icon { fill: var(--color-info); }
                .title { color: var(--color-info); }
            }
        }
        &.success {
            background: linear-gradient(0deg, rgba(255, 255, 255, 0.7) 0%, rgba(209, 255, 216, 0.7) 100%);
            .header {
                .icon { fill: var(--color-success); }
                .title { color: var(--color-success); }
            }
        }
    }
</style>