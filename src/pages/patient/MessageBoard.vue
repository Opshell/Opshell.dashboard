<script setup lang="ts">
    import { getData } from '@/hooks/useApi';

    export interface iMsg {
        id: number;
        status: boolean;
        createDate: string;
        from: 'out' | 'self';
        msg: string;
    };
    export interface iQuickReply {
        id: number;
        msg: string;
    };

    const route = useRoute();

    const msgList: Ref<iMsg[]> = ref([]);
    const quickReply: Ref<iQuickReply[]> = ref([]);

    getData(`/mapi/patient/message-board?patient_id=${route.params.pid}&page=${route.params.p || 1}`, 'GET').then((res) => {
        msgList.value = res?.data.msgList;
        quickReply.value = res?.data.quickReply;
    });

    const msgBox = ref<HTMLDivElement>();

    const scrollToBottom = () => {
        const container = msgBox.value;

        if (container) {
            container.scrollTop = container.scrollHeight;
        }
    };

    onMounted(() => {
        setTimeout(() => {
            scrollToBottom();
        }, 100);
    });
</script>

<template>
    <section class="messageBlock">
        <div class="msgBox" ref="msgBox">
            <div v-for="item in msgList" :key="'msg_'+item.id"
                class="msg" :class="{ self: item.from == 'self', unread: item.status }">
                <div class="text">{{ item.msg }}</div>
                <div class="time">{{ item.createDate }}</div>
            </div>
        </div>

        <div class="footer">
            <div class="quickMsgBlock">
                <div class="quickMsgBox">
                    <div class="quickMsg" v-for="item in quickReply" :key="'quickMsg_'+item.id">{{ item.msg }}</div>
                </div>
                <ElSvgIcon name="add"></ElSvgIcon>
            </div>
            <div class="sendMsg">
                <ElInput type="text" class="ipunt" placeholder="請輸入訊息..." />
                <ElSvgIcon name="clip" class="clip" @click="scrollToBottom"></ElSvgIcon>

                <ElSvgIcon name="paper-plane" class="send"></ElSvgIcon>
            </div>
        </div>
    </section>
</template>

<style lang="scss" scoped>
    .messageBlock {
        @include setFlex(space-between, stretch, 20px, column);
        background: $colorBack;
        @include setSize(100%, 100%);
        padding: 25px;
        border-radius: 20px;

        .msgBox {
            @include setFlex(flex-start, flex-start, 20px, column);

            @include setSize(100%, 100%);
            max-height: 280px;

            border-radius: 5px;

            // box-shadow: 0 0 15px 1px rgba(0, 0, 0, .15) inset;
            overflow-y: scroll;
            scroll-behavior: smooth; // 滾動平滑

            // 卷軸體
            &::-webkit-scrollbar {
                margin: 0 0 0 30px;
                background: #fff;
                width: 10px;
                border-radius: 5px;
            }
            // 卷軸底
            &::-webkit-scrollbar-thumb {
                margin: 0 0 0 30px;
                background: $colorMain;
                border-radius: 5px;
                border: .5px solid rgba(153, 153, 153, 0.25);
                // box-shadow: 0 0 10px 2px #20476e;
            }
        }

        .footer {
            @include setFlex(flex-start, stretch, 20px, column);
        }
    }

    .msgBox {
        .msg {
            @include setFlex(center, flex-start, 5px, column);
            position: relative;
            background: #E8D6C4;
            padding: 20px 40px 20px 20px;
            border-radius: 20px;
            margin: 0 15px;
            &::before {
                content: '';
                position: absolute;
                top: 15px;
                left: -15px;

                @include setSize();
                padding: 0;
                border: 8px solid;
                border-color: #E8D6C4 #E8D6C4 transparent transparent;
            }
            &.self {
                align-self: flex-end;
                align-items: flex-end;
                background: #c4d7e8;
                padding: 20px 20px 20px 40px;
                &::before {
                    border-color: #c4d7e8 transparent transparent #c4d7e8;
                    left: auto;
                    right: -15px;
                }
            }

            .text {
                color: #444;
                font-size: 20px;
            }
            .time { color: #707070; }
        }

    }

    .footer {
        .sendMsg {
            @include setFlex(space-between, center, 15px);


            .ipunt {
                flex-grow: 1;
                max-width: unset;
                padding: 8px 50px 8px 20px;
            }
            .icon {
                @include setSize(30px, 30px);
                fill: $colorMain;
                &.clip {
                    position: absolute;
                    right: 150px;
                }
                &.send {
                    background: #fff;
                    @include setSize(55px, 55px);
                    padding: 12px;
                    border-radius: 50%;
                }
            }
        }
    }

    .quickMsgBlock {
        @include setFlex(flex-start, center, 25px);

        .quickMsgBox {
            @include setFlex(flex-start, center, 10px);
            .quickMsg {
                background: $colorMain;
                padding: 10px 20px;
                border-radius: 20px;
                color: #fff;
            }

        }
        .icon {
            fill: $colorMain;
            @include setSize(45px, 45px);
        }
    }


</style>
