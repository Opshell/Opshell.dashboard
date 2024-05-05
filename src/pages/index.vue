<script setup lang="ts">
    import dayjs from 'dayjs';

    import { storeToRefs } from 'pinia';
    import piniaStore from '@/store';

    const userStore = piniaStore.useUserStore;
    const { userState } = storeToRefs(userStore);

    // [M] 登入登出動畫
    let trans = ref({
        isLogin: false,
        account: false,
        sideMenu: false,
        weatherDate: false,
        header: false,
        content: false,
        footer: false,
    });

    const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
    const delayTime = 200;

    const transKeys = ['isLogin', 'account', 'sideMenu', 'weatherDate', 'header', 'content', 'footer'];
    type TransKeys = keyof typeof trans.value;
    watchEffect(() => {
        if (userState.value.isLogin) {
            for (const i in transKeys) {
                const nextTime = Number(i) > 0 ? delayTime * Number(i) : 0;

                setTimeout(() => {
                    trans.value[transKeys[i] as TransKeys] = true;
                }, nextTime);
                // delay(delayTime);
            }
        } else {
            for (const key of transKeys.reverse()) {
                trans.value[key as TransKeys] = false;
                delay(delayTime);
            }
        }
    });

    // [M] 主題換色
    const uiuxStore = piniaStore.useUIUXStore;
    const { uiuxState } = storeToRefs(uiuxStore);
    import { useTheme } from '@/hooks/useTheme';
    const adminBlockDom = ref<HTMLElement | null>(null);
    const theme = toRef(uiuxState.value, 'theme');
    const switchTheme = () => useTheme(adminBlockDom, theme);
    watch(theme, () => {
        switchTheme();
    });


    // [M] 計時器
    const dateTime = ref(dayjs().format('YYYY/MM/DD ddd - A hh:mm:ss'));

    // clearInterval(timer);
    // const timer = () => {
    //     setInterval(() => {
    //         nextTick(() => {
    //             dateTime.value = dayjs().format('YYYY/MM/DD ddd - A.hh:mm:ss');
    //         });
    //     }, 1000);
    // };
    const timer = () => {
        setTimeout(() => {
            dateTime.value = dayjs().format('YYYY/MM/DD ddd - A hh:mm:ss');
            timer();
        }, 1000);
    };
    timer();

    // 深度監看 router
    // watch(route, (newVal) => {
    //     console.log('Route：', newVal);
    // }, { deep: true });

    // [M] 過濾ajax-bar
    const filterUrl = () => {
        // 用正則判斷
        // 取得圖片、登入、token驗證 不觸發
        const reg = /\/api\/image\/d+/;

        return (url: string) => {
            return !reg.test(url);
        };
    };
</script>

<template>
    <div ref="adminBlockDom"
        class="admin-block"
        :class="{ isLogin: trans.isLogin }"
    >
        <q-ajax-bar
            :hijack-filter="filterUrl()"
            size="3px"
        />

        <div class="features-block">
            <transition name="fadeY" mode="out-in">
                <OrgaSystem v-if="trans.account"></OrgaSystem>
                <OrgaLogin v-else></OrgaLogin>
            </transition>

            <transition name="fadeY" mode="out-in">
                <OrgaSideMenu v-if="trans.sideMenu"></OrgaSideMenu>
            </transition>

            <transition name="fadeY" mode="out-in">
                <div v-if="trans.weatherDate" class="weather-date-block">
                    <div class="weather-date-box">
                        <ElSvgIcon name="sunny"/>
                        <span class="date">{{ dateTime }}</span>
                    </div>
                </div>
            </transition>
        </div>

        <!-- <transition name="fadeY" mode="out-in"> -->
            <section v-if="trans.header" class="view-block"> <!-- v-if="states.user.isLogin"-->
                <!-- <transition name="zoom" mode="out-in">
                    <div class="loadingMask" v-show="elStatusState.isLoading"></div>
                </transition> -->

                <transition  name="fadeY" mode="out-in">
                    <OrgaHeader v-if="trans.header"></OrgaHeader>
                </transition>

                <transition name="fadeY" mode="out-in">
                    <div v-if="trans.content" class="content-block">
                        <router-view v-slot="{ Component }">
                            <transition name="fadeY" mode="out-in">
                                <component :is="Component"></component>
                            </transition>
                        </router-view>
                    </div>
                </transition>
            </section>
        <!-- </transition> -->
    </div>
</template>

<style lang="scss">
    .admin-block {
        display: flex;
        align-items: center;
        @include setSize(100%, 100vh);

        &.isLogin {
            .features-block {
                width: 25%;
                max-width: 350px;
            }
            .view-block {
                @include setSize(100%, 100%);
                padding: 0;
            }
        }

        > .features-block {
            flex-shrink: 0;
            @include setFlex(center, center, 0, column);
            background:  var(--color-view-block);
            @include setSize(100%, 100%);
            max-width: 100%;
            transition: 0.2s $cubic-FiSo;
            .weather-date-block {
                padding: 15px 20px;
                width: 100%;
                .weather-date-box {
                    @include setFlex(space-between);
                    gap: 10px;
                    padding: 5px 10px;
                    border-radius: 5px;
                    border: 1px solid var(--color-border-box);
                    font-size: 14px;
                    font-weight: 600;
                }
            }
        }

        > .view-block {
            @include setFlex(space-between, stretch, 0, column);
            background: var(--color-view-block);
            @include setSize();
            padding: 20px 15px 20px 0;
            transition: 0.3s $cubic-FiSo 0.08s,
                        background-color .2s $cubic-FiSo;
            overflow: hidden;
            .content-block {
                flex: 1;
                position: relative;
                background: var(--color-border-box);
                @include setSize(100%, calc(100% - 95px));
                border-radius: 20px 0 0 0;
                .loadingMask {
                    position: absolute;
                    top: 0;
                    left: 0;
                    background: var(--color-text-light);
                    @include setSize(100%, 100%);
                    z-index: 1;
                }
            }
        }
    }
</style>
