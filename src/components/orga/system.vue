<script setup lang="ts">
    import { storeToRefs } from 'pinia';
    import piniaStore from '@/store';

    import { useGlobalProperties } from '@/hooks/utilityFunctions';
    const proxy = useGlobalProperties();

    const userStore = piniaStore.useUserStore;
    const { userState } = storeToRefs(userStore);

    const route = useRoute();
    const router = useRouter();

    const logout = () => {
        proxy.$notify('warning', '提醒！', '您確定要登出洗腎護照嗎?', 0, true).then(() => {
            userStore.signOut();

            router.push('/login');
        }).catch(() => {
            console.log('取消登出');
        })
    };

    const systemMsg = ref({
        sms: 6,
        history: 0,
    });
</script>

<template>
    <div class="system-block">
        <div class="logo-block">
            <div class="logo-box">
                <ElImg class="logo" src="/assets/images/system_logo.jpg" alt="system logo" />
            </div>

            <div class="text-box">
                <h2 class="title">Opshell's Stuido</h2>
                <div class="subtitle">system version 1.0.0</div>
            </div>

            <ElSvgIcon title="選項" name="settings-sliders"></ElSvgIcon>
        </div>

        <div class="system-link-block">
            <router-link
                class="link"
                to="/system/sms"
            >
                <ElSvgIcon name="sms" />
                <span class="text">系統訊息</span>
                <span v-if="systemMsg.sms > 0" class="msg-count">{{ systemMsg.sms }}</span>
            </router-link>
            <router-link
                class="link"
                to="/system/history"
            >
                <ElSvgIcon name="deployed_code_history" />
                <span class="text">系統更新紀錄</span>
                <span v-if="systemMsg.history > 0" class="msg-count">{{ systemMsg.history }}</span>
            </router-link>
        </div>
    </div>
</template>

<style lang="scss">
    .system-block {
        position: relative;
        @include setFlex(flex-start, center, 25px, column);
        width: 100%;
        padding: 1.25rem 0;
        margin: 0 0 1.25rem;
        color: var(--color-primary);

        .logo-block {
            @include setFlex(space-between, center, 15px, row);
            width: 100%;
            padding: 0 1.25rem;

            animation: circleY 1.8s $cubic-FiSo 0.1s;
            .logo-box {
                background: var(--color-border-box);
                @include setSize(70px, 70px);
                padding: 0;
                border-radius: 5px;
                overflow: hidden;
            }

            .text-box {
                flex-grow: 1;
                @include setFlex(center, flex-start, 8px, column);
                .title {
                    color: var(--color-primary);
                    font-size: 1.25rem;
                    line-height: 1;
                }
                .subtitle {
                    color: var(--color-border-box);
                    font-size: 1rem;
                    line-height: 1;
                }
            }

            .icon {
                fill: var(--color-text);
            }
        }

        .system-link-block {
            width: 100%;
            .msg-count {
                background: var(--color-primary);
                height: 22px;
                padding: 0 12px;
                border-radius: 11px;
                color: var(--color-view-block);
            }
        }

        &::after {
            content: '';
            position: absolute;
            bottom: 0;
            left: 20px;
            background: var(--color-primary);
            @include setSize(calc(100% - 40px), 3px);
            border-radius: 1.5px;
            z-index: 1;
        }
    }
</style>
