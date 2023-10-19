<script setup lang="ts">
    // [-] Pinia
    import { storeToRefs } from 'pinia';
    import piniaStore from '@/store';
    const elStatusStore = piniaStore.useElStatusStore;
    const { elStatusState } = storeToRefs(elStatusStore);

    import { getData } from '@/hooks/useApi';
    import { iPatientItem } from '@/components/molecule/mole-patientListBar.vue';

    const route = useRoute();
    const router = useRouter();

    const keywords = ref('');
    const patientList = ref<iPatientItem[]>([]); // 資料

    // [-]分頁器資訊
    const LastPage = ref<number>(10);
    const currentPage = route.params?.page || 1;

    const getList = () => {
        // const url = `/api/present_pat/list?page=${route.params?.page}`;
        const url = `/mapi/patient/list?page=${currentPage}&keywords=${keywords.value}`;
        return new Promise((resolve, reject) => {
            getData(url) // 本機測試環境
            .then((res) => {
                // 檢查一下currentPage有沒有相等 [#] 檢查等有真資料再補
                // if(res?.data.current_page == currentPage){
                    elStatusStore.endLoading();

                    setTimeout(() => {
                        patientList.value = res?.data || [];

                        LastPage.value = res?.paginator?.last_page || 10;
                    }, 200);
                    resolve(res);
                // } else {
                    // router.push({path: `/patient-list/${res?.data.current_page}`});
                // }
            }).catch((error) => {
                console.error(error);
                elStatusStore.endLoading();
                reject(error);
            });
        });
    }

    // [-]取得資料與各種跳轉
    getList();
    router.beforeEach(() => {
        getList();
    });

    // 路由刷新時 重新getList
    router.afterEach(() => {});
    const jumpRouter = () => {
        console.log('jumpRouter');
        elStatusStore.startLoading();
        patientList.value = []; // 先清空
    }

    // [-] 顯示資料
    // 列表標題
    const listHeader: iPatientItem = {
        id: 0,
        name: '姓名',
        identification: '身分證字號',
        appStatus: false,
        age: '年齡',
        note: '洗腎部位',
        appointment: '下次就診',
        doctor: '醫師',
        disease: '病史',
        unread: '留言板',
    }
</script>

<template>
    <section class="patientList">
        <header class="featureBlock">
            <label class="searchLainput">
                <ElInput class="searchInput" v-model="keywords" name="keywords" />

                <div class="placeholder">
                    請輸入ID
                    <span class="red">(不分大小寫)</span>
                </div>
                <ElSvgIcon name="zoom-in" />
            </label>

            <ElBtn class="search" @click="getList">查 詢</ElBtn>
            <ElBtn class="push" @click="">公告推播</ElBtn>
        </header>

        <ElBtn class="addBtn" @click="">
            <template #icon>
                <ElSvgIcon name="plus-small" />
            </template>
            新增病患
        </ElBtn>

        <div class="patientTable">
            <MolePatientListBar class="thead" :patient="listHeader"></MolePatientListBar>

            <transition name="zoom" mode="out-in">
                <div class="loading" v-show="elStatusState.isLoading">
                    <ElSvgIcon name="refresh" />
                </div>
            </transition>

            <router-view v-slot="{ Component, route }" :patientList="patientList">
                <component :is="Component" :key="route.path"></component>
            </router-view>
        </div>

        <OrgaPagination class="paginationBlock" :last-page="LastPage" @jump-router="jumpRouter"/>
    </section>
</template>

<style lang="scss" scoped>
    .patientList {
        @include setFlex(space-between, flex-start, 15px, column);
        @include setSize(100%, auto);
        min-height: 100%;
        padding-top: 35px;
        .featureBlock {
            @include setFlex(flex-start, center, 10px);
            @include setSize(100%, 55px);
            margin: 0 0 5px;
        }

        .addBtn {
            @include setFlex(flex-start);
            // gap: 10px;
            justify-content: flex-start;
            background: $colorMain;
            border-color: $colorMain;
            padding: 15px 15px 15px 8px;
            color: $colorUnFont;
            .icon {
                @include setSize(25px, 25px);
                fill: $colorUnFont;

            }
        }

        .patientTable {
            flex: 1;
            @include setFlex(flex-start, center, 15px, column);
            @include setSize(100%, auto);
        }

        .paginationBlock {
            @include setFlex();
            width: 100%;
        }

        .loading {
            @include setFlex(center, center);
            @include setSize(100%, 300px);
            position: relative;
            background: #fff;
            z-index: 10;
            .icon {
                fill: $colorMain;
                @include setSize(100px, 100px);
                animation: 0.75s circle linear infinite;
            }
        }
    }

    .featureBlock {
        .searchLainput {
            @include setFlex(flex-start);
            position: relative;
            @include setSize(100%, 55px);
            max-width: 375px;
            min-width: 280px;

            font-size: 18px;
            backdrop-filter: blur(5px);
            transition: .05s $cubic-FiSo;
            overflow: hidden;

            .placeholder {
                position: absolute;
                left: 20px;
                color: #9e9e9e;
            }
            .icon {
                position: absolute;
                @include setSize(25px, 25px);
                right: 20px;
                fill: $colorMain;
            }
        }

        .Btn {
            &.search {
                background: $colorSubs;
                border-color: $colorSubs;
                color: $colorUnFont;
            }
            &.push {
                background: $colorInfo;
                border-color: $colorInfo;
                color: $colorUnFont;
            }
        }
    }
</style>