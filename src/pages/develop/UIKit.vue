<script setup lang="ts">
    import { ref } from "vue";

    import { useGlobalProperties } from '@/hooks/utilityFunctions';
    const proxy = useGlobalProperties(); // getCurrentInstance Instance的proxy 封裝
    const route = useRoute();

    const num1 = ref(1);
    const list1 = [
        { title: '請選擇', value: 0 },
        { title: '3_5', value: 1 },
        { title: '4_2', value: 2 },
        { title: '4_7', value: 3 },
        { title: '5_3', value: 4 },
    ];

    const num2 = ref(2);
    const list2 = [
        { title: '3_5', value: 1 },
        { title: '4_2', value: 2 },
        { title: '4_7', value: 3 },
        { title: '5_3', value: 4 },
    ];

    const gender = ref('');
    const genderList = [
        {
            title: '男',
            value: 'man'
        },
        {
            title: '女',
            value: 'woman'
        },
        {
            title: '其他',
            value: 'other'
        }
    ];
    const peoples = ref([ 'Alan' ]);
    const peopleList = ['Alan', 'Bob', 'Cathy', 'David', 'Eva'];

    const ii = ref(0);
    const notifyTest = () => {
        ii.value++;

        proxy.$notify('info', 'Develop', '彈窗測試', 3000, true)
        .then((result) => { // resolves

        }).catch((error) => { // rejects || error
            console.error('notify Error', error);
        });
    }

    const pageList = ref([1,2,3,4,5]);

    // 網站主視覺色系
    const colorList = ref([
        {
            value: '#fff4ea',
            text: '',
            var: ''
        },
        {
            value: '#ffe1c7',
            text: '',
            var: ''
        },
        {
            value: '#fec38e',
            text: '',
            var: ''
        },
        {
            value: '#fead65',
            text: '',
            var: ''
        },
        {
            value: '#fe963d',
            text: '',
            var: ''
        },
        {
            value: '#fd7a16',
            text: '',
            var: ''
        },
        {
            value: '#bc5a0d',
            text: '',
            var: ''
        },
        {
            value: '#844006',
            text: '',
            var: ''
        },
        {
            value: '#5b2d03',
            text: '',
            var: ''
        },
        {
            value: '#301701',
            text: '',
            var: ''
        },
    ]);
    const themeColorList = ref([
        {
            value: '#FF7B00',
            text: '主色調 Normal',
            var: '--color-primary'
        },
        {
            value: '#FFA100',
            text: 'Hover',
            var: '--color-primary-light'
        },
        {
            value: '#853D14',
            text: 'Click',
            var: '--color-primary-dark'
        },
        {
            value: '#FFD4A1',
            text: '目前 active || current',
            var: '--color-primary-dilute'
        },
    ]);
    const middleColorList = ref([
        {
            value: '#1F1F1F',
            text: '標題',
            var: '--color-title'
        },
        {
            value: '#595959',
            text: '文本',
            var: '--color-text'
        },
        {
            value: '#BFBFBF',
            text: '淺色文字',
            var: '--color-text-light'
        },
        {
            value: '#F2F2F2',
            text: '佈局背景',
            var: '--color-view-block'
        },
        {
            value: '#D9D9D9',
            text: '邊框/背景',
            var: '--color-border-box'
        },
        {
            value: '#d0d4dd',
            text: '按鈕背景色',
            var: '--color-btn-background'
        },
    ]);
    const statusColorList = ref([
        {
            value: '#03A61C',
            text: '成功',
            var: '--color-success'
        },
        {
            value: '#FFE500',
            text: '警告',
            var: '--color-warning'
        },
        {
            value: '#F23005',
            text: '失敗',
            var: '--color-error'
        },
        {
            value: '#853D14',
            text: '連結',
            var: '--color-link'
        },
    ]);

    const isPwd = ref(true);

    const content = ref('');

    import { useQuasar } from 'quasar';
    import confirmComponent from '@/components/mole/confirm.vue';
    import notifyComponent from '@/components/mole/notify.vue';
    const $q = useQuasar();

    const qNotify = () => {
        $q.dialog({
            component: notifyComponent,

            componentProps: {
                type: 'warning',
                title: 'Warning',
                message: "就說不重要了，硬要按捏?",
            },
        }).onCancel(() => {
            console.log('Cancel');
        });
    }

    const deleteArticle = () => {
        $q.dialog({
            component: confirmComponent,

            componentProps: {
                title: '刪除確認',
                message: "確認要刪除文章嗎? 刪除後將不能復原。<br/>(按'確定'刪除)",
                infoLink: 'https://www.google.com',
            },
        }).onOk(() => {
            console.log('outside OK');
        }).onCancel(() => {
            console.log('Cancel');
        });
    }

    const lineProgress = ref(0);
    // 用settimeout模擬進度條
    const addProgress = () => {
        setTimeout(() => {
            lineProgress.value += 5;
            if(lineProgress.value >= 100) {
                lineProgress.value = 100;
            } else {
                addProgress();
            }
        }, 500);
    }
    addProgress();


    interface iImgUploader extends Ref{
        uploadImages: (
            url: string,
            formData: { [key:string]: string | number }
        ) => Promise<giImageData>;
    }
    const imgUploaderDom = ref<iImgUploader>(); // REF: 上傳圖片的組件
    const uploadImage = () => {
        imgUploaderDom.value?.uploadImages(`/mapi/image/upload`, {})
        .then((res) => {
            console.log('uploadImages', res);
        });
    }
</script>

<template>
    <OrgaContentBlock class="project-list-block">
        <template #header>
            <div class="tabs-block"></div>
        </template>

        <OrgaWaterfallsFlow>
            <MoleWaterfallsFlowCard title="網站主視覺">
                <MoleColorList :colorList="colorList"/>
            </MoleWaterfallsFlowCard>

            <MoleWaterfallsFlowCard title="品牌色">
                <MoleColorList :colorList="themeColorList"/>
            </MoleWaterfallsFlowCard>

            <MoleWaterfallsFlowCard title="中性色">
                <MoleColorList :colorList="middleColorList"/>
            </MoleWaterfallsFlowCard>

            <MoleWaterfallsFlowCard title="功能色">
                <MoleColorList :colorList="statusColorList"/>
            </MoleWaterfallsFlowCard>

            <MoleWaterfallsFlowCard title="LABLE INPUT SET">
                <ElInputBox field-name="Name">
                    <ElInput type="text" placeholder="姓名"></ElInput>
                </ElInputBox>

                <ElInputBox field-name="密碼">
                    <ElInput
                        :type="isPwd ? 'password' : 'text'"
                        placeholder="密碼"
                    >
                        <template v-slot:icon>
                            <ElSvgIcon
                                :name="isPwd ? 'visibility' : 'visibility_off'"
                                @click="isPwd = !isPwd"
                            />
                        </template>
                    </ElInput>
                </ElInputBox>

                <ElInputBox field-name="手機">
                    <ElInput type="text"
                        placeholder="09##-###-###"
                        mask="09##-###-###"
                    />
                </ElInputBox>

                <ElInputBox field-name="搜尋">
                    <ElInput type="text"
                        placeholder="Search"
                    >
                        <template v-slot:icon>
                            <ElSvgIcon name="search" />
                        </template>
                    </ElInput>
                </ElInputBox>

                <ElInputBox field-name="禁用">
                    <ElInput type="text" placeholder="Disable" disable></ElInput>
                </ElInputBox>
            </MoleWaterfallsFlowCard>

            <MoleWaterfallsFlowCard title="下拉選單">
                <ElInputBox field-name="一般&功能">
                    <ElSelect  :options="list2" v-model="num2" suffix="cm"/>
                    <ElSelect
                        type="feature"
                        :options="[]"
                        hide-dropdown-icon
                    >
                        <template #selected>
                            <ElSvgIcon name="more_horiz" />
                        </template>
                        <template #option>
                            <q-item clickable>
                                <ElSvgIcon name="open_in_new" />
                                <q-item-label>前往頁面</q-item-label>
                            </q-item>
                            <q-item clickable>
                                <ElSvgIcon name="file_copy" />
                                <q-item-label>複製文章</q-item-label>
                            </q-item>
                            <q-item clickable>
                                <ElSvgIcon name="star" />
                                <q-item-label>加入最愛</q-item-label>
                            </q-item>
                            <q-item clickable>
                                <ElSvgIcon name="delete" />
                                <q-item-label>刪除</q-item-label>
                            </q-item>
                        </template>
                    </ElSelect>
                </ElInputBox>

                <ElInputBox field-name="一般與禁用">
                    <ElSelect :options="list1" v-model="num1" unit="cm"/>
                    <ElSelect :options="list2" v-model="num2" unit="cm" disable/>
                </ElInputBox>
            </MoleWaterfallsFlowCard>

            <MoleWaterfallsFlowCard title="按鈕狀態">
                <ElBtn class="hight">高亮</ElBtn>
                <ElBtn>常態</ElBtn>
                <ElBtn class="current">被選中</ElBtn>
                <ElBtn class="sub" @click="qNotify()">不重要&Notify 彈窗</ElBtn>
                <ElBtn class="add">新增功能</ElBtn>
                <ElBtn class="danger" @click="deleteArticle()">需注意功能&confirm 彈窗</ElBtn>
                <ElBtn class="disable">禁用</ElBtn>
            </MoleWaterfallsFlowCard>

            <MoleWaterfallsFlowCard title="Radio & checkbox">
                <div class="radio-box">
                    <ElRadio v-for="item in genderList" :key="item.value"
                        name="gender"
                        v-model="gender"
                        :val="item.value"
                        :label="item.title"
                    />
                </div>

                <div class="radio-box">
                    <ElCheckbox v-for="(people, i) in peopleList" :key="'people_'+i"
                        v-model="peoples" :label="people" :val="people"
                    ></ElCheckbox>
                </div>
            </MoleWaterfallsFlowCard>

            <MoleWaterfallsFlowCard title="Images show and upload">
                <template #icon>
                    <ElSvgIcon name="cloud_upload" @click="uploadImage()"/>
                </template>
                <MoleImgUpload ref="imgUploaderDom" is-multiple />
            </MoleWaterfallsFlowCard>

            <MoleWaterfallsFlowCard>
                <ElUploader />
            </MoleWaterfallsFlowCard>

            <MoleWaterfallsFlowCard title="Date Picker">
                <ElInputBox field-name="Birthday">
                    <MoleDatePicker />
                </ElInputBox>
            </MoleWaterfallsFlowCard>

            <MoleWaterfallsFlowCard title="Editor">
                <ElEditor v-model="content"></ElEditor>
            </MoleWaterfallsFlowCard>

            <MoleWaterfallsFlowCard title="textarea">
                <ElInput type="textarea"
                    placeholder="content"
                >
                </ElInput>
            </MoleWaterfallsFlowCard>

            <MoleWaterfallsFlowCard>
                <OrgaPagination :pageList="pageList" :last-page="12"/>
            </MoleWaterfallsFlowCard>

            <MoleWaterfallsFlowCard>
                <ElProgress :percent="lineProgress"/>
                <ElProgress :percent="60" type="circle"/>
            </MoleWaterfallsFlowCard>
        </OrgaWaterfallsFlow>
    </OrgaContentBlock>
</template>

<style lang="scss">

</style>
