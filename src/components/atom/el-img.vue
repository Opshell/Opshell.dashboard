<script setup lang="ts">
    import { file } from '@/hooks/opshellLibary';

    interface iProps {
        src: string;
        origin?: 'public' | 'src' // public: 靜態資源, src: 動態資源(會編譯)
    }
    const props = withDefaults(defineProps<iProps>(), {
        src: '/assets/images/No_Image.jpg',
        origin: 'public'
    });

    const imgUrl = computed(() => {
        if (props.src !== '') {
            if(props.origin === 'public') {
                return props.src;
            } else {
                if (file.getAssetsImageUrl(props.src) !== file.getAssetsImageUrl('')) {
                    return file.getAssetsImageUrl(props.src);
                } else {
                    return '/assets/images/No_Image.jpg';
                }
            }
        } else {
            return '/assets/images/No_Image.jpg';
        }
    });
</script>

<template>
    <img class="img" :src="imgUrl" />
</template>

<style lang="scss"></style>