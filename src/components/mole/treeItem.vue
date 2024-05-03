<script setup lang="ts">
    import MoleTreeItem from '@/components/mole/treeItem.vue';

    export interface iMenu {
        id: number;
        parent_id: number;
        icon: string;
        title: string;
        link: string;
        hide_sub: boolean;
        stage?: string;
        child?: iMenu[];
        depath_id?: string;
        checked?: boolean;
        boxHeight?: number;
    }

    interface iProps {
        menu: Array<iMenu>;
        child_count: number;
        hide_sub?: boolean;
        depth?: number;
    }
    const props = withDefaults(defineProps<iProps>(), {
        depth: 0,
    });
    const emit = defineEmits(['calcHeight', 'openSubmenu']);

    const route = useRoute();

    const optionHeight = 40;
    const list = computed(() => { // 這樣只是淺拷貝
        props.menu.forEach((el) => {
            el.boxHeight = el.boxHeight || 0; // 記得繼承之前的狀態

            // 正則匹配 `el.link` 後面必須接任何數字[頁數、id 等等]
            const reg = new RegExp(`^${el.link}\/\\d+$`);

            // 如果目前路由是這個，就展開
            if (el.link !== ''&& (
                route.fullPath == el.link ||
                reg.test(route.fullPath)
            )) {
                nextTick(()=>{
                    emit('openSubmenu');
                });
            }
        });

        return props.menu;
    });

    //[M] --- methods ---
    // 開關子層
    const toggleSubmenu = (i: number) => {
        list.value[i].hide_sub = !list.value[i].hide_sub; // hide_sub == 1 的時候，是收闔的
    };
    const openSubmenu = (i: number) => {
        list.value[i].hide_sub = false;
    };

    /** 回拋Height
     * @param {*} boxh  // 盒子高度
     */
    const calcHeight = (i: number, boxh: number) => {
        list.value[i].boxHeight = Number(list.value[i].boxHeight) + Number(boxh);
        if (props.depth != 0) { // 上拋
            emit('calcHeight', boxh);
        }
    };

    // 遞迴關閉下層選單
    const rcsCloseChild = (list: iMenu[]) => {
        list.forEach((el) => {
            if (el.child) {
                el.hide_sub = true;
                rcsCloseChild(el.child);
            }
        });
    };

    // 上層關閉時，觸發遞進關閉下層
    watch(
        () => props.hide_sub,
        (val) => {
            if (val) { // 關閉自己和下層
                rcsCloseChild(list.value);
            }

            // 上拋 增、減的尺寸
            if (props.child_count) {
                // 判斷開或關
                emit('calcHeight', !val ? props.child_count * optionHeight : -props.child_count * optionHeight);
            }
        },
        { deep: true },
    );
</script>

<template>
    <template v-for="(item, i) in list" :key="i">
        <div v-if="item.child"
            class="link-block"
            :class="{
                box: item.child.length > 0,
                open: !item.hide_sub,
                fitBar: depth == 0
            }"
        >
            <div class="link"
                :style="{ 'padding-left': depth * 32 + 'px' }"
                @click="toggleSubmenu(i)"
            >
                <ElSvgIcon class="icon" :name="item.icon ? item.icon : item.hide_sub ? 'folder' : 'folder_open'" />
                <span class="text">{{ item.title }}</span>
                <ElSvgIcon class="icon" :name="item.hide_sub ? 'add_box' : 'indeterminate_check_box'" />
            </div>
            <div class="link-box"
                :style="{ height: item.boxHeight + 'px' }"
            >
                <div class="box-line"
                    :style="{ 'left': (depth + 1) * 32 - 22 + 'px' }"
                ></div>
                <MoleTreeItem
                    :menu="item.child"
                    :child_count="item.child.length"
                    :depth="depth + 1"
                    :hide_sub="item.hide_sub ? true : false"
                    @calcHeight="calcHeight(i, $event)"
                    @openSubmenu="openSubmenu(i)"
                />
            </div>
        </div>

        <router-link v-else
            class="link"
            :class="{ fitBar: depth == 0 }"
            :to="item.link"
            :key="'i_' + item.id"
            :depth="depth"
            :style="{ 'padding-left': depth * 32 + 'px' }"
        >
            <ElSvgIcon class="icon" :name="item.icon" />
            <span class="text">{{ item.title }}</span>
        </router-link>
    </template>
</template>

<style lang="scss">
    .link-block {
        .link-box {
            position: relative;
            height: 0;
            cursor: pointer;
            transition: .15s $cubic-FiSo;
            overflow: hidden;
            .box-line {
                position: absolute;
                top: 0;
                background: var(--color-text);
                @include setSize(3px, calc(100% - 27px));
                border-radius: 1.5px;
            }

            .link {
                .icon:first-child::before {
                    content: '';
                    position: absolute;
                    top: 3px;
                    left: -22px;
                    border-left: 3px solid var(--color-text);
                    border-bottom: 3px solid var(--color-text);
                    @include setSize(14px, 9px);
                    border-radius: 0 0 0 15px;
                }
            }
        }
    }

    .link {
        position: relative;
        @include setFlex(space-between, center, 10px);
        @include setSize(100%, 40px);
        padding: 5px 20px;
        color: var(--color-text);
        transition: background-color 0.5s $cubic-FiSo 0.2s;
        cursor: pointer;
        overflow: hidden;

        // &::after {
        //     content: '';
        //     position: absolute;
        //     top: 0;
        //     right: 0;
        //     background: var(--color-border-box);
        //     @include setSize(0, 100%);
        //     border-radius: 20px 0 0 20px;
        //     transition: .2s $cubic-FiSo;
        //     z-index: -1;
        // }

        .icon {
            flex-shrink: 0;
            @include setSize(22px, 22px);
            fill: var(--color-text);
        }
        .text {
            flex: 1;
            font-size: 20px;
            text-align: left;
        }

        &:hover {
            color: var(--color-primary-light);
            .icon { fill: var(--color-primary-light); }
            &::after { width: 100%; }
        }

        &.router-link-active,
        &.router-link-exact-active {
            color: var(--color-primary);
            &::after { width: 25px; }
            .icon { fill: var(--color-primary); }
        }
    }
</style>
