<script setup lang="ts">
    /* global Opshell */
    // [-] type import
    import { Ref } from 'vue';

    interface iProps {
        oldImg?: string[] | null;
        isMultiple?: boolean;
        sAddition?: boolean;
    }
    const props = withDefaults(defineProps<iProps>(), {
        oldImg: null,
        isMultiple: false,
        sAddition: false,
    });

    const uploadArea = ref<HTMLElement>(); // 上傳區域
    const imgResults: Ref<string[]> = ref([]); // file load 要預覽的圖片陣列
    const imageDataList: Ref<File[]> = ref([]); // 圖片資料陣列

    // 上傳預覽
    const previewImage = (files: FileList) => {
        let count = 0;
        let i = 0;
        if (files) {
            count = files.length;
            console.log('count', count);
            while (count--) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    previewList.value.push(e.target?.result as string);
                };

                imageDataList.value.push(files[i]);
                reader.readAsDataURL(files[i]);
                i++;
            }
        }
    };

    const clear = (e: Event) => {
        // 停止冒泡 才不會再一次觸發上傳
        e.stopPropagation();
        e.preventDefault();

        imgResults.value = [];
        imageDataList.value = [];
    };

    // [-]要預覽的圖片陣列
    const previewList = computed(() => {
        let imgList: string[] = [];
        if(imgResults.value){
            imgList = imgResults.value;
        } else if (props.oldImg) {
            imgList = props.oldImg;
        }

        return imgList;
    });

    // [-]停止拖曳預設行為
    const drop = (e: DragEvent) => {
        e.stopPropagation(); //終止事件傳導
        e.preventDefault();  //終止預設行為

        const eTarget = e.target as HTMLInputElement;

        // 如果拖曳進來的東西是圖片
        if (e.dataTransfer?.files[0].type.match(/image.*/)) {
            // 把圖片file 塞進下層 file input
            const fileInput = eTarget.querySelector('.fileInput') as HTMLInputElement;
            fileInput.files = e.dataTransfer.files;

            // 預覽圖片
            previewImage(fileInput.files);
        }

        eTarget.classList.remove('drop-enter');
    }
    const dragenter = (e: DragEvent) => {
        (e.target as HTMLInputElement).classList.add('drop-enter');
    }
    const dragleave = (e: DragEvent) => {
        (e.target as HTMLInputElement).classList.remove('drop-enter');
    }
    const stopDragover = (e: DragEvent) => {
        e.stopPropagation(); //終止事件傳導
        e.preventDefault();  //終止預設行為
    }

    onMounted(() => {
        // let uploadArea = document.querySelector('.imgUploadBlock') as HTMLElement;

        uploadArea.value?.addEventListener('dragenter', dragenter, false);
        uploadArea.value?.addEventListener("dragleave", dragleave, false);
        uploadArea.value?.addEventListener('drop', drop, false);
        uploadArea.value?.addEventListener('dragover', stopDragover, false);
    });

    // const upload = (file, onUploadProgress) => {
    //     let formData = new FormData();
    //     formData.append('file', file);
    //     return http.post('/upload', formData, {
    //         headers: {
    //             'Content-Type': 'multipart/form-data',
    //         },
    //         onUploadProgress,
    //     });
    // };

    // const getFiles = () => {
    //     return http.get('/files');
    // };
</script>

<template>
    <label class="imgUploadBlock" ref="uploadArea">
        <div v-if="previewList.length == 0" class="note" :class="{hidden: sAddition}">將圖片拖曳進、點擊此區域來上傳圖片</div>

        <div v-else class="previewBlock" :class="{hidden: sAddition}">
            <div v-for="(item, i) in previewList" class="previewBox" :key="'img_' + i">
                <img :src="item" class="img" />
                <div v-if="imageDataList.length > 0">
                    <p class="mb-0">file name: {{ imageDataList[i].name }}</p>
                    <p>size: {{ imageDataList[i].size / 1024 }}KB</p>
                </div>
            </div>
        </div>

        <ElSvgIcon v-if="sAddition" name="plus-small" class="plus"/>

        <input type="file" class="fileInput" accept="image/*" :multiple="props.isMultiple" />

        <ElSvgIcon v-if="previewList.length > 0" name="cross-circle" class="clear" @click="clear" title="刪除圖片"></ElSvgIcon>
    </label>
</template>

<style lang="scss">
    .imgUploadBlock {
        position: relative;
        display: flex;
        align-items: center;
        justify-content: center;
        background: #e9e9e9 url('/assets/images/No_Image.jpg') no-repeat 50% 50%;
        background-size: contain;
        @include setSize(100%, 100%);
        border: 5px dashed #ccc;
        border-radius: 12px;
        box-shadow: 0 0 3px 1px rgba(0, 0, 0, 0.25) inset;

        cursor: pointer;
        transition: 0.15s $cubic-FiSo;
        overflow: hidden;

        .fileInput {
            @include setSize(100%, 100%);
            cursor: pointer;
            z-index: -1;
            opacity: 0;
        }
        .note {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%) scale3d(1, 1, 1);
            color: #333;
            letter-spacing: 1px;
            font-size: 36px;
            font-weight: bold;
            text-align: center;
            text-shadow: 0 0 1px #fff;
            overflow: hidden;
            transition: .15s $cubic-FiSo;
        }
        .previewBlock {
            position: absolute;
            top: 0;
            left: 0;
            @include setSize(100%, 100%);
            .previewBox {
                display: flex;
                flex-direction: column;
                align-items: flex-start;
                justify-content: center;
                @include setSize(100%, 100%);
            }
            .img {
                // width: 500px;
                max-width: 100%;
            }
        }
        .plus {
            position: absolute;
            @include setSize(90%, 90%);
        }
        .clear {
            position: absolute;
            top: 10px;
            right: 10px;
            @include setSize(50px, 50px);
            color: #333;
            z-index: 10;
        }


        &.drop-enter .note {
            transform: translate(-50%, -50%) scale3d(0, 0, 0);
        }
        &.drop-enter,
        &:hover {
            border-color: $colorMain;
            .note {
                color: $colorMain;
            }
            .plus {
                fill: $colorMain;
            }
        }
    }
</style>
