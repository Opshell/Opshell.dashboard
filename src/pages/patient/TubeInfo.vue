<script setup lang="ts">
    import { getData } from '@/hooks/useApi';

    const route = useRoute();

    const realImg = ref(false); // 原理圖的modal開關狀態
    const setRealImg = (value: boolean) => {
        realImg.value = value;
    };
    // const markList = ref([]);
    // getData(`/map/patient/real-img-mark-list?patient_id=${route.params.pid}`).then((res) => {
    //     console.log(res);
    //     markList.value = res?.data;
    // });

    const vascularImgs = ref(false); // 原理圖的modal開關狀態
    const setVascularImgs = (value: boolean) => {
        vascularImgs.value = value;
    };
    const album = ref([]);
    getData(`/map/patient/vascular?patient_id=${route.params.pid}`).then((res) => {
        console.log(res);
        album.value = res?.data;
    });



    const schematics = ref(false); // 原理圖的modal開關狀態
    const setSchematics = (value: boolean) => {
        schematics.value = value;
    };
</script>

<template>
    <div class="tubeBlock">
        <div class="imgBlock">
            <figure class="imgBox">
                <ElImg src="/upload/tube_pic.png" @click="setRealImg(true)"></ElImg>
                <figcaption class="title">病患實際手部圖片</figcaption>
            </figure>

            <OrgaModal title="病患實際手部圖片" :open="realImg" @close="setRealImg(false)">
                <OrgaImgMark />
            </OrgaModal>
        </div>
        <div class="imgBlock">
            <figure class="imgBox">
                <ElImg src="/upload/ct.png" @click="setVascularImgs(true)"></ElImg>
                <figcaption class="title">PTA狹窄處(血管攝影圖)</figcaption>
            </figure>

            <OrgaModal title="PTA狹窄處(血管攝影圖)" :open="vascularImgs" @close="setVascularImgs(false)">
                <OrgaAlbum :album="album" />
            </OrgaModal>
        </div>
        <div class="imgBlock">
            <figure class="imgBox">
                <ElImg src="/upload/cycle.png" @click="setSchematics(true)"></ElImg>
                <figcaption class="title">手術原圖</figcaption>
            </figure>

            <OrgaModal title="手術原圖" :open="schematics" @close="setSchematics(false)">
                <MoleImgUpload />
            </OrgaModal>
        </div>
    </div>
</template>

<style lang="scss" scoped>
    .tubeBlock {
        @include setFlex(space-between, flex-start, 25px);
        .imgBlock {
            background: #e3e3e3;
            width: 100%;
            aspect-ratio: 106 / 76;
            padding: 30px;
            border-radius: 40px;
            overflow: hidden;

            .imgBox {
                position: relative;
                @include setSize(100%, 100%);

                .img {
                    position: relative;
                    width: 100%;
                    aspect-ratio: 23 / 15;
                    border: 0 solid $colorMain;
                    border-radius: 20px;
                    cursor: pointer;
                    filter: grayscale(.3);
                    transition: .1s $cubic-FiSo;
                    z-index: 1;
                    &:hover {
                        border-width: 5px;
                        filter: grayscale(0);
                    }
                }

                .title {
                    color: #444;
                    font-size: 18px;
                    text-align: center;
                }
            }
        }
    }
</style>
