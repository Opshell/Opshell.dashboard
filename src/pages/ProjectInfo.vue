<script setup lang="ts">
    import { storeToRefs } from 'pinia';
    import piniaStore from '@/store';
    const uiuxStore = piniaStore.useUIUXStore;
    const { uiuxState } = storeToRefs(uiuxStore);

    import { sendRequest } from '@/hooks/useApi';

    import { RouteLocationNormalizedLoaded } from 'vue-router';
    const route = useRoute();
    const router = useRouter();

    export interface iInfo {
        title: string;
        description: string;
        created_at: string;
        updated_at: string;
        [key: string]: any;
    }
    const info: Ref<iInfo> = ref({} as iInfo);

    const getInfo = async (routeSelf: RouteLocationNormalizedLoaded) => {
        const id = ref(routeSelf.params.id as string) || 0;

        const url = (__DOCKING__)?
            `/api/present_pat/info?id=${id.value}`:
            `/mapi/project/info?id=${id.value}`;

        await sendRequest(url)
            .then((res) => {
                nextTick(() => {
                    info.value = res?.data || {
                        id: 0,
                        title: '',
                        description: '',
                        created_at: '',
                        updated_at: '',
                    };

                    if (info.value.id) {
                        route.matched[route.matched.length - 1].meta.title = info.value.title;

                        uiuxStore.setBreadcrumbs(route.matched);
                    }
                });
            }).catch((error) => {
                console.error(error);
            });
            uiuxStore.endLoading();
    }

    // [-]取得資料與各種跳轉
    getInfo(route); // [#]第一次進入頁面要先getInfo
    // [#]動態路由更新時[頁碼變更]
    onBeforeRouteUpdate ((to) => {
        nextTick(() => {
            getInfo(to);
        });
    });
    // [#] 離開組件時觸發
    onBeforeRouteLeave(() => {
        jumpRouter();
    });


    // [-]路由跳轉結束後 設定title
    router.afterEach((to) => {});

    const jumpRouter = () => {
        uiuxStore.startLoading();
        info.value = {} as iInfo; // 先清空
    }

    const searchKeywords = () => {
        jumpRouter();

        router.push({
            name: route.name as string,
            params: {
                page: 1,
            },
            query: {}
        });
    }


</script>

<template>
    <OrgaContentBlock class="project-info-block">
        <template #title>
            <ElInputBox field-name="標題">
                <ElInput v-model="info.title" placeholder="請輸入標題" />
            </ElInputBox>
        </template>
        <template #header>
            <div class="features-block"></div>
        </template>

        <div class="info-block">
            <ElEditor v-model="info.description"/>
        </div>

        <template #footer-features>
            <div class="btn-box">
                <ElBtn @click="router.go(-1)">回到列表</ElBtn>
            </div>
        </template>
    </OrgaContentBlock>
</template>

<style lang="scss">
    .project-info-block {
        .feature-block {
            @include setFlex(space-between, stretch, .625rem);
            gap: .625rem;
            width: 100%;
            margin: 1.875rem 0 1.25rem;

            .feature-box {
                @include setFlex( flex-start, stretch, .625rem);
            }

            .el-btn,
            .divider,
            .el-select,
            .el-input { height: 40px; }

            .el-input { max-width: 230px; }
            .el-btn { padding: 8px 15px; }

            .list-composition-box {
                @include setFlex( flex-end, stretch, .625rem);
            }
        }

        .info-block {
            padding-top: 2.5rem;
        }
    }
</style>


