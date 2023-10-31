<script setup lang="ts">
    import { getData } from '@/hooks/useApi';

    interface iOption<T> {
        value: number;
        title: T;
    }
    const defOptions = ref({
        hospitalList: [] as iOption<string>[],
        weeks: [] as iOption<string>[],
        disease: [] as iOption<string>[],
        doctor: [] as iOption<string>[],
    });

    export interface iPatientData {
        id: number;
        name: string;
        birthday: Date | '';
        gender: number;
        idNumber: string;
        tel: string[];
        account: string;
        password: string;
        hospital: number;
        weeks: number[];
        shift: number;
        disease: number[];
        doctor: number;
    }

    const props = defineProps<{
        patientData: iPatientData;
    }>();
    const emit = defineEmits(['update:patientData', 'savePatientData']);
    const tempData = useVModel(props, 'patientData', emit);

    // [-] Select 點外面關閉
    import { onClickOutside, useVModel } from '@vueuse/core';
    interface SelectBox extends Ref{
        closeSelect: () => void;
        open: boolean;
    }
    const selectBox: Ref<SelectBox[]> = ref([]);
    onMounted(() => {
        // select 外部點擊事件
        selectBox.value.map((ele)=> {
            onClickOutside(ele, async () => {
                if(ele.open){
                    await nextTick();

                    ele.closeSelect();
                }
            });
        });
    });


    // [-]取得各種預設狀態
    const genderList = [
        {
            title: '男',
            value: 1,
        }, {
            title: '女',
            value: 2,
        }
    ];
    const shiftList = [
        {
            title: '早',
            value: 1,
        }, {
            title: '中',
            value: 2,
        }, {
            title: '晚',
            value: 3,
        },
    ];
    getData(`/mapi/patient/ae-options`).then(async (res) => {
        defOptions.value = res?.data;
    });


    // tel 事件
    const addTel = () => {
        tempData.value.tel.push('');
    };
    const updateTel = (index: number, value: string) => {
        tempData.value.tel[index] = value;
    };
    const delTel = (index: number) => {
        if (tempData.value.tel.length > 1){
            tempData.value.tel.splice(index, 1);
        }
    };
    const saveData = () => {

    };

    const submitText = computed(() => {
        return tempData.value.id == 0 ? '新增' : '修改';
    });

    const savePatientData = () => {
        emit('savePatientData', tempData.value);
    };
</script>

<template>
    <section class="addPatientBlock">
        <div class="fromBlock">
            <ElInputBox field-name="姓名">
                <ElInput v-model="tempData.name"></ElInput>
            </ElInputBox>
            <ElInputBox field-name="生日">
                <MoleDatePicker v-model="tempData.birthday"></MoleDatePicker>
            </ElInputBox>
            <ElInputBox field-name="性別" class="radio">
                <ElRadio v-for="(item) in genderList" name="gender"
                    :value="item.value" v-model="tempData.gender"
                    :key="'gender_'+item.value"
                >{{ item.title }}</ElRadio>
            </ElInputBox>
            <ElInputBox field-name="身分證字號">
                <ElInput v-model="tempData.idNumber"></ElInput>
            </ElInputBox>

            <label class="inputBox tel">
                <span class="text">聯絡電話</span>
                <ElSvgIcon class="add" name="add_circle" @click="addTel"></ElSvgIcon>

                <div class="inputGroup">
                    <div v-for="(item, i) in tempData.tel" :key="'tel_'+i" class="telBox">
                        <ElInput :value="item" @input="updateTel(i, $event.target.value)"></ElInput>
                        <ElSvgIcon class="del" name="delete_forever" @click="delTel(i)"></ElSvgIcon>
                    </div>
                </div>
            </label>

            <template v-if="tempData.id == 0">
                <ElInputBox field-name="帳號">
                    <ElInput v-model="tempData.account"></ElInput>
                </ElInputBox>
                <ElInputBox field-name="密碼">
                    <ElInput v-model="tempData.password"></ElInput>
                </ElInputBox>
            </template>
        </div>
        <div class="fromBlock small">
            <ElInputBox field-name="洗腎室">
                <ElSelect :ref="(el: SelectBox) => selectBox.push(el)" :options="defOptions.hospitalList" v-model="tempData.hospital"></ElSelect>
            </ElInputBox>
            <ElInputBox field-name="時間">
                <ElSelect :ref="(el: SelectBox) => selectBox.push(el)" :options="defOptions.weeks" :multiple="true" v-model="tempData.weeks"></ElSelect>
            </ElInputBox>

            <ElInputBox field-name="班別" class="radio">
                <ElRadio v-for="(item) in shiftList" name="shift"
                    :value="item.value" v-model="tempData.shift"
                >{{ item.title }}</ElRadio>
            </ElInputBox>

            <ElInputBox field-name="病史">
                <ElSelect :ref="(el: SelectBox) => selectBox.push(el)" :options="defOptions.disease" :multiple="true" v-model="tempData.disease"></ElSelect>
            </ElInputBox>
            <ElInputBox field-name="主治醫師">
                <ElSelect :ref="(el: SelectBox) => selectBox.push(el)" :options="defOptions.doctor" v-model="tempData.doctor"></ElSelect>
            </ElInputBox>

            <div class="BtnBox">
                <ElBtn class="current" @click="savePatientData">{{ submitText }}</ElBtn>
            </div>
        </div>
    </section>
</template>

<style lang="scss" scope>
    .addPatientBlock {
        @include setFlex(center, stretch, 44px);
        display: flex;
        justify-content: space-between;
        .fromBlock {
            @include setFlex(flex-start, stretch, 20px, column);
            width: 100%;
            .inputBox {
                > .text{
                    align-self: flex-start;
                    @include setFlex(flex-start);
                    @include setSize(120px, 55px);
                }
                > .input,
                > .select,
                > .vueDatePicker {
                    width: 210px;
                }

                .inputGroup {
                    position: relative;
                    @include setFlex(flex-start, center, 10px, column);
                    width: 210px;
                    .telBox {
                        position: relative;
                    }
                }
                &.tel .icon {
                    position: absolute;
                    &.add {
                        top: 13px;
                        left: 100px;
                        fill: $colorMain;
                        @include setSize(28px, 28px);
                    }
                    &.del {
                        top: 13px;
                        right: -35px;
                        fill: $colorError;
                        @include setSize(32px, 32px);
                    }
                }
            }

            &.small {
                .inputBox > .text{
                    width: 100px;
                }
            }

            .BtnBox {
                flex: 1;
                @include setFlex(flex-end, flex-end);
                .Btn { margin: 0 3px 2px 0; }
            }
        }
    }

    .modalBlock.addPatient {
        .modalBox {
            @include setSize(auto, auto); // 800 710
            max-width: 900px;
            max-height:  800px;
            padding: 0 40px 40px;
            .content {
                border-radius: 0;
            }
        }
    }
</style>