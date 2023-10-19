<script setup lang="ts">
    interface iProps {
        album: {
            id: number;
            file: string;
        }[] | null;
    }
    const props = withDefaults(defineProps<iProps>(), {
        album: null,
    });

    const albums = computed(() => {
        let imgList: iProps['album'] = [];
        if (props.album) {
            imgList = props.album;
        }

        return imgList;
    });
</script>

<template>
    <div class="albumBlock">
        <div v-for="(photo, i) in albums" class="photo" :key="'photo_'+i">
            <ElImg :src="photo.file" />
        </div>

        <MoleImgUpload class="photo" :sAddition="true"></MoleImgUpload>
    </div>
</template>

<style lang="scss">
    .albumBlock {
        @include setFlex(flex-start, flex-start, 20px);
        flex-wrap: wrap;
        .photo {
            background: #e3e3e3;
            width: calc(25% - 15px);
            border-radius: 20px;
            aspect-ratio: 1 / 1;
            overflow: hidden;
        }
    }
</style>