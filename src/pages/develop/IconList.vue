<template>
    <OrgaContentBlock>

        <div class="icon-block">
            <div v-for="(title, i) in iconList"
                :key="`icon${i}`"
                :title
                class="icon-box"
            >
                <ElSvgIcon :name="title" :title @click.capture="copySvgName"/>
            </div>
        </div>

    </OrgaContentBlock>
</template>

<script setup lang="ts">
    import { useClipboard } from '@vueuse/core';
    const { copy, isSupported } = useClipboard();

    import { useQuasar } from 'quasar';
    import notifyComponent from '@/components/mole/notify.vue';
    const $q = useQuasar();

    const iconList = ref<string[]>([]);

    const copySvgName = (event: Event) => {
        if (!isSupported) {
            $q.dialog({
                component: notifyComponent,
                componentProps: {
                    title: '錯誤！',
                    message: `您的瀏覽器不支援複製功能或未開通權限。`,
                    duration: 1500
                },
            }).onCancel(() => {
                return false;
            })
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

                copy(svgName);
                $q.dialog({
                    component: notifyComponent,
                    componentProps: {
                        type: 'success',
                        title: '複製成功！',
                        message: `'${svgName}'已複製到剪貼簿`,
                        duration: 2000
                    },
                });
            }
        }
    };

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
</script>

<style lang="scss" scoped>
    .icon-block {
        --color-btn-background: #F5F5F5;

        @include setFlex(flex-start, flex-start, 5px);
        flex-wrap: wrap;
        width: 100%;
        padding-top: 30px;
        .icon-box {
            background: var(--color-btn-background);
            width: 8%;
            aspect-ratio: 1/1;
            border: 1px solid var(--color-border-box);
            border-radius: 10px;

            cursor: pointer;
            transition: 0.3s $cubic-FiSo;

            .icon {
                @include setSize(100%, 100%);
                padding: 20px;
                fill: var(--color-text);
            }

            &:hover {
                background: var(--color-primary-light);
                .icon {
                    fill: var(--color-extreme-reverse);
                }
            }
        }
    }
</style>