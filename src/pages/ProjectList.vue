<script setup lang="ts">
    import { storeToRefs } from 'pinia';
    import piniaStore from '@/store';
    const uiuxStore = piniaStore.useUIUXStore;
    const { uiuxState } = storeToRefs(uiuxStore);

    import { sendRequest } from '@/hooks/useApi';
    import { iListBar } from '@/components/mole/listBar.vue';

    import { RouteLocationNormalizedLoaded } from 'vue-router';
    const route = useRoute();
    const router = useRouter();

    // 關鍵字
    const keywords = ref(route.query.keywords as string || '');
    const list = ref<iListBar[]>([]); // 資料


    // [-]分頁器資訊
    const lastPage = ref<number>(10);
    const getList = async (route: RouteLocationNormalizedLoaded) => {
        // 請求的頁面 (放裡面才會每次都改) // 放外面會卡死
        const currentPage = route.params?.page || 1;

        const url = (__DOCKING__)?
            `/api/present_pat/list?page=${currentPage}&keywords=${keywords.value}`:
            `/mapi/project/list?page=${currentPage}&keywords=${keywords.value}`;

        await sendRequest(url)
            .then((res) => {
                nextTick(() => {
                    list.value = res?.data.map((item) => {
                        item.check = false;

                        return item;
                    }) || [];

                    lastPage.value = res?.paginator?.last_page || 10;
                });
            }).catch((error) => {
                console.error(error);
            });
            uiuxStore.endLoading();
    }

    // [-]取得資料與各種跳轉
    getList(route); // [#]第一次進入頁面要先getList (了解一下原理)
    // [#]動態路由更新時[頁碼變更]
    onBeforeRouteUpdate ((to) => {
        nextTick(() => {
            if (to.query.keywords && keywords.value !== to.query.keywords) {
                keywords.value = to.query.keywords as string;
            }
            getList(to);
        });
    });
    // [#] 離開組件時觸發
    onBeforeRouteLeave(() => {
        jumpRouter();
    });

    // 路由刷新時 重新getList
    router.afterEach(() => {});
    const jumpRouter = () => {
        uiuxStore.startLoading();
        list.value = []; // 先清空
    }

    const searchKeywords = () => {
        jumpRouter();
        router.push({
            name: route.name as string,
            params: {
                page: 1,
            },
            query: {
                keyword: keywords.value,
            }
        });
    }

    const isSelectAll = ref(false);
    const viewType: Ref< 'list' | 'grid' > = ref('list')
    const listCount = ref(10);
    const listCountOptions = [
        {
            title: '5筆',
            value: 5
        },{
            title: '10筆',
            value: 10
        },{
            title: '15筆',
            value: 15
        },{
            title: '20筆',
            value: 20
        }
    ];

    let observer: IntersectionObserver | null = null;
    onMounted(() => {
        // get the sticky element
        const stickyEl = document.querySelector('.mole-list-bar.thead');
        const box = document.querySelector('.main-block .content-block');

        observer = new IntersectionObserver(
            ([e]) => { e.target.classList.toggle('stuck', e.intersectionRatio < 1) },
            {
                root: box,
                threshold: [1]
            }
        );

        if(stickyEl){
            observer.observe(stickyEl)
        }
    });
    onUnmounted(() => {
        const stickyEl = document.querySelector('.mole-list-bar.thead')

        if(stickyEl && observer){
            observer.unobserve(stickyEl)
        }
    });
</script>

<template>
    <OrgaContentBlock class="project-list-block">
        <template #features>
            <div class="tabs-block"></div>
        </template>

        <div class="feature-block">
            <div class="feature-box">
                <ElBtn>
                    <template #icon>
                        <ElSvgIcon class="edit" name="add_notes" />
                    </template>
                    新增
                </ElBtn>

                <ElDivider />

                <ElBtn>
                    <template #icon>
                        <ElSvgIcon class="edit" name="delete" />
                    </template>
                    刪除
                </ElBtn>

                <ElDivider />

                <ElBtn>
                    <template #icon>
                        <ElSvgIcon class="edit" name="filter_alt" />
                    </template>
                    篩選
                </ElBtn>

                <ElDivider />

                <ElInput type="text"
                    placeholder="search"
                    v-model="keywords"
                >
                    <template #icon>
                        <ElSvgIcon name="search" />
                    </template>
                </ElInput>
            </div>

            <div class="list-composition-box">
                <ElBtn>
                    <template #icon>
                        <ElSvgIcon class="edit" :name="viewType== 'list'? 'menu' : 'grid_view'" />
                    </template>
                </ElBtn>

                <ElSelect  :options="listCountOptions" v-model="listCount" />
            </div>
        </div>

        <div class="mole-list-bar thead">
            <div class="td check"><ElCheckbox v-model="isSelectAll"/></div>
            <div class="td image">封面</div>
            <div class="td title">標題</div>
            <div class="td tag">標籤</div>
            <div class="td category">分類</div>
            <div class="td sort">排序</div>
            <div class="td date">最後修改日期</div>
            <div class="td disable">狀態</div>
            <div class="td features">操作</div>
        </div>
        <!-- <transition name="fade" mode="out-in">
            <div class="loading" v-show="elStatusState.isLoading">
                <ElSvgIcon name="cycle" />
            </div>
        </transition> -->
        <router-view v-slot="{ Component, route }" :list >
            <component :is="Component" :key="route.path"></component>
        </router-view>

        <template #footer-features>
            <OrgaPagination class="paginationBlock" :last-page="lastPage" @jump-router="jumpRouter"/>
        </template>
    </OrgaContentBlock>
</template>

<style lang="scss">
    .project-list-block {
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
    }

</style>


