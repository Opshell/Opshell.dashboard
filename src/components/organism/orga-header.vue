<script setup lang="ts">
    import { storeToRefs } from 'pinia';
    import piniaStore from '@/store';
    import useGlobalProperties from '@/hooks/useGlobalProperties';

    const proxy = useGlobalProperties();

    const userStore = piniaStore.useUserStore;
    const { userState } = storeToRefs(userStore);

    const route = useRoute();
    const router = useRouter();

    const loguot = () => {
        proxy.$notify('warning', '提醒！', '您確定要登出洗腎護照嗎?', 0, true).then(() => {
            userStore.signOut();

            router.push('/login');
        }).catch(() => {
            console.log('取消登出');
        })
    };

    // 深度監看 router
    // watch(route, (newVal) => {
    //     console.log('Route：', newVal);
    // }, { deep: true });
</script>

<template>
    <header class="headerBlock">
        <div class="logoBox">
            <ElImg class="tzuchi" src="/assets/images/TzuChi_logo.png" alt="慈濟醫院" />
            <span class="x">X</span>
            <ElImg class="ncku" src="/assets/images/ncku_logo.png" alt="國立成功大學" />
            <ElImg class="ai4dt" src="/assets/images/ai4dt_logo.png" alt="創新數位內容研究中心" />
        </div>
        <div class="iconBox">
            <div class="iconGroup" :class="{ current: route.matched[0].path =='/develop' }">
                <ElSvgIcon href="/develop" name="settings"/>
                <div class="iconChild">
                    <ElSvgIcon href="ui-ux-set" name="comment" :class="{ current: route.matched[1]?.name =='UIUXSet' }"/>
                    <ElSvgIcon href="icon-list" name="comment-heart" :class="{ current: route.matched[1]?.name =='IconList' }"/>
                </div>
            </div>

            <ElSvgIcon href="/index" name="home" :class="{ current: route.matched[0].path == '/index' }"/>

            <ElSvgIcon class="btn" v-if="userState.isLogin" name="sign-out" @click="loguot"/>
        </div>
    </header>
</template>

<style lang="scss">
    .headerBlock {
        @include setFlex(space-between);
        @extend %scope;
        width: 100%;
        padding: 30px 0;

        .logoBox {
            @include setFlex(flex-start, center);
            .x {
                margin: 0 20px;
                font-size: 30px;
                color: $colorFont;
            }

            @include setRWD(1024px) {
                .x {
                    margin: 0 5px 0 10px;
                    font-size: 20px;
                }
                .img { object-fit: none; }
                .tzuchi {
                    @include setSize(70px, 40px);
                    object-position: -2px center;
                }
                .ncku {
                    @include setSize(45px, 45px);
                    object-position: -1px center;
                }
                .ai4dt {
                    @include setSize(50px, 50px);
                    object-position: -13px center;
                }
            };
        }

        .iconBox {
            display: flex;
            gap: 15px;
        }
        .icon {
            background: #fff;
            @include setSize(50px, 50px);
            padding: 10px;
            border-radius: 50%;
            fill: $colorSubs;
        }

        @include setRWD(1024px) {
            padding-top: 20px;
            padding-bottom: 20px;
        };

        @include setRWD(600px) {
            padding-top: 20px;
            padding-bottom: 20px;
        };
    }

    .iconGroup {
        @include setFlex(center, center, 0, row-reverse);
        background: $colorFont;
        border-radius: 25px;

        &.current {
            .iconChild {
                max-width: 120px;
                padding: 0 3px 0 8px;
                .icon {
                    opacity: 1;
                }
            }
        }
        .iconChild {
            @include setFlex();
            max-width: 0;
            padding: 0;
            overflow: hidden;
            transition: max-width .15s $cubic-FiSo;
            box-shadow: $shadow-in;
            .icon {
                flex-shrink: 0;
                background: $colorFont;
                fill: #eee;
                opacity: 0;
            }
        }
    }
</style>