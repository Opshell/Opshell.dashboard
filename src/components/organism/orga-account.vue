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
        <div class="logoBox">
            <ElImg class="logo" src="/assets/images/Opshell-5x.png" alt="user logo" />
        </div>

        <div class="btnBox">
            <h2 class="text">{{ userState.user.name }}</h2>
            <ElBtn @click="logout" text="登出" title="登出" icon="sign-out" />
            <ElBtn @click="logout" text="選項" title="選項" icon="settings-sliders" />
        </div>
    </article>
</template>

<style lang="scss" scoped>
    .accountBlock {
        display: flex;
        flex-direction: column;
        align-items: center;
        width: 100%;
        padding: 20px 10px 10px;
        border-bottom: 5px solid $colorBack;
        box-sizing: border-box;
        margin: 0 auto;
        box-shadow: 0 0 20px 1px rgba(0, 0, 0, 0.08);

        color: $colorMain;
        .logoBox {
            background: #eee;
            @include setSize(120px, 120px);
            padding: 10px;
            border: 5px solid #f3f3f3;
            border-radius: 50%;
            box-sizing: border-box;
            margin: 10px 10px 25px;
            overflow: hidden;
            .logo {
                width: 100%;
            }
        }
        .btnBox {
            display: flex;
            justify-content: center;
            align-items: center;
            width: 100%;

            .text {
                flex-grow: 1;
                display: flex;
                align-items: center;
                justify-content: flex-start;
                color: #fff;
                text-align: center;
            }
        }
    }
</style>
