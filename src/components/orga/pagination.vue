<script setup lang="ts">
    import { obj } from '@/hooks/utilityFunctions';

    interface iProps {
        lastPage: number;
        showPageSize?: number; // 顯示多少個頁碼
        showNext?: boolean;
        showPrevious?: boolean;
        showOmit?: boolean;
        showJump?: boolean;
    }
    const props = withDefaults(defineProps<iProps>(), {
        lastPage: 1,
        showPageSize: 5,
        showNext: true,
        showPrevious: true,
        showOmit: false, // 省略符號
        showJump: false, // 跳轉頁面
    });

    const route = useRoute(); // 查看路由
    const router = useRouter(); // 操作路由

    const compCurrentPage = computed(() => Number(route.params.page) || 1);

    const morePrev = computed(() => compCurrentPage.value > 3);
    const moreNext = computed(() => compCurrentPage.value < props.lastPage - 2);

    // 一次只顯示 props.showPageSize 個頁碼
    // 用pageList (總共有幾頁) lastPage(最後一頁是多少) currentPage(目前頁面) 來計算
    // 目前頁碼在中間的話，就顯示前後各兩個頁碼
    const pageList = computed(() => {
        const pageList = [];
        const lastPage = props.lastPage;
        const currPage = compCurrentPage.value;

        if (lastPage <= props.showPageSize) {
            // 如果總頁數小於等於showPageSize，直接列出所有頁碼
            for (let i = 1; i <= lastPage; i++) {
                pageList.push(i);
            }
        } else {
            const halfShowPageSize = Math.floor(props.showPageSize / 2);

            if (currPage <= halfShowPageSize + 1) {
                for (let i = 1; i <= props.showPageSize; i++) {
                    pageList.push(i);
                }
            } else if (currPage >= lastPage - halfShowPageSize) {
                for (let i = lastPage - props.showPageSize + 1; i <= lastPage; i++) {
                    pageList.push(i);
                }
            } else if (props.showPageSize % 2 === 0) {
                // 在中間偶數就靠前
                for (let i = currPage - halfShowPageSize + 1; i <= currPage + halfShowPageSize; i++) {
                    pageList.push(i);
                }
            } else {
                // 在中間奇數就前後加一半
                for (let i = currPage - halfShowPageSize; i <= currPage + halfShowPageSize; i++) {
                    pageList.push(i);
                }
            }
        }

        return pageList;
    });

    const emit = defineEmits<{
        (e: 'jumpRouter'): void;
    }>();

    // 跳轉頁面
    const goto = (page: number) => {
        if (page === compCurrentPage.value) return;

        page = page > 0 ? page : 1;
        page = page <= props.lastPage ? page : props.lastPage;

        const targetName = route.name as string;
        let params = obj.deepCopy(route.params);
        params.page = page;

        emit('jumpRouter');
        router.push({
            name: targetName,
            params,
            query: route.query,
        });
    };

    const jumpPageNumber: Ref<number> = ref(compCurrentPage.value); // 跳轉頁面的頁碼
    const pageJumper = () => {
        if (jumpPageNumber.value > 0 && jumpPageNumber.value != compCurrentPage.value) {
            goto(jumpPageNumber.value);
        }
    };

    watch(
        () => compCurrentPage.value,
        () => {
            jumpPageNumber.value = compCurrentPage.value;
        },
    );
</script>

<template>
    <ul class="orga-pagination-block">
        <li v-if="showPrevious" class="orga-pagination" :class="{ hide: compCurrentPage == 1 }">
            <ElBtn @click="goto(compCurrentPage - 1)">
                <ElSvgIcon name="chevron_left" />
            </ElBtn>
        </li>

        <li class="orga-pagination" :class="{ current: compCurrentPage === 1 }">
            <ElBtn @click="goto(1)">1</ElBtn>
        </li>

        <li v-if="showOmit" class="omit prev" :class="{ show: morePrev }">...</li>

        <template v-for="pageNumber in pageList" :key="'page_' + pageNumber">
            <li v-if="pageNumber != 1 && pageNumber != lastPage" class="orga-pagination" :class="{ current: pageNumber === compCurrentPage }">
                <ElBtn @click="goto(pageNumber)">
                    {{ pageNumber }}
                </ElBtn>
            </li>
        </template>

        <li v-if="showOmit" class="omit next" :class="{ show: moreNext }">...</li>

        <li v-if="lastPage > 1" class="orga-pagination" :class="{ current: compCurrentPage === lastPage }">
            <ElBtn @click="goto(lastPage)">
                {{ lastPage }}
            </ElBtn>
        </li>

        <li v-if="showNext" class="orga-pagination" :class="{ hide: compCurrentPage == lastPage }">
            <ElBtn @click="goto(compCurrentPage + 1)">
                <ElSvgIcon name="chevron_right" />
            </ElBtn>
        </li>

        <li v-if="showJump" class="page-jumper">
            <input class="input" type="number" min="1" :max="lastPage" v-model="jumpPageNumber" @keyup.enter="pageJumper" />
            <ElSvgIcon class="location" name="subdirectory_arrow_right" @click.enter="pageJumper" />
        </li>
    </ul>
</template>

<style lang="scss">
    .orga-pagination-block {
        @include setFlex(center, center, 1px);
        padding: 0;
        list-style: none;

        .orga-pagination {
            @include setSize(auto, 45px);
            min-width: 50px;

            font-size: 14px;
            cursor: pointer;
            overflow: hidden;
            transition: 0.2s $cubic-FiSo;
            .el-btn {
                background: var(--color-view-block);
                @include setSize(100%, 100%);
                padding: 3px;
                border-color: var(--color-view-block);
                border-radius: 1px;

                .text {
                    color: var(--color-text);
                    font-size: 18px;
                }
                .icon {
                    width: 40px;
                    fill: var(--color-text);
                }
            }

            &:not(.current):hover {
                .el-btn {
                    background: var(--color-primary-light);
                    border-color: var(--color-primary-light);
                    padding: 0;
                    .text {
                        font-size: 20px;
                    }
                }
            }
            &.current {
                background: $colorMain;
                .el-btn {
                    background: var(--color-primary);
                    border-color: var(--color-primary);
                    cursor: default;
                    .text {
                        color: var(--color-extreme-reverse);
                    }
                }
            }
            &.hide {
                width: 0;
                .el-btn {
                    padding: 0;
                    border-width: 0;
                }
            }
            &:first-child {
                border-radius: 10px 0 0 10px;
            }
            &:last-child {
                border-radius: 0 10px 10px 0;
            }
        }

        .omit {
            @include setFlex(center, flex-end);
            @include setSize(0, 30px);
            word-break: keep-all;

            color: var(--color-text);
            font-size: 12px;
            overflow: hidden;
            transition: 0.1s steps(3);
            transform: translateY(2px);
            &.show {
                width: 30px;
            }

            &.prev {
                margin-right: -10px;
            }
            &.next {
                margin-left: -10px;
            }
        }

        .page-jumper {
            @include setFlex();
            .input {
                @include setSize(50px, 32px);
                min-width: unset;
                padding: 2px 8px;
                border: 1px solid $colorMain;
                border-radius: 3px 0 0 3px;
                outline: none;
                transition: 0.2s $cubic-FiSo;
            }

            .icon {
                @include setSize(32px, 32px);
                // background: #ddd;
                fill: #fff;
                padding: 5px;
                border-radius: 0 3px 3px 0;
                cursor: pointer;
                opacity: 0.85;

                &.location {
                    background: $colorMain;
                    margin: 0 1px 0 -1px;
                }
                &.close {
                    background: $colorError;
                    width: 0;
                    padding: 0;
                    opacity: 0.7;
                }

                &:hover {
                    transform: scale(1.1);
                }
            }

            &.open {
                .input {
                }
                .location {
                }
                .close {
                    width: 32px;
                    padding: 2px;
                }
            }
        }
    }
</style>
