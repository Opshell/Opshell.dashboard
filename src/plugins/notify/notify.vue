<script setup lang="ts">
    export interface iNotifyProps {
        type?: 'success' | 'warning' | 'error' | 'info'; // 狀態;
        title?: string;         // 標題
        message?: string;       // 內容
        duration?: number;      // 顯示時間
        showCancelBtn?: boolean;// 是否顯示取消按鈕
        confirmText?: string;   // 確定按鈕文本
    };

    const props = withDefaults(defineProps<iNotifyProps>(), {
        type: "error",
        title: "警告",
        message: "未知錯誤",
        duration: 0,
        showCancelBtn: false,
        confirmText: "確定",
    });

    const styleData = ref( {
        transitionDuration: `${props.duration / 1000}s`,
        width: '100%'
    } );

    onMounted(() => {
        setTimeout(() => {
            styleData.value.width = '0';
        }, 1);
    });
</script>

<template>
    <section class="OrgaNotify">
        <div class="notifyWrap" :class="type">
            <div class="duration" :style="styleData"></div>

            <header class="header">
                <ElSvgIcon name="comment-info" />
                <div v-html="title"></div>
            </header>
            <div class="content" v-html="message"></div>
            <div class="btnBox">
                <div v-if="showCancelBtn" class="Btn cancelBtn" role="button" >
                    <span class="text">取消</span>
                </div>
                <div class="Btn confirmBtn" role="button" >
                    <span class="text" v-html="confirmText"></span>
                </div>
            </div>
        </div>
    </section>
</template>

<style lang="scss">
    .OrgaNotify {
        @include setFlex();

        position: fixed;
        top: 0;
        left: 0;

        background: rgba($color: #000000, $alpha: .3);
        @include setSize(100%, 100%);
        padding: 20px;

        z-index: 100;
        .notifyWrap {
            @include setFlex(space-between, stretch, 0, column);
            position: relative;
            background: $colorBack;
            @include setSize(100%, auto);
            max-width: 350px;
            // max-height: 250px;
            border-radius: 10px;
            box-shadow: 0 0 5px 1px rgba($color: #000000, $alpha: .15);
            transition: .3s $cubic-FiSo;
            overflow: hidden;

            animation: horizontally-shake .3s $cubic-FiSo;
        }
    }

    .notifyWrap {
        .duration {
            position: absolute;
            top: 0;
            left: 0;
            background: #666;
            @include setSize(100%, 3px);
            border-radius: 1px;

            transition-timing-function: liner;
            opacity: .85;
            z-index: 1;
        }
        .header {
            position: relative;
            @include setFlex(flex-start, center, 10px);
            height: 45px;
            padding: 13px 18px 10px;
            color: #eee;
            font-size: 20px;
            .icon {
                @include setSize(28px, 28px);
                fill: #eee;
            }
            .close {
                position: absolute;
                @include setSize(25px, 25px);
            }
        }
        .content {
            flex: 1;
            min-height: 130px;
            padding: 15px 20px;
            color: #333;
            font-size: 16px;
            line-height: 1em;
            white-space: pre-line; // 遇到換行符號會換行
        }
        .btnBox {
            @include setFlex(flex-end, center, 10px);
            padding: 10px;
            .Btn {
                height: 20px;
                border-radius: 8px;
            }
        }

        &.warning {
            .header {
                background: $colorWarning;
                color: #333;
                .icon {
                    fill: #333;
                }
            }
            .btnBox .Btn {
                background: $colorWarning;
                border-color: $colorWarning;
                color: #333;
            }
        }
        &.error {
            .header {
                background: $colorError;
            }
            .btnBox .Btn {
                background: $colorError;
                border-color: $colorError;
                color: #eee;
            }
        }
        &.info {
            .header {
                background: $colorInfo;
            }
            .btnBox .Btn {
                background: $colorInfo;
                border-color: $colorInfo;
                color: #eee;
            }
        }
        &.success {
            .header {
                background: $colorSuccess;
            }
            .btnBox .Btn {
                background: $colorSuccess;
                border-color: $colorSuccess;
                color: #eee;
            }
        }
    }
</style>