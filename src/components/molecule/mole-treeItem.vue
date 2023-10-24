<script setup lang="ts">
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

    const emit = defineEmits(['calcHeight']);

    // const list: Ref<iMenu[]> = ref(props.menu);
    const boxHeight = ref(0);
    const optionHeight = 40;

    const list = computed(() => { // 這樣只是淺拷貝
        props.menu.forEach((el) => {
            el.boxHeight = 0;
        });toggleSubmenu

        return props.menu;
    });

    // --- methods ---
    // 開啟子層
    const toggleSubmenu = (i: number) => {
        list.value[i].hide_sub = !list.value[i].hide_sub; // hide_sub == 1 的時候，是收闔的

        // if (list.value[i].hide_sub) {
        //     list.value[i].boxHeight = 0;
        // } else {
        //     list.value[i].boxHeight = list.value[i].child.length * optionHeight;
        // }
    };

    /** 回拋Height
     * @param {*} boxh  // 盒子高度
     */
    const calcHeight = (i: number, boxh: number) => {
        console.log('calcHeight', i, boxh);
        list.value[i].boxHeight = Number(list.value[i].boxHeight) + Number(boxh);
        if (props.depth != 0) {
            emit('calcHeight', boxh);
        }
    };

    // 遞迴關閉下層選單
    const rcsCloseChild = (list: iMenu[]) => {
        list.forEach((el) => {
            if (el.child) {
                el.hide_sub = true;
                // el.boxHeight = 0;
                rcsCloseChild(el.child);
            }
        });
    };

    // 監聽prop 要用函式丟
    // watch(
    //     () => props.menu,
    //     (val: iMenu[]) => {
    //         list.value = val;
    //     },
    //     { deep: true },
    // );

    // 上層關閉時，觸發遞進關閉下層
    watch(
        () => props.hide_sub,
        (val) => {
            if (val) {
                rcsCloseChild(list.value);
            }

            // 不等於0就進來
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
        <div class="linkBlock" v-if="item.child" :class="{ box: item.child.length > 0, open: !item.hide_sub, fitBar: depth == 0 }">
            <div class="link" :style="{ 'padding-left': depth * 32 + 'px' }" @click="toggleSubmenu(i)">
                <ElSvgIcon class="icon" :name="item.icon ? item.icon : 'folder'" />
                <span class="text">{{ item.title }}</span>
                <ElSvgIcon class="icon" :name="item.hide_sub ? 'square-plus' : 'square-minus'" />
            </div>
            <div class="linkBox" :style="{ height: item.boxHeight + 'px' }">
                <div class="boxLine" :style="{ 'left': (depth + 1) * 32 - 22 + 'px' }"></div>
                <MoleTreeItem :menu="item.child" :depth="depth + 1"
                    :hide_sub="item.hide_sub ? true : false"
                    :child_count="item.child.length || 0"
                    @calc-height="calcHeight(i, $event)"
                />
            </div>
        </div>
        <router-link v-else class="link" :class="{ fitBar: depth == 0 }"
            :to="item.link" :key="'i_' + item.id"
            :depth="depth" :style="{ 'padding-left': depth * 32 + 'px' }"
        >
            <ElSvgIcon class="icon" :name="item.icon" />
            <span class="text">{{ item.title }}</span>
        </router-link>
    </template>
</template>

<style lang="scss">
    .sideMenu{
        .linkBlock {
            .linkBox {
                position: relative;
                // background: rgba(0, 0, 0, 0.2);
                height: 0;
                // box-shadow: 0 2px 15px 0 rgba(0, 0, 0, 0.3) inset;
                cursor: pointer;

                overflow: hidden;
                transition: 0.15s $cubic-FiSo;

                .boxLine {
                    position: absolute;
                    top: 0;
                    background: $colorFont;
                    @include setSize(3px, calc(100% - 30px));
                    border-radius: 1.5px;
                }

                .link {
                    .icon:first-child::before {
                        content: '';
                        position: absolute;
                        top: 0;
                        left: -22px;
                        border-left: 3px solid $colorFont;
                        border-bottom: 3px solid $colorFont;
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

            color: $colorFont;

            transition: background-color 0.5s $cubic-FiSo 0.2s;
            cursor: pointer;
            overflow: hidden;

            &::after {
                content: '';
                position: absolute;
                top: 0;
                right: 0;
                background: $colorBack;
                @include setSize(0, 100%);
                border-radius: 10px 0 0 10px;
                transition: .2s $cubic-FiSo;
            }

            .icon {
                flex-shrink: 0;
                @include setSize(22px, 22px);
                fill: $colorFont;
            }
            .text {
                flex: 1;
                font-size: 20px;
                text-align: left;
            }

            &:hover {
                color: $colorSubs;
                .icon { fill: $colorSubs; }
                &::after { width: 15px; }
            }

            &:active {
                // color: $colorSubs;
                // fill: $colorSubs;
                // background-color: #2c474e;
                // transition: background-color 0.15s $cubic-FiSo;
            }

            &.router-link-exact-active {
                color: $colorMain;
                &::after {
                    width: 40px;
                }
                .icon { fill: $colorMain; }
            }
        }
    }
</style>
