<script setup lang="ts">
    import { storeToRefs } from 'pinia';
    import piniaStore from '@/store';
    import useGlobalProperties from '@/hooks/useGlobalProperties';

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
</script>

<template>
    <article class="accountBlock">
        <div class="btnBox">
            <ElSvgIcon @click="logout" title="選項" name="settings-sliders"></ElSvgIcon>
        </div>

        <div class="logoBox">
            <ElImg class="logo" src="/assets/images/Opshell-5x.png" alt="user logo" />
        </div>

        <h2 class="title">Welcome back {{ userState.user.name }}.</h2>
        <div class="subtitle">You can control the Opshell website through this interface.</div>
    </article>
</template>

<style lang="scss">
    .accountBlock {
        position: relative;
        @include setFlex(flex-start, center, 5px, column);
        width: 100%;
        padding: 20px;
        margin: 0 auto;
        color: $colorMain;

        &::after {
            content: '';
            position: absolute;
            bottom: 0;
            left: 20px;
            background: $colorMain;
            @include setSize(calc(100% - 40px), 3px);
            border-radius: 1.5px;
            z-index: 1;
        }

        .btnBox {
            position: absolute;
            @include setFlex(flex-start);
            width: 100%;
            padding: 0 20px;

            .icon {
                @include setSize(32px, 32px);
                cursor: pointer;
                &:hover {
                    fill: $colorMain;
                }
            }
        }

        .logoBox {
            background: #eee;
            @include setSize(120px, 120px);
            padding: 10px;
            border: 3px solid $colorSubs;
            border-radius: 50%;
            margin: 15px;
            overflow: hidden;

            // perspective: 1000px;

            animation: circleY 1.8s $cubic-FiSo 0.1s;
            .logo {
                width: 100%;
            }
        }

        .title {
            color: #111;
            font-size: 22px;
        }
        .subtitle {
            color: $colorFont;
            font-size: 18px;
            text-align: center;
        }
    }
</style>
