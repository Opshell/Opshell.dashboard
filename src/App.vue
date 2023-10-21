<script setup lang="ts">
    import { storeToRefs } from 'pinia';
    import piniaStore from '@/store';

    const userStore = piniaStore.useUserStore;
    // const elStatusStore = piniaStore.useElStatusStore;
    const { userState } = storeToRefs(userStore);
    // const { elStatusState } = storeToRefs(elStatusStore);

    import useGlobalProperties from '@/hooks/useGlobalProperties';
    const proxy = useGlobalProperties();


    // const route = useRoute();
    const router = useRouter();

    const logout = () => {
        proxy.$notify('warning', '提醒！', '您確定要登出洗腎護照嗎?', 0, true).then(() => {
            userStore.signOut();

            router.push('/login');
        }).catch(() => {
            console.log('取消登出');
        })
    };


    // 依序執行Transition
    let trans = ref({
        isLogin: false,
        account: false,
        sideMenu: false,
        logout: false,
    });

    watchEffect(() => {
        // 間隔
        const delay = 150;
        if (userState.value.isLogin) {

            trans.value.isLogin = true;
            setTimeout(() => {
                trans.value.account = true;
                setTimeout(() => {
                    trans.value.sideMenu = true;
                    setTimeout(() => {
                        trans.value.logout = true;
                    }, delay);
                }, delay);
            }, delay);

        } else {

            trans.value.logout = false;
            setTimeout(() => {
                trans.value.sideMenu = false;
                setTimeout(() => {
                    trans.value.account = false;
                    setTimeout(() => {
                        trans.value.isLogin = false;
                    }, delay);
                }, delay);
            }, delay);

        }
    });

    // 深度監看 router
    // watch(route, (newVal) => {
    //     console.log('Route：', newVal);
    // }, { deep: true });
</script>

<template>
    <div class="app" :class="{ isLogin: trans.isLogin }">
        <div class="featuresBlock">
            <transition name="fadeYres" mode="out-in">
                <OrgaAccount v-if="trans.account"></OrgaAccount>
                <Login v-else></Login>
            </transition>

            <transition name="fadeYres" mode="out-in">
                <OrgaSideMenu v-if="trans.sideMenu"></OrgaSideMenu>
            </transition>

            <transition name="fadeYres" mode="out-in">
                <div v-if="trans.logout" class="logoutBtn" @click="logout" >
                    <ElSvgIcon name="sign-out-alt" />
                    <span class="text">登出管理後台</span>
                </div>
            </transition>
        </div>

        <section v-if="trans.logout" class="viewBlock"> <!-- v-if="states.user.isLogin"-->
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

        &.isLogin {
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
        @include setFlex(center, center, 20px, column);
        background: $colorBlock;
        @include setSize(100%, 100%);
        max-width: 100%;

        transition: 0.2s $cubic-FiSo;

        .logoutBtn {
            position: relative;
            @include setFlex(flex-start, center, 10px);
            @include setSize(100%, auto);
            padding: 15px 22px 30px;
            color: $colorFont;
            transition: 0.2s $cubic-FiSo;
            cursor: pointer;

            &::before {
                content: '';
                position: absolute;
                top: 0;
                left: 20px;
                background: $colorMain;
                @include setSize(calc(100% - 40px), 3px);
            }

            .icon {
                flex-shrink: 0;
                @include setSize(22px, 22px);
                fill: $colorFont;
            }
            .text {
                flex: 1;
                font-size: 20px;
                text-align: left;
            }

            &:hover {
                color: $colorSubs;
                .icon {
                    fill: $colorSubs;
                }
            }
        }
    }

    .viewBlock {
        @include setFlex(space-between, stretch, 0, column);
        @include setSize();
        transition: 0.3s $cubic-FiSo 0.08s;
        overflow: hidden;
        .contentBlock {
            flex: 1;
            position: relative;
            background: $colorBack;
            // box-shadow: $bascShadow;
            @extend %scope;

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
