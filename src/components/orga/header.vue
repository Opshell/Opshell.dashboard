<script setup lang="ts">
    import { storeToRefs } from 'pinia';
    import piniaStore from '@/store';

    import { RouteRecordName, RouteMeta } from 'vue-router';

    const userStore = piniaStore.useUserStore;
    const { userState } = storeToRefs(userStore);

    const uiuxStore = piniaStore.useUIUXStore;
    const { uiuxState } = storeToRefs(uiuxStore);

    const switchTheme = () => {
        if (uiuxState.value.theme == 'dark') {
            uiuxStore.switchTheme('light');
        } else {
            uiuxStore.switchTheme('dark');
        }
    }
    const themeIcon = computed(() => {
        return uiuxState.value.theme == 'dark' ? 'dark_mode' : 'light_mode';
    });

    const router = useRouter();

    export interface iBreadcrumb {
        name: RouteRecordName | undefined;
        path: string;
        meta: RouteMeta;
    }

    import { useQuasar } from 'quasar';
    import confirmComponent from '@/components/mole/confirm.vue';
    const $q = useQuasar();
    const logout = () => {
        $q.dialog({
            component: confirmComponent,

            componentProps: {
                title: '登出確認',
                message: "您確定要登出洗腎護照嗎？",
            },
        }).onOk(() => {
            userStore.signOut();

            router.push('');
        });
    };
</script>

<template>
    <header class="header-block">
        <div class="history-block">
            <ElSvgIcon  name="chevron_left" class="cube" @click="router.go(-1);"/>
            <ElSvgIcon  name="chevron_right" class="cube" @click="router.go(1);"/>
            <ElSvgIcon  name="refresh" class="cube" @click="router.go(0);"/>
            <ElInput type="text"
                class="close"
                placeholder="Search"
            >
                <template v-slot:icon>
                    <ElSvgIcon name="search" />
                </template>
            </ElInput>
        </div>

        <div class="divider"></div>

        <div class="breadcrumbs-block">
            <div class="breadcrumbs-box">
                <template v-for="(item, i) in uiuxState.breadcrumbs" :key="item.path">
                    <router-link
                        v-if="item.name"
                        :to="item.path"
                        class="breadcrumb"
                    >
                        <ElSvgIcon v-if="i" name="chevron_right" />
                        <ElSvgIcon v-else name="home" class="home"/>
                        {{ item.meta.title }}
                    </router-link>
                </template>
            </div>
            <ElSvgIcon name="select_window" class="cube"/>
        </div>

        <div class="divider"></div>

        <div class="user-block">
            <div class="user-box">
                <div class="logo-box">
                <ElImg class="logo" src="/assets/images/user_logo.png" alt="user logo" />
                </div>

                <div class="text-box">
                    <h2 class="title">{{ userState.user.name }}</h2>
                    <div class="subtitle">ID: {{ userState.user.uid }}</div>
                </div>
            </div>

            <div class="feature-box">
                <ElSvgIcon name="mail" class="cube" />
                <ElSvgIcon name="settings" class="cube" />
                <ElSvgIcon :name="themeIcon" class="cube" @click="switchTheme"/>
                <ElSvgIcon name="logout" class="cube" @click="logout"/>
            </div>
        </div>
    </header>
</template>

<style lang="scss">
    .header-block {
        // #b4bdce
        @include setFlex(space-between);
        @extend %scope;
        width: 100%;
        padding: 25px 40px 25px 0;

        .history-block {
            @include setFlex(space-between, center, 10px);
            .icon {
                flex-shrink: 0;
                border: 1px solid var(--color-border-box);
            }
            .el-input {
                max-width: 230px;
                transition: .3s $cubic-FiSo;
            }
        }
        .breadcrumbs-block {
            flex: 1;
            @include setFlex(space-between, center, 15px);
            .breadcrumbs-box {
                @include setFlex();
                height: 45px;
                padding: 8px 25px 8px 20px;
                border: 1px solid var(--color-border-box);
                border-radius: 25px;
            }
            .input {
                height: 45px;
                border-radius: 25px;
            }
            .breadcrumb {
                @include setFlex();
                transition: .2s $cubic-FiSo;
                &:hover {
                    color: var(--color-primary-light);
                    .icon.home { fill: var(--color-primary-light); }
                }
            }
        }
        .user-block {
            @include setFlex(space-between, center, 15px, row);
            animation: circleY 1.8s $cubic-FiSo 0.1s;
            .user-box {
                @include setFlex();
                gap: 10px;
                background: var(--color-border-box);
                padding: 0 20px 0 0;
                border-radius: 5px;
            }

            .logo-box {
                @include setSize(45px, 45px);
                padding: 0;
                border-radius: 5px;
                overflow: hidden;
            }

            .text-box {
                flex-grow: 1;
                @include setFlex(center, flex-start, 5px, column);
                .title {
                    color: var(--color-primary-light);
                    font-size: 1rem;
                    line-height: 1;
                }
                .subtitle {
                    color: var(--color-text);
                    font-size: 0.8rem;
                    line-height: 1;
                }
            }
            .feature-box { @include setFlex(center, center, 10px); }
        }

        .divider {
            background: var(--color-border-box);
            @include setSize(1px, 100%);
            margin: 0 15px;
        }
    }
</style>
