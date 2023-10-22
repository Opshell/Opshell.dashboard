<template>
    <div class="iconBlock">
        <div v-for="(item, i) in iconList" class="iconBox" :key="`icon${i}`">
            <div class="box" :title="item">
                <ElSvgIcon :name="item" :title="item" @click.stop="copySvgName" />
            </div>
            <!-- <div class="name">{{item}}</div> -->
        </div>
    </div>
</template>

<script setup lang="ts">
    import { Ref } from 'vue';

    const iconList: Ref<string[]> = ref([]);

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
        // 取得事件的目標元素。
        const target = event.target as HTMLElement;
        // 取得目標元素的父元素的 `title` 屬性。

        const svgName = target.parentElement?.title;
        // 如果 `title` 屬性不為空，則將其複製到剪貼板。
        if (svgName != null) {
            navigator.clipboard.writeText(svgName);

            alert(`'${svgName}'已複製到剪貼簿`);

        }
    };
</script>

<style lang="scss" scoped>
    .iconBlock {
        @include setFlex(flex-start, flex-start, 10px);
        flex-wrap: wrap;
        background: $colorBlock;
        width: 100%;
        padding: 20px;
        border-radius: 20px;
        .iconBox {
            background: $colorMain;
            width: 9%;
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
