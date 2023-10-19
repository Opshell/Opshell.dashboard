<script setup lang="ts">
    import { getData } from '@/hooks/useApi';

    const route = useRoute();

    // interface iProps {
    //     list: {
    //         id: number;
    //         text: string;
    //         x: string;
    //         y: string;
    //         style: any;
    //     }[] | null;
    // }
    // const props = withDefaults(defineProps<iProps>(), {
    //     list: null,
    // });

    interface iMark {
        id: number;
        text: string;
        x: number;
        y: number;
        style: ComputedRef;
    }

    const dragBox = ref<HTMLElement | null>(null);
    const markList = ref<iMark[]>([]);
    // const markDoms = ref<HTMLElement[]>([]);
    getData(`/map/patient/real-img-mark-list?patient_id=${route.params.pid}`).then(async (res) => {
        markList.value = res?.data;

        console.log('markList.value', markList.value);

        // await nextTick();

        // markList.value?.map((mark, i) => {

        //     mark.style = useDraggable(markDoms.value[i], {
        //         containerElement: dragBox,
        //         initialValue: { x: Number(mark.x), y: Number(mark.y) },
        //     }).style;

        //     return mark;
        // });

    });

    // ElDrag Emit 出來的資料  更新回來
    const updatePostion = (pos: { x: number; y: number; }, i: number) => {
        markList.value[i].x = pos.x;
        markList.value[i].y = pos.y;
    };
</script>

<template>
    <section class="imgMarkBlock">
        <div class="markBlock" ref="dragBox">
            <ElImg src="/upload/tuve_pic.png"/>

            <ElDrag v-for="(mark, i) in markList" class="mark"
                :x="mark.x" :y="mark.y" :key="'mark_'+i"
                :dragWidth="50" :dragHeight="50"
                :container="dragBox" @update:position="pos => updatePostion(pos, i)"
            ></ElDrag>
        </div>

        <div class="markList">
            <div class="BtnBox">
                <ElBtn>新增標記</ElBtn>
            </div>
            <div v-for="(mark, i) in markList" class="markData" :key="'editMark_' + i">
                <ElInput v-model="mark.text"></ElInput>
                <ElSvgIcon name="edit"/>
                <ElSvgIcon name="trash" />
            </div>
        </div>
    </section>
</template>

<style lang="scss">
    .imgMarkBlock {
        @include setFlex(flex-start, stretch, 25px);
        @include setSize(100%, 100%);

        .markBlock {
            position: relative;
            @include setSize(100%, 100%);
            border: 1px solid #ccc;
            border-radius: 25px;
            .mark {
                // position: absolute;
                background: #ccc;
                @include setSize(50px, 50px);
                border: 5px solid $colorError;
                border-radius: 50%;
                // cursor: move;
                .text {
                    color: #000;
                }
            }
        }

        .markList {
            flex-shrink: 0;
            @include setFlex(flex-start, flex-start, 20px, column);
            .markData {
                @include setFlex(flex-start, center, 20px);
            }
            .input {
                height: 50px;
            }

            .icon {
                fill: $colorMain;
                @include setSize(50px, 50px);
            }
        }
    }
</style>