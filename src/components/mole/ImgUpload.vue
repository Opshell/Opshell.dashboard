<script setup lang="ts">
    /* global Opshell */
    // [-] type import
    import { useScroll } from '@vueuse/core';
    import { sendRequest } from '@/hooks/useApi';
    import { AxiosRequestHeaders, AxiosProgressEvent } from 'axios';
    import { file, useGlobalProperties } from '@/hooks/utilityFunctions';

    const proxy = useGlobalProperties();

    interface iProps {
        oldImgs?: string[] | string | null;
        isMultiple?: boolean;
        sAddition?: boolean;
    }
    const props = withDefaults(defineProps<iProps>(), {
        oldImgs: null,
        isMultiple: false,
        sAddition: false,
    });
    const emit = defineEmits<{
        'deleteImg': [ i?: number ];
    }>();

    const iImageUploaderList = ref<iImageUploader[]>([]); // 圖片上傳器陣列(上傳的圖片資料都塞這) newImgs
    const uploadArea = ref<HTMLElement>(); // 上傳區域

    interface iImageUploader {
        status: 'old' | 'new';
        index: number; // 用來判斷是哪張圖 (要配合原始陣列) props.oldImgs | iImageUploaderList
        current: boolean; // 是否為當前圖片
        fileData: File; // 原始檔案
        fileName: string; // 檔案名稱 // 舊檔是唯讀 所以要多一格放名稱
        preview: string; // 預覽用 base64 資料
        progress: {  // 上傳進度
            status: 'old' | 'zero' | 'half' | 'success' | 'error';
            executing: boolean;
            total: number;
            loaded: number;
            progress: number;
        }
    };
    const defultImageUploader: iImageUploader = {
        status: 'new',
        index: 0,
        current: false,
        preview: '',
        fileName: '',
        fileData: new File([], ''),
        progress: {
            status: 'zero',
            executing: false,
            total: 0,
            loaded: 0,
            progress: 0,
        },
    };

    // [M] 解析圖片檔案 並產出預覽
    const previewImage = async (files: FileList | null) => {
        // [-]FileList 並不具有 entries 方法，所以用while + i 就可以取得index
        let count = 0;
        let i = 0;

        // 如果只能單張  記得要清空舊圖 (但是不刪除資料庫資料 除非他送出)
        if (props.isMultiple === false) {
            iImageUploaderList.value = []; // 新圖資料刪除
        }

        if (files) {
            count = files.length;
            while (count--) {
                const file = files[i];

                let img: iImageUploader = {
                    ...defultImageUploader,
                    index: i,
                    fileName: file.name,
                    fileData: file,
                    progress: {
                        ...defultImageUploader.progress,
                        total: file.size,
                    },
                };

                // 圖片預覽
                const reader = new FileReader();
                await new Promise((resolve) => {
                    reader.onload = (e) => {
                        img.preview = e.target?.result as string;
                        resolve(true);
                    };
                    reader.readAsDataURL(file);
                })

                iImageUploaderList.value.push(img);

                i++;
            }
        }
    };

    // [-] 整合後的圖片列表
    const imageDomList: Ref = ref([]); // 圖片dom
    const imageList = computed(() => {
        let imgList: iImageUploader[] = [];

        // 放入舊圖
        if (props.oldImgs) {
            if (Array.isArray(props.oldImgs)) {
                props.oldImgs.forEach((item, i) => {
                    imgList.push({
                        ...defultImageUploader, // 使用展開運算子來複製預設值
                        status: 'old',
                        index: i,
                        fileData: new File([], ''), // 空的file
                        fileName: item.split('/').pop() as string, // 圖片檔名
                        preview: item, // 圖片的url
                        progress: {
                            ...defultImageUploader.progress,
                            status: 'old',
                            progress: 100,
                        },
                    });
                });
            } else {
                imgList.push({
                    ...defultImageUploader, // 使用展開運算子來複製預設值
                    status: 'old',
                    fileData: new File([], ''), // 空的file
                    fileName: props.oldImgs.split('/').pop() as string, // 圖片檔名
                    preview: props.oldImgs, // 圖片的url
                    progress: {
                        ...defultImageUploader.progress,
                        status: 'old',
                        progress: 100,
                    },
                });
            }
        }

        // 放入新圖
        if (iImageUploaderList.value.length > 0) {
            iImageUploaderList.value.forEach((item) => {
                imgList.push(item);
            });
        }

        return imgList;
    });

    const imageListVisible = ref(false); // 圖片資料列表是否顯示
    const triggerImageListVisible = (e: Event) => {
        e.stopPropagation();
        e.preventDefault();

        imageListVisible.value = !imageListVisible.value;
    };

    // [M] - 上傳圖片 (暴露)
    const uploadImages = async (
        uploadUrl: string = '',
        formData: {
            [key:string]: any
        } = {}
    ) => {
        if(uploadUrl !== ''){
            const headers = {
                'Content-Type': 'multipart/form-data',
            } as AxiosRequestHeaders;

            imageListVisible.value = true;
            // 添加一個上傳用陣列 才不會舊圖也執行Promise.all 會回傳undefined
            const uploadList = imageList.value.filter(item => item.status === 'new');
            return Promise.all(
                uploadList.map(async (imageUploader: iImageUploader) => { // 一次傳
                    if (imageUploader.status === 'old') {
                        return;
                    } else if (imageUploader.status === 'new') {
                        const formDataTemp = new FormData();

                        formDataTemp.append('image', imageUploader.fileData);

                        if (formData) {
                            Object.keys(formData).forEach((key) => {
                                formDataTemp.append(key, formData[key]);
                            });
                        }

                        const onUploadProgress = (progressEvent: AxiosProgressEvent) => {
                            if(progressEvent.event.lengthComputable){
                                if(!imageUploader.progress.executing){
                                    imageUploader.progress.executing = true;
                                }

                                const loaded = progressEvent.loaded;
                                const total = progressEvent.total || 0;

                                imageUploader.progress.loaded =
                                    (loaded >= imageUploader.progress.total)?
                                    imageUploader.progress.total : loaded;

                                const percent = Math.round((loaded * 100) / total);

                                imageUploader.progress.progress = percent;

                                if(percent >= 100){
                                    imageUploader.progress.status = 'success';
                                } else if(percent >= 50) {
                                    imageUploader.progress.status = 'half';
                                }
                            } else {
                                console.error('File size cannot be calculated！');
                            }
                        };

                        return new Promise((resolve, reject) => {
                            sendRequest(uploadUrl, 'POST', formDataTemp, headers, onUploadProgress) // 本機測試環境
                                .then((res) => {
                                    resolve(res?.data);
                                })
                                .catch((error) => {
                                    console.error(error);
                                    reject(error);
                                });
                        });
                    }
                })
            ).then((res) => {
                // proxy.$notify('success', '結果！', '圖片上傳成功！').then(() => {
                //     isUploading.value = false;
                // });

                // [-]新圖資料刪除
                iImageUploaderList.value = [];

                // [-]回傳上層元件 上傳後得圖片路徑
                return (props.isMultiple === false)? res[0] : res;
            }).catch((error) => {
                // proxy.$notify('error', '圖片上傳失敗！', `${error}`).then(() => {
                //     isUploading.value = false;
                // });
                console.error(error);
            });
        }
    };
    defineExpose ({
        imageList,
        uploadImages,
    });

    // [M] 刪除特定一張圖片
    const deleteImage = (group: 'old' | 'new', i: number, e: Event) => {
        e.stopPropagation();
        e.preventDefault();

        // 如果在舊圖片裡面(觸發刪除舊圖功能嗎?)
        if (group === 'old') {
            proxy.$notify('warning', '確認！', '圖片刪除後無法復原，確定刪除?', 0, true).then(() => {
                emit('deleteImg', i);
            });
        } else if(group === 'new'){
            iImageUploaderList.value.splice(i, 1);
        }
    };

    // [M] 清理圖片
    const clear = (e: Event) => {
        // 停止冒泡 才不會再一次觸發上傳
        e.stopPropagation();
        e.preventDefault();

        iImageUploaderList.value = []; // 新圖資料刪除
        document.querySelector('.fileInput')?.setAttribute('value', ''); // 清除file input的值
        imageListVisible.value = false; // 關閉圖片列表

        // emit('deleteImg'); // 舊圖資料刪除(emit)
    };

    // [M] 滾動到指定圖片位置
    const scrollTo = (targetEl: string, elIndex: number, e: Event) => {
        e.stopPropagation();
        e.preventDefault();

        // 標記當前current
        markProgressBox(elIndex);

        const target = document.getElementById(targetEl) as HTMLElement;
        target.scrollIntoView({behavior: 'smooth'});
    }

    const previewBlock = ref<HTMLElement>(); // 預覽區塊
    const { isScrolling } = useScroll(previewBlock); // 滾動行為
    watch(isScrolling, (newVal) => {
        if (newVal == false) {
            const containerHeight = previewBlock.value?.clientHeight;
            const scrollPosition = previewBlock.value?.scrollTop;

            let currentIndex = 0;
            if(containerHeight && scrollPosition){
                currentIndex = Math.floor(scrollPosition / containerHeight);
            }

            markProgressBox(currentIndex);
        }
    });

    // [M] current progressBox
    const markProgressBox = (i: number) => {
        const el = document.querySelector(`.progressBlock > .progressBox:nth-child(${i + 1})`) as HTMLElement;

        if(!el.classList.contains('current')){
            // 清空current
            document.querySelectorAll('.progressBox.current').forEach((item) => {
                item.classList.remove('current');
            });

            // 當前標記current
            el.classList.add('current');
        }
    }

    // [M] Drag And Drop 行為
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
        uploadArea.value?.addEventListener('dragenter', dragenter, false);
        uploadArea.value?.addEventListener("dragleave", dragleave, false);
        uploadArea.value?.addEventListener('drop', drop, false);
        uploadArea.value?.addEventListener('dragover', stopDragover, false);
    });
</script>

<template>
    <div class="imgUploadBlock">
        <label class="imgUploadBox" :class="{view: imageList.length > 0}" ref="uploadArea">
            <div v-if="imageList.length > 0"
                ref="previewBlock"
                class="previewBlock" :class="{hidden: sAddition}"
            >
                <ElImg v-for="(item, i) in imageList" :key="'previewImg_' + i"
                    :id="'previewImg_'+i"
                    :src="item.preview"
                    class="img"
                    :origin="item.status == 'old'? 'token' : 'public'"

                    :ref="el => imageDomList.push(el)"
                />
            </div>

            <section v-else class="featuresBlock" :class="{hidden: sAddition}">
                <ul class="featureBox">
                    <li class="feature">
                        <ElSvgIcon name="cloud_upload"></ElSvgIcon>
                        <span class="text">Upload</span>
                    </li>
                    <li class="feature">
                        <ElSvgIcon name="image"></ElSvgIcon>
                        <span class="text">Image</span>
                    </li>
                    <li v-if="isMultiple" class="feature">
                        <ElSvgIcon name="photo_library"></ElSvgIcon>
                        <span class="text">multiple</span>
                    </li>
                </ul>

                <h4 v-if="!sAddition" class="title">Drop Or Click Image Uploader.</h4>
                <p v-if="!sAddition" class="description">Either <strong class="stress">Drop</strong> or <strong class="stress">Click</strong> this area to upload an image.</p>
            </section>

            <input type="file" class="fileInput"
                accept="image/*" :multiple="props.isMultiple"
                @change="previewImage(($event.target as HTMLInputElement).files)"
            />

            <div class="progressBlock" :class="{open: imageListVisible}" >
                <TransitionGroup name="fadeY">
                    <a v-for="(item, i) in imageList" :key="'progress_' + i"
                        class="progressBox" :class="[ item.progress.status, {current: i == 0} ]"
                        @click="(e: Event) => {scrollTo('previewImg_' + i, i, e)}"
                    >
                        <ElSvgIcon :name="(item.status == 'old')? 'description' : 'upload_file'"></ElSvgIcon>
                        <div class="dataBox">
                            <h6 class="fileName ellipsis" :title="item.fileName">File: {{ item.fileName }}</h6>
                            <p v-if="item.status == 'new'" class="size"> {{file.formatSize(item.progress.loaded) }}  /  {{ file.formatSize(item.progress.total) }} </p>
                            <p v-else class="size"> {{ file.formatSize(item.progress.total) }} </p>
                            <span v-if="item.status == 'new'" class="percent">{{ item.progress.progress }}%</span>
                            <span v-else class="percent">Database</span>
                            <!-- <ElSvgIcon v-if="item.status == 'new'" class="upload" name="comment-check"></ElSvgIcon> -->
                            <ElSvgIcon name="delete_forever" class="delete" title="刪除圖片" @click="(e)=>{ deleteImage(item.status, item.index, e)}"></ElSvgIcon>
                            <ElProgress :class="{disabled: item.status === 'old' }" :percent="item.progress.progress" el-width="100%"></ElProgress>
                        </div>
                    </a>
                </TransitionGroup>

                <div class="BtnBox">
                    <ElBtn class="subs" @click="clear">清除圖片</ElBtn>
                </div>

                <div class="triggerImageList" @click="triggerImageListVisible">
                    <ElSvgIcon name="photo_library"></ElSvgIcon>
                </div>
            </div>
        </label>
    </div>
</template>

<style lang="scss">
    .imgUploadBlock {
        position: relative;
        @include setSize(100%, 100%);

        .imgUploadBox {
            @include setFlex();
            background: #e9e9e9;
            @include setSize(100%, 100%);

            border: 5px dashed $colorFont;
            border-radius: 15px;
            // box-shadow: 0 0 3px 1px rgba(0, 0, 0, 0.25),
            //             0 0 3px 1px rgba(0, 0, 0, 0.25) inset;

            cursor: pointer;
            transition: 0.15s $cubic-FiSo;
            overflow: hidden;

            .fileInput {
                @include setSize(100%, 100%);
                cursor: pointer;
                z-index: -1;
                opacity: 0;
            }
            .featuresBlock {
                @include setFlex(center, center, 10px, column);
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%) scale3d(1, 1, 1);

                color: #333;
                letter-spacing: 1px;

                text-align: center;
                text-shadow: 0 0 1px #fff;
                overflow: hidden;
                transition: .15s $cubic-FiSo;
            }
            .previewBlock {
                position: absolute;
                inset: 5px;
                border-radius: 10px;
                overflow-y: auto;
                scroll-snap-type: y mandatory;
                // 卷軸體
                &::-webkit-scrollbar {
                    background: $colorFont;
                    width: 10px;
                    border-radius: 5px;
                }
                // 卷軸底
                &::-webkit-scrollbar-thumb {
                    background: $colorMain;
                    border-radius: 5px;
                    border: 0.5px solid rgba(153, 153, 153, 0.25);
                    // box-shadow: 0 0 10px 2px #20476e;
                }
            }

            &.drop-enter .featuresBlock {
                transform: translate(-50%, -50%) scale3d(0, 0, 0);
            }
            &.drop-enter,
            &:hover {
                border-color: $colorMain;
                .featuresBlock { color: $colorMain; }
                .featureBox .feature {
                    .icon { fill: $colorMain; }
                    .text { color: $colorMain;}
                }
            }
            &.view {
                border: 3px solid $colorMain;
                border-radius: 15px;
            }
        }

        .previewBlock {
            .img {
                scroll-snap-align: start;
                flex-shrink: 0;
                display: block; // 這個很重要 不然是inline 會有lineHeight 等高也會出現卷軸
                @include setSize(100%, 100%);
                // max-width: 100%;
                object-fit: contain;
                object-position: left top;
                + .img { margin: 20px 0 0; }
            }
        }

        .featuresBlock {
            .featureBox {
                @include setFlex();
                gap: 40px;
                .feature {
                    @include setFlex(center, center, 10px, column);
                    .icon {
                        @include setSize(80px, 80px);
                        fill: $colorFont;
                    }
                    .text {
                        color: $colorFont;
                        font-size: 22px;
                        font-weight: bold;
                    }
                }
                .stress {
                    color: $colorSubs;
                }
            }
            .title {
                margin: 20px 0 0;
                font-size: 28px;
            }
            .description {
                font-size: 20px;
            }
        }

        // [-] 檔案列表
        .progressBlock {
            @include setFlex(flex-start, stretch, 10px, column);
            position: absolute;
            // inset: 12px 12px 12px calc(100% - 10px);
            top: 12px;
            bottom: 12px;
            right: 2px;
            // left: 100%;
            width: 0;
            min-width: 0;
            max-width: 435px;

            background: rgba(225, 225, 225, 0.75);
            padding: 0;
            backdrop-filter: blur(5px);

            border-radius: 25px;
            z-index: 1;
            transition: .23s $cubic-FiSo;
            // overflow: hidden;

            .progressBox {
                @include setFlex(flex-start, stretch, 5px);

                background: #f2f2f2ee;
                padding: 0;
                border-radius: 10px;
                border: 0 solid rgba(0, 0, 0, 0.12);
                box-shadow: 0 0 5px 0 rgba(0, 0, 0, 0.12);
                overflow: hidden;
                transition: .23s $cubic-FiSo;
                &.half {
                    border-color: rgba(239, 210, 24, 0.6);
                    .icon { fill: rgba(239, 210, 24, 0.6); }
                    .dataBox {
                        .percent { color: rgba(239, 210, 24, 0.6); }
                    }
                }
                &.success {
                    border-color: rgba(18, 183, 92, 0.6);
                    .icon { fill: rgba(18, 183, 92, 0.6); }
                    .dataBox {
                        .percent { color: rgba(18, 183, 92, 0.85); }
                        .icon.upload { transform: scale3d(1, 1, 1); }
                    }
                }
                &.current {
                    border-color: $colorMain;
                    cursor: default;
                    &:hover {
                        transform: translate3d(0, 0, 0);
                        box-shadow: 0 0 5px 1px rgba(0, 0, 0, 0.25);
                    }
                }
                &:hover {
                    transform: translate3d(0, 0, 0) scale3d(1.01, 1.01, 1);
                    box-shadow: 0 0 10px 1px rgba(49, 114, 110, 0.6);
                }

                .icon { @include setSize(75px, 75px); }
                .dataBox {
                    display: grid;
                    grid-template-areas: "name  icon"
                                        "size  percent"
                                        "progress  progress";
                    grid-template-columns: 1fr  60px;
                    align-items: flex-end;
                    width: calc(100% - 85px);
                    // @include setFlex(flex-end, stretch, 5px, column);

                    .fileName {
                        grid-area: name;
                        color: #666;
                        font-size: 16px;
                    }
                    .size {
                        grid-area: size;
                        color: $colorFont;
                        font-size: 14px;
                    }
                    .percent {
                        grid-area: percent;
                        justify-self: end;
                        color: $colorFont;
                        font-size: 14px;
                    }
                    .icon {
                        grid-area: icon;
                        justify-self: end;
                        @include setSize(30px, 30px);
                        padding: 2px;
                        cursor: pointer;
                        &.upload {
                            transform: scale3d(0, 0, 1);
                        }
                        &.delete {
                            fill: $colorError;
                        }
                    }
                    .el-progress {
                        grid-area: progress;
                        align-self: center;
                    }
                }

            }

            .BtnBox {
                flex: 1;
                @include setFlex(flex-end, flex-end, 10px);
                overflow: hidden;
            }

            &.open {
                right: 12px;
                width: 55%;
                // left: 45%;
                min-width: 400px;

                padding: 20px;
                box-shadow: 0 0 5px 1px rgba(0,0,0,0.25);
                .progressBox {
                    padding: 15px 20px 15px 10px;
                    border-width: 1px;
                    &.current { border-width: 3px; }
                }

                .triggerImageList{
                    top: 40px;
                    width: 50px;
                }
            }
        }

        .triggerImageList {
            position: absolute;
            top: 20px;
            right: 100%;

            background: rgba(225, 225, 225, 0.75);
            @include setSize(35px, 50px);
            padding: 10px;
            border-radius: 15px 0 0 15px;
            overflow: hidden;

            z-index: 1;
            cursor: pointer;
            transition: .2s $cubic-FiSo;

            .icon {
                fill: $colorMain;
                @include setSize(30px, 30px);
            }

            &:hover {
                width: 50px;
                .icon { fill: $colorSubs; }
            }
        }
    }
</style>