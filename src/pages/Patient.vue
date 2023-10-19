
<script setup lang="ts">
    import {storeToRefs} from 'pinia';
    import piniaStore from '@/store';

    import { getData } from '@/hooks/useApi';

    const patientStore = piniaStore.usePatientStore;
    const { patientState } = storeToRefs(patientStore);

    const route = useRoute();

    getData(`/mapi/patient/info?patient_id=${route.params.pid}`)
    .then((res) => {
        if (res?.status) {
            patientState.value.info = res.data.info;
            patientState.value.tube = res.data.tube;
            patientState.value.questionnaire = res.data.questionnaire;
        }
    });

    const patientInfo = computed(() => {
        const info = [
            {
                title: '姓名',
                value: patientState.value.info.name
            },
            {
                title: '身分證字號',
                value: patientState.value.info.uid
            },
            {
                title: '年齡',
                value: patientState.value.info.age
            },
            {
                title: '洗腎部位',
                value: patientState.value.info.place
            },
            {
                title: '下次回診日期',
                value: patientState.value.info.next
            },
            {
                title: '主治醫師',
                value: patientState.value.info.next
            },
        ]

        return info;
    });

    const patientTube = computed(() => {
        return patientState.value.tube;
    });

    const patientQuestionnaire = computed(() => {
        return patientState.value.questionnaire;
    });
</script>

<template>
    <div class="patientBlock">
        <header class="patientHeader">
            <div class="infoBar">
                <ElInputBox v-for="(item, i) in patientInfo" :field-name="item.title" :key="'patientInfo_' + i" >
                    <ElInput :value="item.value" disabled />
                </ElInputBox>
            </div>
            <div class="dataBar">
                <ElInputBox field-name="建置紀錄" >
                    <ElInput :value="patientTube" disabled />
                </ElInputBox>
                <ElInputBox field-name="問卷結果" >
                    <ElInput :value="patientQuestionnaire" disabled />
                </ElInputBox>
            </div>
        </header>

        <router-view v-slot="{ Component, route }">
            <transition name="fadeY" mode="out-in">
                <component :is="Component" :key="'patient-' + route.path"></component>
            </transition>
        </router-view>
    </div>
</template>

<style lang="scss" scoped>

    .patientBlock {
        @include setFlex(flex-start, stretch, 40px, column);
        @include setSize(100%, 100%);
    }
    .patientHeader {
        @include setFlex(flex-start, stretch, 25px, column);
        margin: 15px 0 0;

        .infoBar {
            @include setFlex(space-between, center, 10px);
        }

        .dataBar {
            @include setFlex(space-between, center, 10px);

        }

        .inputBox {
            width: 100%;
            .input {
                max-width: unset;
            }
        }
    }
</style>
