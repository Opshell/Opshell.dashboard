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

    type tComponentStatus = 'empty' | 'preview' | 'uploading' | 'uploaded';

    const componentStatus : Ref<tComponentStatus> = ref('empty'); // 目前狀態
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

    watch(imageList, (newVal) => {
        if (newVal.length > 0) {
            componentStatus.value = 'preview';
        } else {
            componentStatus.value = 'empty';
        }
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
            componentStatus.value = 'uploading';


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
                componentStatus.value = 'uploaded';
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
        document.querySelector('.file-input')?.setAttribute('value', ''); // 清除file input的值
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
        const el = document.querySelector(`.progress-block > .progress-box:nth-child(${i + 1})`) as HTMLElement;

        if(!el.classList.contains('current')){
            // 清空current
            document.querySelectorAll('.progress-box.current').forEach((item) => {
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
            const fileInput = eTarget.querySelector('.file-input') as HTMLInputElement;
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
    <div class="img-upload-preview-block" :class="componentStatus">
        <div class="target-block">
            <!-- <div class="BtnBox">
                <ElBtn class="subs" @click="clear">清除圖片</ElBtn>
            </div> -->

            <!-- <div class="trigger-image-list" @click="triggerImageListVisible">
                <ElSvgIcon name="arrow_drop_up"></ElSvgIcon>
            </div> -->
        </div>

        <div v-if="imageList.length > 0" class="preview-block">
            <TransitionGroup name="fadeY">
                <a v-for="(item, i) in imageList" :key="'progress_' + i"
                    class="preview-box" :class="[ item.progress.status, {current: i == 0} ]"
                    @click="(e: Event) => {scrollTo('previewImg_' + i, i, e)}"
                >
                    <!-- <ElSvgIcon :name="(item.status == 'old')? 'description' : 'upload_file'"></ElSvgIcon> -->

                    <ElImg :key="'previewImg_' + i"
                        :id="'previewImg_'+i"
                        :src="item.preview"
                        :origin="item.status == 'old'? 'token' : 'public'"

                        :ref="el => imageDomList.push(el)"
                    />

                    <div class="progress-box">
                        <h6 class="fileName ellipsis" :title="item.fileName">File: {{ item.fileName }}</h6>
                        <p v-if="item.status == 'new'" class="size"> {{file.formatSize(item.progress.loaded, 0) }}  /  {{ file.formatSize(item.progress.total, 0) }} </p>
                        <p v-else class="size"> {{ file.formatSize(item.progress.total, 0) }} </p>
                        <span v-if="item.status == 'new'" class="percent">{{ item.progress.progress }}%</span>
                        <span v-else class="percent">Database</span>
                        <!-- <ElSvgIcon v-if="item.status == 'new'" class="upload" name="comment-check"></ElSvgIcon> -->
                        <ElSvgIcon name="delete_forever" class="delete" title="刪除圖片" @click="(e)=>{ deleteImage(item.status, item.index, e)}"></ElSvgIcon>
                        <ElProgress :class="{disabled: item.status === 'old' }" :percent="item.progress.progress" el-width="100%"></ElProgress>
                    </div>
                </a>
            </TransitionGroup>
        </div>

        <label class="img-upload-box" :class="{view: imageList.length > 0}" ref="uploadArea">
            <section v-if="imageList.length == 0" class="features-block" :class="{hidden: sAddition}">
                <ul class="feature-box">
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

                <p v-if="!sAddition" class="description">Either <strong class="emphasis">Drop</strong> or <strong class="emphasis">Click</strong> this area to upload an image.</p>
            </section>

            <input type="file" class="file-input"
                accept="image/*" :multiple="props.isMultiple"
                @change="previewImage(($event.target as HTMLInputElement).files)"
            />
        </label>
    </div>
</template>

<style lang="scss">
    .img-upload-preview-block {
        position: relative;
        @include setSize(100%, 300px);
        max-width: 450px;
        border: 2px dashed var(--color-text-light);
        border-radius: 5px;

        // [-] 檔案列表
        .preview-block {
            @include setFlex(flex-start, stretch, 10px);

            backdrop-filter: blur(5px);
            @include setSize(100%, 0);
            padding: 5px;
            border-radius: 5px 0 5px 5px;

            z-index: 1;
            transition: .23s $cubic-FiSo;
            overflow-x: auto;
            scroll-snap-type: x mandatory;

            .preview-box {
                scroll-snap-align: start;
                flex-shrink: 0;
                @include setFlex(flex-start, stretch, 5px, column);
                background: var(--color-view-block);
                @include setSize(100%, 100%);
                padding: 10px;
                border: 1px solid rgba(0, 0, 0, 0.12);
                border-radius: 5px;
                box-shadow: 0 0 3px 0 rgba(0, 0, 0, 0.12);
                overflow: hidden;
                transition: .23s $cubic-FiSo;

                .el-img {
                    flex: 1 0 auto;
                    // display: block; // 這個很重要 不然是inline 會有lineHeight 等高也會出現卷軸
                    @include setFlex();
                    background: var(--color-text-light);
                    width: 100%;
                    padding: 8px;
                    border-radius: 5px;
                    img {
                        object-fit: contain;
                        object-position: 50% 50%;
                    }
                }

                .progress-box {
                    display: grid;
                    grid-template-areas: "name  icon"
                                        "size  percent"
                                        "progress  progress";
                    grid-template-columns: 1fr  45px;
                    align-items: flex-end;
                    width: 100%;
                    padding: 5px 3px;

                    .fileName {
                        grid-area: name;
                        align-self: start;
                        color: #666;
                        font-size: 1rem;
                        line-height: 1.5rem;
                    }
                    .size {
                        grid-area: size;
                        margin: 0;
                        color: var(--color-text);
                        font-size: .875rem;
                    }
                    .percent {
                        grid-area: percent;
                        justify-self: end;
                        color: var(--color-text);
                        font-size: .875rem;
                    }
                    .icon {
                        grid-area: icon;
                        justify-self: end;
                        @include setSize(30px, 30px);
                        padding: 2px;
                        cursor: pointer;
                        transform: translate3d(3px, -3px, 0);
                        &.upload {
                            transform: scale3d(0, 0, 1);
                        }
                        &.delete {
                            fill: var(--color-error);
                        }
                    }
                    .el-progress {
                        grid-area: progress;
                        align-self: center;
                    }
                }

                &.half {
                    border-color: rgba(239, 210, 24, 0.6);
                    .icon { fill: rgba(239, 210, 24, 0.6); }
                    .data-box {
                        .percent { color: rgba(239, 210, 24, 0.6); }
                    }
                }
                &.success {
                    border-color: rgba(18, 183, 92, 0.6);
                    .icon { fill: rgba(18, 183, 92, 0.6); }
                    .data-box {
                        .percent { color: rgba(18, 183, 92, 0.85); }
                        .icon.upload { transform: scale3d(1, 1, 1); }
                    }
                }
                &.current {
                    border-color: var(--color-primary);
                    cursor: default;
                    // &:hover {
                    //     box-shadow: 0 0 5px 1px rgba($color: var(--color-primary), $alpha: 1);
                    // }
                }
                &:hover {
                    box-shadow: 0 0 5px 1px rgba(0, 0, 0, 0.25);
                }
            }

            .BtnBox {
                flex: 1;
                @include setFlex(flex-end, flex-end, 10px);
                overflow: hidden;
            }


            /* 卷軸設定 */
            &::-webkit-scrollbar {
                background: var(--color-text-light);
                @include setSize(8px, 8px);
                border-radius: 4px;
                cursor: pointer;
                transition: .2s $cubic-FiSo;
                &:hover {
                    background: var(--color-primary-dark);
                }
            }
            &::-webkit-scrollbar-thumb {
                background: var(--color-primary);
                border-radius: 4px;

            }
        }

        .img-upload-box {
            @include setFlex();
            background: var(--color-border-box);
            @include setSize(100%, 100%);

            cursor: pointer;
            transition: 0.15s $cubic-FiSo;
            overflow: hidden;

            .file-input {
                @include setSize(100%, 100%);
                cursor: pointer;
                z-index: -1;
                opacity: 0;
            }
            .features-block {
                @include setFlex(center, center, 10px, column);
                position: absolute;
                top: 0;
                left: 0;
                @include setSize(100%, 100%);
                padding: 1.25rem;

                color: #333;
                letter-spacing: 1px;

                text-align: center;
                text-shadow: 0 0 1px #fff;
                overflow: hidden;
                transition: .15s $cubic-FiSo;
            }

            &.drop-enter .features-block {
                transform: translate(-50%, -50%) scale3d(0, 0, 0);
            }
            &.drop-enter,
            &:hover {
                border-color: var(--color-primary-light);
                .features-block { color: var(--color-primary-light); }
                .feature-box .feature {
                    .icon { fill: var(--color-primary-light); }
                    .text { color: var(--color-primary-light);}
                }
            }
            &.view {
                border: 3px solid var(--color-primary);
                border-radius: 8px;
            }
        }



        .features-block {
            .feature-box {
                @include setFlex();
                gap: 25px;
                .feature {
                    @include setFlex(center, center, 10px, column);
                    .icon {
                        @include setSize(65px, 65px);
                        fill: var(--color-text);
                    }
                    .text {
                        color: var(--color-text);
                        font-size: 1.125rem;
                        font-weight: 500;
                    }
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



        .trigger-image-list {
            position: absolute;
            right: 0;
            bottom: 100%;

            background: rgba(230, 230, 230, 0.8);
            backdrop-filter: blur(5px);
            @include setSize(40px, 20px);
            border-radius: 5px 5px 0 0;
            overflow: hidden;

            z-index: 1;
            cursor: pointer;
            transition: .2s $cubic-FiSo;

            .icon {
                top: 50%;
                fill: var(--color-primary);
                @include setSize(40px, 40px);
                transform: translateY(calc(-50% + 2px));
            }

            &:hover {
                // width: 50px;
                .icon { fill: var(--color-primary-light); }
            }
        }


        &.preview {
            padding: 5px;
            .preview-block {
                height: 100%;
            }

            .img-upload-box {
                @include setSize();
                border: 0;
                border-radius: 0;
            }
        }
        &.uploading {
            .preview-block {
                height: 100%;
                flex-direction: column;
                .preview-box {
                    flex-direction: row;
                    height: auto;
                    padding: 5px;
                    .el-img {
                        padding: 3px;
                        width: 70px;
                        height: 70px;
                        img {
                            height: 100%;
                            object-fit: cover;
                        }
                    }
                    .progress-box {
                        padding: 0;
                    }
                }
            }
            .img-upload-box {
                @include setSize();
                border: 0;
                border-radius: 0;
            }
        }
    }
</style>

