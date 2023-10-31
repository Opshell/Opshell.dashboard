<script setup lang="ts">
    import { useElementBounding } from '@vueuse/core';
    import { getData } from '@/hooks/useApi';

    import useGlobalProperties from '@/hooks/useGlobalProperties';
    const proxy = useGlobalProperties();

    const route = useRoute();

    interface iProps {
        imgSrc: string;
        // list: {
        //     id: number;
        //     text: string;
        //     x: string;
        //     y: string;
        //     style: any;
        // }[] | null;
    }
    const props = withDefaults(defineProps<iProps>(), {
        // list: null,
        imgSrc: '',
    });
    const emit = defineEmits<{
        'deleteRealImg': [];
        'newRealImg': [imgUrl: string];
    }>();

    // [-]真實圖片
    const realImg = computed(() => { // 真實部位圖
        return props.imgSrc;
    });
    const deleteRealImg = () => {
        emit('deleteRealImg');
    };

    // [-]原理圖預覽、上傳
    interface iImgUpload extends Ref{
        uploadImages: (url: string) => Promise<string>;
    }
    const realImgUpload = ref<iImgUpload>(); // REF: 上傳圖片的組件
    const realImgUploadImages = () => {
        const url = `/mapi/patient/upload-real-img?patient_id=${route.params.pid}`;

        realImgUpload.value?.uploadImages(url).then((imgUrl) => {
            emit('newRealImg', imgUrl);

            getMarkList();
        });
    };

    interface iMark {
        id: number;
        text: string;
        x: number;
        y: number;
        disabled: boolean;
    }

    const dragBox = ref<HTMLElement | null>(null);
    const markList = ref<iMark[]>([]);
    // const markDoms = ref<HTMLElement[]>([]);
    const getMarkList = () => {
        getData(`/mapi/patient/real-img-mark-list?patient_id=${route.params.pid}`).then(async (res) => {
            markList.value = res?.data.map((element: iMark) => {
                return {
                    id: element.id,
                    text: element.text,
                    x: Number(element.x),
                    y: Number(element.y),
                    disabled: true,
                };
            });

            // await nextTick();

            // markList.value?.map((mark, i) => {

            //     mark.style = useDraggable(markDoms.value[i], {
            //         containerElement: dragBox,
            //         initialValue: { x: Number(mark.x), y: Number(mark.y) },
            //     }).style;

            //     return mark;
            // });

        });
    }

    // ElDrag Emit 出來的資料  更新回來
    const updatePostion = (pos: { x: number; y: number; }, i: number) => {
        markList.value[i].x = pos.x;
        markList.value[i].y = pos.y;
    };

    // 預設起始點
    const {
        top: dragBoxTop,
        left: dragBoxLeft,
    } = useElementBounding(dragBox);
    // 新增標記
    const addMark = () => {
        markList.value.push({
            id: 0,
            text: '',
            x: dragBoxLeft.value,
            y: dragBoxTop.value,
            disabled: true,
        });
    };
    const editeMark = (i: number) => {
        markList.value[i].disabled = !markList.value[i].disabled;
    };
    const deleteMark = (i: number) => {
        if (markList.value[i].id !== 0) {
            getData(`/mapi/patient/mark-delete?patient_id=${route.params.pid}&mark_id=${markList.value[i].id}` ).then(res => {
                proxy.$notify('success', '結果', '刪除成功').then(() => {
                    markList.value.splice(i, 1);
                });
            }).catch(err => {
                proxy.$notify('error', '錯誤', `刪除失敗，${err}`);
            });
        } else {
            markList.value.splice(i, 1);
        }
    };
    const saveMark = () => {
        const formData = new FormData();

        markList.value.map((mark, i) => {
            formData.append(`mark[${i}][id]`, mark.id.toString());
            formData.append(`mark[${i}][text]`, mark.text);
            formData.append(`mark[${i}][x]`, mark.x.toString());
            formData.append(`mark[${i}][y]`, mark.y.toString());
        });

        getData(`/mapi/patient/mark-save?patient_id=${route.params.pid}`, 'POST', formData).then(res => {
            console.log(res);
            proxy.$notify('success', '結果', '新增成功');
        }).catch(err => {
            proxy.$notify('error', '錯誤', `新增失敗，${err}`);
        });
    };

    onMounted(() => {
        if(realImg.value != ''){
            getMarkList();
        }
    });
</script>

<template>
    <section class="imgMarkBlock">
        <div class="markBlock" ref="dragBox">
            <MoleImgUpload ref="realImgUpload"
                :old-img="realImg"
                @delete-img="deleteRealImg"
            />

            <template v-if="realImg != ''">
                <ElDrag v-for="(mark, i) in markList" class="mark"
                    :x="mark.x" :y="mark.y" :key="'mark_'+i"
                    :dragWidth="80" :dragHeight="80"
                    :container="dragBox" @update:position="pos => updatePostion(pos, i)"
                >{{mark.text}}</ElDrag>
            </template>
        </div>

        <section class="markList">
            <header class="featureBox">
                <ElBtn class="current" @click="realImgUploadImages">上傳圖片</ElBtn>
                <ElBtn v-if="realImg != ''" class="subs" @click="addMark">新增標記</ElBtn>
            </header>

            <div v-for="(mark, i) in markList" class="markData" :key="'editMark_' + i">
                <ElInput v-model="mark.text" :disabled="mark.disabled"></ElInput>
                <ElSvgIcon name="edit" @click="editeMark(i)"/>
                <ElSvgIcon name="delete_forever" @click="deleteMark(i)"/>
            </div>

            <footer class="BtnBox">
                <ElBtn class="current" @click="saveMark">儲存</ElBtn>
            </footer>
        </section>
    </section>
</template>

<style lang="scss">
    .imgMarkBlock {
        @include setFlex(flex-start, stretch, 25px);
        @include setSize(100%, 100%);

        .markBlock {
            @include setFlex();
            position: relative;
            @include setSize(100%, 100%);
            border: 1px solid #ccc;
            border-radius: 15px;
            overflow: hidden;
            .imgUploadBlock {
                @include setSize(auto, 100%);
                min-height: 640px;
                aspect-ratio: 613 / 822;
                user-select: none;
            }
            .mark {
                @include setSize(80px, 80px);
                border: 5px solid $colorError;
                border-radius: 50%;
                .text {
                    color: #000;
                }
            }
        }

        .markList {
            flex-shrink: 0;
            @include setFlex(flex-start, stretch, 20px, column);
            .featureBox {
                @include setFlex(flex-start, center, 10px);
                .Btn { margin: 2px 5px; }
            }

            .markData {
                @include setFlex(flex-start, center, 20px);
                .input {
                    height: 50px;
                }
                .icon {
                    fill: $colorMain;
                    @include setSize(50px, 50px);
                    cursor: pointer;
                    &:hover {
                        fill: $colorSubs;
                    }
                }
            }

            .BtnBox {
                flex: 1;
                @include setFlex(flex-end, flex-end);
                .Btn { margin: 0 3px 2px 0; }
            }
        }
    }
</style>