<script setup lang="ts">
    import { storeToRefs } from 'pinia';
    import piniaStore from '@/store';

    const userStore = piniaStore.useUserStore;
    // const elStatusStore = piniaStore.useElStatusStore;
    const { userState } = storeToRefs(userStore);
    // const { elStatusState } = storeToRefs(elStatusStore);



    onMounted(() => {

    });

    // const route = useRoute();
    // const router = useRouter();

    // 深度監看 router
    // watch(route, (newVal) => {
    //     console.log('Route：', newVal);
    // }, { deep: true });
</script>

<template>
    <div class="app" :class="{ isLogin: userState.isLogin }">
        <div class="featuresBlock">
            <!-- <transition name="blackHole" mode="out-in"> -->
            <OrgaAccount v-if="userState.isLogin"></OrgaAccount>
            <Login v-else></Login>
            <!-- </transition> -->

            <transition name="blackHole" mode="out-in">
                <OrgaSideMenu v-if="userState.isLogin"></OrgaSideMenu>
            </transition>
        </div>

        <section v-if="userState.isLogin" class="contentBlock"> <!-- v-if="states.user.isLogin"-->
            <!-- <transition name="zoom" mode="out-in">
                <div class="loadingMask" v-show="elStatusState.isLoading"></div>
            </transition> -->

            <OrgaHeader></OrgaHeader>

            <div class="contentBlock">
                <router-view v-slot="{ Component }">
                    <transition name="zoom" mode="out-in">
                        <component :is="Component"></component>
                    </transition>
                </router-view>
            </div>

            <OrgaFooter></OrgaFooter>
        </section>
    </div>
</template>

<style lang="scss">
    //  載入基礎樣式
    // vue 漸變樣式
    @import '@/assets/scss/vueTransition.scss';

    // 基礎元件與行為
    @import '@/assets/scss/base.scss';

    .app {
        display: flex;
        align-items: center;
        @include setSize(100%, 100vh);

        &.login {
            .featuresBlock {
                width: 25%;
                max-width: 350px;
            }
            .viewBlock {
                @include setSize(100%, 100%);
            }
        }
    }

    .featuresBlock {
        flex-shrink: 0;
        @include setFlex(center, center, 0, column);
        background: $colorViewBack;
        @include setSize(100%, 100%);

        transition: 0.15s $cubic-FiSo;
    }

    .viewBlock {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        @include setSize();
        box-sizing: border-box;

        transition: 0.3s $cubic-FiSo 0.08s;
        overflow: hidden;

        .contentBlock {
            flex: 1;
            position: relative;
            background: #1b1b1b;
            padding: 20px;
            // box-shadow: $bascShadow;
            overflow: hidden;
            overflow-y: auto;

            .loadingMask {
                position: absolute;
                top: 0;
                left: 0;
                background: #1e2b2e;
                @include setSize(100%, 100%);
                z-index: 1;
            }

            /* 卷軸設定 */
            &::-webkit-scrollbar {
                background: #999;
                width: 8px;
                border-radius: 2px;
            }
            &::-webkit-scrollbar-thumb {
                background: $colorMain;
                border-radius: 5px;
                border: 0.5px solid rgba(153, 153, 153, 0.5);
                box-shadow: 0 0 10px 2px #20476e;
            }
        }
    }
</style>
