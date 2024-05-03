<script setup lang="ts">
    import piniaStore from '@/store';
    const uiuxStore = piniaStore.useUIUXStore;

    export interface iListBar {
        id: number,
        unique_id: number,
        check: boolean;
        image: giImageData;
        title: string;
        tags: {
            id: number;
            title: string;
            background: string;
        }[];
        category: string;
        category_id?: string;
        sort: number;
        disable: boolean;
        created_at?: string | Date;
        updated_at: string | Date;
        [key: string]: any;
    }

    const props = defineProps<{
        item: iListBar;
    }>();

    type tTarget = 'view' | 'copy' | 'delete' | 'favorite';
    const target: Ref<tTarget> = ref('view');

    const route = useRoute();
    // 把route.fullpath list 用info取代  末尾的數字用id取代
    const href = route.fullPath.replace(/list/, 'info').replace(/\d+$/, props.item.id.toString());

    const editHandler = () => {
        uiuxStore.startEdit();
        console.log('editHandler:', uiuxStore.uiuxState.isEdit);
    };
    const leaveEditHandler = () => {
        uiuxStore.endEdit();
        console.log('leaveEditHandler:', uiuxStore.uiuxState.isEdit);
    };
</script>

<template>
    <div class="mole-list-bar" :class="{ selected: item.check }">
        <div class="td check">
            <ElCheckbox v-model="item.check" />
        </div>
        <div class="td image">
            <div class="img-box">
                <img :src="item.image.file || 'no_image'" origin="token" />
            </div>
        </div>
        <div class="td title-box">
            <a v-if="item.link" class="title link"
                :href="`${item.link}`"
            >
               {{ item.title }}
               <ElSvgIcon name="link" />
            </a>
            <span v-else class="title">{{ item.title }}</span>
        </div>
        <div class="td tag-box">
            <div v-for="tag in item.tags"
                class="tag"
                :style="`--color-tag: ${tag.background}`">
                {{ tag.title}}
            </div>
        </div>
        <div class="td category">
            <router-link :to="`${item.category_id}`">
               {{ item.category }}
            </router-link>
        </div>
        <div class="td sort">
            <ElInput class="sort" v-model="item.sort" />
        </div>
        <div class="td date">
            {{ item.updated_at }}
        </div>
        <div class="td disable">
            <ElBtn>
                <template #icon>
                    <ElSvgIcon :name="item.disable ? 'visibility_off' : 'visibility' " />
                </template>
                {{item.disable ? '停用中' : '啟用中'}}
            </ElBtn>
        </div>
        <div class="td features">
            <ElBtn :href>
                <template #icon>
                    <ElSvgIcon name="edit" />
                </template>
                編輯
            </ElBtn>
            <ElSelect
                :options="[]"
                hide-dropdown-icon
                type="feature"
            >
                <template #selected>
                    <ElSvgIcon name="more_horiz" />
                </template>
                <template #option>
                    <q-item clickable @click="editHandler()">
                        <ElSvgIcon name="open_in_new" />
                        <q-item-label>前往頁面</q-item-label>
                    </q-item>
                    <q-item clickable @click="leaveEditHandler()">
                        <ElSvgIcon name="file_copy" />
                        <q-item-label>複製文章</q-item-label>
                    </q-item>
                    <q-item clickable>
                        <ElSvgIcon name="star" />
                        <q-item-label>加入最愛</q-item-label>
                    </q-item>
                    <q-item clickable>
                        <ElSvgIcon name="delete" />
                        <q-item-label>刪除</q-item-label>
                    </q-item>
                </template>
            </ElSelect>
        </div>
    </div>
</template>

<style lang="scss">
    .mole-list-bar {
        display: grid;
        grid-template-areas: "check image title tag category sort date disable feature";
        grid-template-columns: 50px 110px 1fr  180px 140px  80px 170px 150px 180px;

        background: var(--color-extreme-reverse);
        @include setSize(100%, 110px);

        &.thead {
            position: sticky;
            top: -1px;
            background: var(--color-view-block);
            height: 55px;
            border-radius: 15px 15px 0 0;
            z-index: 1;
            .td {
                color: var(--color-extreme);
            }
            @include setRWD(600px) {
                display: none;
            };

            &.stuck {
                border-radius: 0;
                box-shadow: 0 1px 1px 0 rgba(0, 0, 0, .25);
            }
        }
        &.selected {
            background: var(--color-view-block);
            border: 1px solid var(--color-primary-light);
        }
        &:last-child {
            border-radius: 0 0 15px 15px;
        }

        .td {
            @include setFlex(flex-start, center, 8px);
            @include setSize(100%, 100%);
            padding: 10px;
            color: var(--color-text);
            word-break: keep-all;
            &.check { grid-area: check; }
            &.image {
                grid-area: image;
                .img-box {
                    @include setSize(90px, 90px);
                    border: 1px solid var(--color-border-box);
                    border-radius: 8px;
                    overflow: hidden;
                    img { @include setSize(100%, 100%); }
                }
            }
            &.title-box {
                grid-area: title;
                .title {
                    @include setFlex(flex-start, center, 5px);
                    height: 100%;
                    padding: 0;
                    word-break: break-all;
                    transition: .2s $cubic-FiSo;
                    .icon {
                        fill: var(--color-text);
                        transform: translateY(-1px);
                    }
                    &.link:hover {
                        color: var(--color-primary-light);
                        .icon { fill: var(--color-primary-light); }
                    }
                }
            }
            &.tag-box {
                grid-area: tag;
                @include setFlex(flex-start, center, 8px);
                flex-wrap: wrap;
                align-content: center;
                .tag {
                    --color-tag: var(--color-primary-light);
                    --color-tag-text: var(--color-extreme-reverse);

                    height: 25px;
                    padding: 3px 10px;
                    border-radius: 12.5px;
                    background: var(--color-tag);
                    color: var(--color-tag-text);
                    font-size: .75rem;
                }
            }
            &.category { grid-area: category; }
            &.sort {
                grid-area: sort;
                justify-content: center;
            }
            &.date { grid-area: date; }
            &.disable {
                grid-area: disable;
                justify-content: center;
            }
            &.feature { grid-area: feature; }
        }

        .el-btn {
            gap: 5px;
            padding: 8px 10px;
        }

        .el-select,
        .el-input {
            height: 40px;
        }
    }
</style>


