<script setup lang="ts">
    import { ref } from "vue";
    import { onClickOutside } from '@vueuse/core';

    import useGlobalProperties from '@/hooks/useGlobalProperties';
    const proxy = useGlobalProperties(); // getCurrentInstance Instance的proxy 封裝

    interface SelectBox extends Ref{
        closeSelect: () => void;
        open: boolean;
    }
    const selectBox: Ref<SelectBox[]> = ref([]);

    onMounted(() => {
        // select 外部點擊事件
        selectBox.value.map((ele)=> {
            onClickOutside(ele, () => {
                if(ele.open){
                    setTimeout(() => { // 有冒泡問題，所以要等一下 之後看看有沒有更好的解法
                        ele.closeSelect();
                    }, 10);
                }
            });
        });

        // onClickOutside(selectBox, () => {
        //     console.log('點擊外部', selectBox.open);
        //     selectBox.closeSelect();
        // });
    });

    const num1 = ref('1');
    const list1 = [
        { title: '請選擇', value: '' },
        { title: '3_5', value: '1' },
        { title: '4_2', value: '2' },
        { title: '4_7', value: '3' },
        { title: '5_3', value: '4' },
    ];

    const num2 = ref('2');
    const list2 = [
        { title: '請選擇', value: '' },
        { title: '3_5', value: '1' },
        { title: '4_2', value: '2' },
        { title: '4_7', value: '3' },
        { title: '5_3', value: '4' },
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

    const ii = ref(0);
    const notifyTest = () => {
        ii.value++;

        proxy.$notify('info', 'Develop', '彈窗測試', 3000, true)
        .then((result) => { // resolves
            console.log('notify Result', result);
        }).catch((error) => { // rejects || error
            console.log('notify Error', error);
        });
    }

    const pageList = ref([1,2,3,4,5]);
</script>

<!--
    建立一個名為 UIUXSet 的元件 (component)
    裡面是各種基礎的el-input.vue的 component 引入
    這樣就可以在這裡測試 統一風格
    之後可以在其他頁面直接使用
-->
<template>
    <div class="theme">
        <div class="groupBox">
            <ElBtn>一般狀態</ElBtn>
            <ElBtn @click="notifyTest">Notify</ElBtn>
            <ElBtn class="current">被選</ElBtn>
            <ElBtn class="back">返回</ElBtn>
        </div>

        <div class="groupBox">
            <ElInputBox field-name="姓名">
                <ElInput type="text" placeholder="我是輸入框"></ElInput>
            </ElInputBox>
            <ElInputBox field-name="身分證字號">
                <ElInput type="text" placeholder="我是輸入框" value="R123456789"></ElInput>
            </ElInputBox>
            <ElInputBox field-name="主治醫師">
                <ElInput type="text" placeholder="我是輸入框" disabled value="不可修改"></ElInput>
            </ElInputBox>
        </div>

        <div class="groupBox">
            <MoleDatePicker />

            <ElInputBox field-name="管徑">
                <ElSelect :ref="(el: Element) => selectBox.push(el)" :options="list1" v-model="num1" unit="mm"/>
            </ElInputBox>

            <ElInputBox field-name="管長">
                <ElSelect :ref="(el: Element) => selectBox.push(el)" :options="list2" v-model="num2" unit="cm"/>
            </ElInputBox>

            <ElInputBox field-name="管長">
                <ElSelect :ref="(el: Element) => selectBox.push(el)" :options="list1" v-model="num1" unit="cm"/>
                <ElSelect :ref="(el: Element) => selectBox.push(el)" :options="list2" v-model="num2" unit="cm"/>
            </ElInputBox>
        </div>

        <div class="groupBox">
            <ElRadio v-for="item in genderList" v-model="gender" :value="item.value" :key="item.value" name="gender">{{ item.title }}</ElRadio>
        </div>

        <div class="groupBox">
            <OrgaPagination :pageList="pageList"/>
        </div>

        <div class="groupBox">
            <MoleImgUpload />
        </div>
    </div>
</template>

<style lang="scss">
    .theme {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        justify-content: flex-start;
        flex-wrap: wrap;
        gap: 20px;

        background: $colorViewBack;
        @include setSize(100%, auto);
        padding: 40px;
        border-radius: 50px;
        margin: 30px auto 0;
        .groupBox {
            display: flex;
            align-items: center;
            justify-content: flex-start;
            gap: 15px;
        }
    }
</style>
