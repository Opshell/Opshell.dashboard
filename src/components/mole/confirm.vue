<script setup lang="ts">
    import { useDialogPluginComponent } from 'quasar';

    export interface iConfirmProps {
        title: string;          // 標題
        message: string;        // 內容
        duration?: number;       // 顯示時間
        showCancelBtn?: boolean; // 是否顯示取消按鈕
        cancelText?: string;     // 取消按鈕文本
        confirmText?: string;    // 確定按鈕文本
        infoText?: string;       // 詳情文字
        infoLink?: string;       // 詳情連結
    };
    const props = withDefaults(defineProps<iConfirmProps>(), {
        title: "Notice",
        message: "未知錯誤",
        duration: 0,
        showCancelBtn: true,
        cancelText: "取消",
        confirmText: "確定",
        infoText: "",
        infoLink: "",
    });

    defineEmits([
        // REQUIRED; need to specify some events that your
        // component will emit through useDialogPluginComponent()
        ...useDialogPluginComponent.emits
    ]);
    const { dialogRef, onDialogHide, onDialogOK, onDialogCancel } = useDialogPluginComponent();

    const onOKClick = () => {
        onDialogOK();
    }
    const onCancelClick = () => {
        onDialogCancel();
    }

    const progress = ref(25); // Add this line
    onMounted(() => {
        if (props.duration !== 0) {
            const intervalId = setInterval(() => {
                if (progress.value > 0) {
                    progress.value -= 1;
                } else {
                    clearInterval(intervalId);
                    if (dialogRef.value) {
                        dialogRef.value.hide();
                    }
                }
            }, props.duration / 25);
        }
    });
</script>

<template>
    <q-dialog class="mole-confirm" ref="dialogRef"
        @hide="onDialogHide"
    >
        <section class="confirm-wrap">
            <header class="header">
                <span>Confirm</span>

                <q-circular-progress
                    v-if="props.duration !== 0"
                    class="progress"
                    show-value
                    :value="progress"
                    :max="25"
                    size="25px"
                    font-size="12px"
                    :thickness="0.2"
                    :rounded="true"
                > {{ progress }} </q-circular-progress>
            </header>

            <div class="content" >
                <ElImg src="/assets/images/notice_default_img.png" />

                <div class="text-block">
                    <h6 class="title" v-html="title"></h6>
                    <p class="error-list" v-html="message"></p>
                </div>
            </div>

            <footer class="footer">
                <a  v-if="infoLink && infoText"
                    class="info-link"
                    :href="infoLink"
                    target="_blank"
                    rel="noopener nogreferrer">
                    <ElSvgIcon name="help" />
                    {{ infoText }}
                </a>
                <span v-else></span>

                <div class="btn-box">
                    <ElBtn
                        v-if="showCancelBtn"
                        @click="() => { onCancelClick(); }"
                    >{{ cancelText }}</ElBtn>
                    <ElBtn
                        class="hight"
                        @click="() => { onOKClick(); }"
                    >{{ confirmText }}</ElBtn>
                </div>
            </footer>
        </section>
    </q-dialog>
</template>

<style lang="scss">
    .mole-confirm {
        .confirm-wrap {
            @include setFlex(space-between, stretch, 0, column);
            position: relative;
            background: rgba(255, 255, 255, .6);
            @include setSize(auto, auto);
            max-width: 540px;

            border: 1px solid var(--color-extreme-reverse);
            border-radius: 10px;
            box-shadow: 0px 10px 20px 0px rgba(0, 0, 0, .4);
            backdrop-filter: blur(10px);

            transition: .3s $cubic-FiSo;
            overflow: hidden;
            // animation: horizontally-shake .3s $cubic-FiSo;
        }

        .q-dialog{
            &__inner { // 解決按鈕不能按問題，預設會出現 .no-pointer-events
                pointer-events: auto !important;
            }
        }
    }

    .confirm-wrap {
        .header {
            position: relative;
            @include setFlex(space-between, center, 10px);
            background: var(--color-extreme-reverse);
            height: 45px;
            padding: 10px 15px;
            color: var(--color-extreme);
            font-size: 16px;

            .q-circular-progress {
                &__svg { color: var(--color-primary-light); }
                &__text {
                    color: var(--color-primary-light);
                    transform: translate3d(1px, 0, 0);
                }
            }
        }

        .content {
            flex: 1;
            @include setFlex(flex-start, flex-start, 25px);
            background: var(--color-extreme-reverse);
            min-height: 135px;
            padding: 15px 20px;
            color: #333;
            font-size: 1rem;
            line-height: 1.6em;
            white-space: pre-line; // 遇到換行符號會換行
            .el-img {
                margin: 10px 0 0;
            }

            .text-block {
                @include setFlex(flex-start, flex-start, 5px, column);
                .title {
                    font-size: 1rem;
                    font-weight: 600;
                    -webkit-text-stroke: 0;
                }
                .error-list {
                    @include setFlex(flex-start, flex-start, 0, column);
                    margin: 0;
                }
            }

        }

        .footer {
            @include setFlex(space-between, center, 10px);
            padding: 15px;
            .info-link {
                @include setFlex();
                color: var(--color-primary);
                font-size: 14px;
                text-decoration: underline var(--color-primary);
                .icon {
                    fill: var(--color-primary);
                    @include setSize(25px, 25px);
                }

                &:hover {
                    color: var(--color-primary-light);
                    .icon { fill: var(--color-primary-light); }
                }
            }
            .btn-box {
                @include setFlex(flex-end, center, 10px);
            }
        }
    }
</style>