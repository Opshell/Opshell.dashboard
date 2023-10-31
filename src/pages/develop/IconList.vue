<template>
    <div class="iconBlock">
        <div v-for="(item, i) in iconList" class="iconBox" :key="`icon${i}`" >
            <div class="box" :title="item">
                <ElSvgIcon :name="item" :title="item" @click.capture="copySvgName"/>
            </div>
            <!-- <div class="name">{{item}}</div> -->
        </div>
    </div>
</template>

<script setup lang="ts">
    import { useClipboard } from '@vueuse/core';
    const { copy, isSupported } = useClipboard();

    import useGlobalProperties from '@/hooks/useGlobalProperties';
    const proxy = useGlobalProperties();

    const iconList = ref<string[]>([]);

    onMounted(() => {
        iconList.value = [];

        const spriteSvg = document.getElementById('__svg__icons__dom__');
        if (spriteSvg != null) {
            let svgList = Array.from(spriteSvg.children);

            svgList.forEach((svgDom) => {
                iconList.value.push(svgDom.id);
            });
        }
    });

    const copySvgName = (event: Event) => {
        if (!isSupported) {
            proxy.$notify('error', '錯誤', '您的瀏覽器不支援複製功能', 1500).then(() => { return false} );
        } else {
            // 取得事件的目標元素。
            const target = event.target as HTMLElement;
            // 取得目標元素的父元素的 `title` 屬性。

            let svgName = null;
            if (target.tagName == 'use') { // use
                svgName = target.parentElement?.parentElement?.title;
            } else { // svg
                svgName = target.parentElement?.title;
            }

            // 如果 `title` 屬性不為空，則將其複製到剪貼板。
            if (svgName != null) {
                // navigator.clipboard.writeText(svgName);
                // alert(`'${svgName}'已複製到剪貼簿`);

                copy(svgName);
                proxy.$notify('success', '成功', `'${svgName}'已複製到剪貼簿`, 2000);
            }
        }
    };
</script>

<style lang="scss" scoped>
    .iconBlock {
        display: flex;
        flex-wrap: wrap;
        align-items: flex-start;
        justify-content: space-between;
        width: 100%;
        gap: 15px;
        .iconBox {
            flex-direction: column;
            background: $colorMain;
            width: 10%;
            border-radius: 10px;
            cursor: pointer;
            transition: 0.3s $cubic-FiSo;

            .box {
                position: relative;
                display: flex;
                flex-direction: column;
                width: 100%;
                @include setProportion();
            }
            .icon {
                position: absolute;
                @include setSize(100%, 100%);
                padding: 20px;
                box-sizing: border-box;
                fill: #fff;
            }
            .name {
                width: 100%;
                padding: 8px;
                box-sizing: border-box;
                word-break: break-all;
            }

            &:hover {
                fill: #ccc;
            }
        }
    }
</style>
