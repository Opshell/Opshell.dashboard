<script setup lang="ts">
    import useGlobalProperties from '@/hooks/useGlobalProperties';
    const proxy = useGlobalProperties();

    // import { proxy } from '@/hooks/opshellLibary';

    export interface iOutPatientItem {
        id: number,
        createDate: string; // 建立日期
        place: string; // 洗腎部位
        BP_1: string;
        BP_2: string;
        HR: string;
        PI: string;
        RI: string;
        TAMEAN: string;
        flow: string;
        diameter: string;
        next: string;
        swelling?: number;
        pressure?: number;
        collapse?: number;
        position?: number;
        operation?: number;
        result?: number;
        msg?: string;
    }
    const foldStatus = ref(false);

    const props = defineProps<{
        outpatient: iOutPatientItem;
        header: boolean;
        i?: number;
    }>();

    const openStatus = ref(false);
    const editStatus = ref(false);

    // 如果是新增 直接開啟編輯模式
    if (props.outpatient.id === 0) {
        editStatus.value = true;
    }
    const emit = defineEmits<{
        'delete': [];
        'update:modelValue': [value: string];
    }>()

    // 之後做成 API
    interface iQuestionnaire {
        title: 'swelling' | 'pressure' | 'collapse' | 'position' | 'operation' | 'result';
        question: string;
        answer: {
            [key: number]: string;
        }
    }
    const questionnaire: iQuestionnaire[] = [
        {
            'title': 'swelling',
            'question': '請問您目前是否有手臂腫脹之情況？',
            'answer': {
                1: '僅有左手',
                2: '僅有右手',
                3: '兩手都有',
                4: '兩手都沒有',
            }
        },
        {
            'title': 'pressure',
            'question': '請問您最近兩個禮拜血液透析時是否有靜脈壓力高之情況？',
            'answer': {
                1: '是',
                0: '否',
            }
        },
        {
            'title': 'collapse',
            'question': '請問將您的廔管高舉過心臟，廔管是否塌陷？',
            'answer': {
                1: '是',
                0: '否',
            }
        },
        {
            'title': 'position',
            'question': '收案地點？',
            'answer': {
                1: '門診',
                2: '洗腎室',
            }
        },
        {
            'title': 'operation',
            'question': '手術？',
            'answer': {
                1: '無',
                2: 'PTA',
                3: 'PTA+thrombectomy',
                4: '例行性檢查',
            }
        },
        {
            'title': 'result',
            'question': '診斷好壞？',
            'answer': {
                1: '好',
                2: '壞',
                3: '無聲音',
                4: '無紀錄',
            }
        },
    ];

    const openHandle = () => {
        if (!editStatus.value) {
            openStatus.value = !openStatus.value;
        }
    }
    const editHandle = () => {
        editStatus.value = !editStatus.value;
    }
    const deleteHandle = (event: Event) => {
        // [#] 記得把剩下的邏輯補完
        proxy.$notify('warning', '提醒！', '您確定要刪除此筆資料嗎?', 0, true).then(() => {
            if(props.outpatient.id != 0){
                console.log('傳送刪除事件');
            }

            emit('delete');
        }).catch(() => {
            console.log('取消刪除');
        });
    }
    const saveHandle = () => {
        // [#] 記得把剩下的邏輯補完
        console.log('傳送新增、修改事件');

        proxy.$notify('success', '結果', '修改成功。', 3000).then(() => {

        }).catch((error) => {
            console.log('error：', error);
        });
    }
</script>

<template>
    <div class="outPatientListBar" :class="{open: openStatus, edit: editStatus}">
        <div class="tr" :class="{ thead: header }">
            <div class="td fold">
                <ElSvgIcon v-if="header" name="description" />
                <ElSvgIcon v-else name="arrow_drop_down" @click="openHandle"/>
            </div>
            <div class="td createDate">
                <template v-if="header">{{ outpatient.createDate }}</template>
                <MoleDatePicker v-else :disabled="!editStatus" v-model="outpatient.createDate"></MoleDatePicker>
            </div>
            <div class="td place">
                <template v-if="header">{{ outpatient.place }}</template>
                <ElInput v-else :disabled="!editStatus" v-model="outpatient.place"></ElInput>
            </div>
            <div class="td BP">
                <template v-if="header">{{ outpatient.BP_1 }}</template>
                <template v-else>
                    <ElInput :disabled="!editStatus" v-model="outpatient.BP_1"></ElInput>
                    <ElInput :disabled="!editStatus" v-model="outpatient.BP_2"></ElInput>
                </template>
            </div>
            <div class="td HR">
                <template v-if="header">{{ outpatient.HR }}</template>
                <ElInput v-else :disabled="!editStatus" v-model="outpatient.HR"></ElInput>
            </div>
            <div class="td PI">
                <template v-if="header">{{ outpatient.PI }}</template>
                <ElInput v-else :disabled="!editStatus" v-model="outpatient.PI"></ElInput>
            </div>
            <div class="td RI">
                <template v-if="header">{{ outpatient.RI }}</template>
                <ElInput v-else :disabled="!editStatus" v-model="outpatient.RI"></ElInput>
            </div>
            <div class="td TAMEAN">
                <template v-if="header">{{ outpatient.TAMEAN }}</template>
                <ElInput v-else :disabled="!editStatus" v-model="outpatient.TAMEAN"></ElInput>
            </div>
            <div class="td flow">
                <template v-if="header">{{ outpatient.flow }}</template>
                <ElInput v-else :disabled="!editStatus" v-model="outpatient.flow"></ElInput>
            </div>
            <div class="td diameter">
                <template v-if="header">{{ outpatient.diameter }}</template>
                <ElInput v-else :disabled="!editStatus" v-model="outpatient.diameter"></ElInput>
            </div>
            <div class="td next">
                <template v-if="header">{{ outpatient.next }}</template>
                <MoleDatePicker v-else :disabled="!editStatus" v-model="outpatient.next"></MoleDatePicker>
            </div>
            <div class="td feature">
                <template v-if="!header">
                    <ElSvgIcon class="edit" name="edit" @click="editHandle"/>
                    <ElSvgIcon class="disk" name="save" @click="saveHandle" />
                    <ElSvgIcon class="trash" name="delete_forever" @click="deleteHandle"/>
                    <ElSvgIcon class="cross-circle" name="cance" @click="editHandle"/>
                </template>
            </div>
        </div>
        <article v-if="!header" class="drawer" :class="{open: foldStatus}">
            <section class="questionnaire">
                <h3 class="title">問卷：</h3>

                <div v-for="(item, index) in questionnaire" class="question" :key="`question_${item.title}`">
                    Q{{Number(index)+1}}. {{item.question}}
                    <ElRadio v-for="(text, answer) in item.answer" :key="`answer_${answer}`"
                        :name="`${item.title}[${i}]`" :value="answer"
                        v-model="outpatient[item.title]"
                    >{{text}}</ElRadio>
                </div>

            </section>

            <section class="remark">
                <h3 class="title">回診狀況：</h3>
                <textarea class="textarea" :name="`msg[${i}]`" cols="30" rows="10" v-model="outpatient.msg"></textarea>
                <ElSvgIcon name="send"></ElSvgIcon>
            </section>
        </article>
    </div>
</template>

<style lang="scss" scope>
    .outPatientListBar {
        @include setFlex(flex-start, stretch, 0, column);
        width: 100%;
        .tr {
            display: grid;
            grid-template-areas: "fold createDate place BP HR PI RI TAMEAN flow diameter next feature";
            grid-template-columns: 50px 1fr 130px 150px repeat(6, 125px) 1fr 135px;

            background: $colorBack;
            @include setSize(100%, 80px);
            border-radius: 20px;
            box-shadow: 0 1px 2px 0 rgba($color: #000, $alpha: .35);
            z-index: 1;
            &.thead {
                background: $colorMain;
                height: 55px;
                .td {
                    color: $colorUnFont;
                    &.fold .icon { fill: $colorUnFont; }
                    &.BP::before { display: none; }
                }
            }

            .td {
                @include setFlex(center, center, 8px);
                @include setSize(100%, 100%);
                padding: 10px;
                color: #444;

                .input {
                    min-width: 100px;
                }

                &.fold {
                    grid-area: fold;
                    padding: 10px 0 10px 10px;
                    .icon {
                        fill: $colorMain;
                        @include setSize(40px, 40px);
                        svg { @include setSize(100%, 100%); }
                    }
                }
                &.createDate { grid-area: createDate; }
                &.place { grid-area: place; }
                &.BP {
                    grid-area: BP;
                    position: relative;
                    gap: 0;
                    .input {
                        width: 65px;
                        min-width: unset;
                        &:first-child {
                            padding-right: 10px;
                            border-right: none;
                            border-radius: 20px 0 0 20px;
                            text-align: right;
                        }
                        &:last-child {
                            padding-left: 10px;
                            border-left: none;
                            border-radius: 0 20px 20px 0;
                        }

                    }

                    &::before {
                        content: '';
                        position: absolute;
                        top: 50%;
                        left: 50%;
                        background: #666;
                        width: 2px;
                        height: 21px;
                        transform: translate3d(-50%, -50%, 0) rotateZ(20deg);
                        z-index: 1;
                    }
                }
                &.HR { grid-area: HR; }
                &.PI { grid-area: PI; }
                &.RI { grid-area: RI; }
                &.TAMEAN { grid-area: TAMEAN; }
                &.flow { grid-area: flow; }
                &.diameter { grid-area: diameter; }
                &.next { grid-area: next; }
                &.feature {
                    grid-area: feature;
                    justify-content: center;
                    gap: 8px;
                    .icon {
                        @include setSize(35px, 35px);
                        cursor: pointer;

                        svg { @include setSize(100%, 100%); }
                        &:hover { transform: scale3d(1.2, 1.2, 1); }

                        &.disk,
                        &.cross-circle { width: 0; }
                        &.edit,
                        &.trash { width: 35px; }

                        &.edit { fill: $colorMain; }
                        &.disk { fill: $colorSuccess; }
                        &.cross-circle { fill: $colorError; }
                        &.trash { fill: $colorError; }
                    }
                }
            }
        }

        .drawer {
            @include setFlex(space-between, flex-start, 25px);
            background: $colorBack;
            max-height: 0;
            padding: 0;
            border-radius: 0 0 20px 20px;
            margin-top: 0;
            overflow: hidden;
            transition: .2s $cubic-FiSo;
        }

        &.open,
        &.edit {
            .drawer {
                margin-top: -20px;
                padding: 45px 20px 20px;
                max-height: 345px;
            }
        }
        &.open {
            .tr .td.fold .icon {
                // fill: $colorUnFont;
                transform: rotateX(180deg);
            }
        }
        &.edit {
            z-index: 10;
            .tr .td.feature {
                // gap: 16px;
                .icon {
                    &.disk,
                    &.cross-circle { width: 35px; }

                    &.edit,
                    &.trash { width: 0; }
                }
            }
        }
    }

    .drawer {
        .questionnaire,
        .remark {
            @include setFlex(space-between, stretch, 15px, column);
            .title {
                font-size: 18px;
                color: $colorMain;
            }
        }

        .questionnaire {
            .question {
                @include setFlex(flex-start);
                gap: 10px;
                color: $colorMain;
            }
        }
        .remark {
            position: relative;

            flex-grow: 1;
            .textarea {
                background: #fff;
                max-height: 235px;
                padding: 10px 15px;
                border: 1px solid #c1c1c1;
                border-radius: 20px;
            }
            .icon {
                position: absolute;
                bottom: 15px;
                right: 15px;
                background: #cfdedd;
                @include setSize(40px, 40px);
                border-radius: 50%;
                fill: $colorMain;
                cursor: pointer;
                svg {
                    @include setSize(30px, 30px);
                    transform: translateX(3px);
                }
            }
        }
    }

</style>