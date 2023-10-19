<script setup lang="ts">
    import { iOutPatientItem } from '@/components/molecule/mole-outPatientListBar.vue';
    import { getData } from '@/hooks/useApi';

    const route = useRoute();
    const router = useRouter();

    const outPatientList = ref<iOutPatientItem[]>([]); // 資料

    // 頁碼資訊
    const currentPage = ref<number>(3);
    const lastPage = ref<number>(10);

    const page = route.params?.page || 1;

    const url = `/mapi/patient/outpatient-list?page=${page}`;
    getData(url)
    .then((res) => {
        // 檢查一下currentPage有沒有相等
        // if(res?.data.current_page == page){
            outPatientList.value = res?.data;

            lastPage.value = res?.paginator?.last_page || 10;
        // } else {
        //     router.push({path: `/patient/list/${res?.data.current_page}`});
        // }
    });

    const listHeader: iOutPatientItem = {
        id: 0,
        createDate: '建立日期',
        place: '洗腎部位',
        BP_1: 'BP',
        BP_2: 'BP_2',
        HR: 'HR',
        PI: 'PI',
        RI: 'RI',
        TAMEAN: 'TAMEAN',
        flow: '流量',
        diameter: '管徑',
        next: '下次預約',
    }

    const addOutPatient = () => {
        const addtemp = {
            id: 0,
            createDate: '',
            place: '',
            BP_1: '',
            BP_2: '',
            HR: '',
            PI: '',
            RI: '',
            TAMEAN: '',
            flow: '',
            diameter: '',
            next: '',
        }

        outPatientList.value.unshift(addtemp);
    }
</script>

<template>
    <div class="outPatientBlock">
        <ElBtn class="addBtn" @click="addOutPatient">
            <template #icon>
                <ElSvgIcon #icon name="plus-small"></ElSvgIcon>
            </template>
            新增門診紀錄
        </ElBtn>

        <div class="outPatientTable">
            <MoleOutPatientListBar :outpatient="listHeader" :header="true"></MoleOutPatientListBar>

            <router-view v-slot="{ Component, route }" :out-patient-list="outPatientList">
                <component :is="Component" :key="route.path"></component>
            </router-view>
        </div>

        <OrgaPagination class="paginationBlock" :current-page="currentPage" :last-page="lastPage" />
    </div>
</template>

<style lang="scss" scoped>
    .outPatientBlock {
        @include setFlex(flex-start, flex-start, 15px, column);

        .addBtn {
            @include setFlex(flex-start);
            // gap: 10px;
            justify-content: flex-start;
            background: $colorSubs;
            border-color: $colorSubs;
            padding: 15px 15px 15px 8px;
            color: $colorUnFont;
            .icon {
                @include setSize(25px, 25px);
                fill: $colorUnFont;

            }
        }

        .outPatientTable {
            @include setFlex(flex-start, center, 15px, column);
            width: 100%;
        }

        .paginationBlock {
            @include setFlex();
            width: 100%;
        }
    }
</style>
