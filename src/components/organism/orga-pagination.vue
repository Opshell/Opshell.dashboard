<script setup lang="ts">
    import { obj } from '@/hooks/opshellLibary';

    interface iProps {
        lastPage: number;
        showPageSize?: number; // 顯示多少個頁碼
        showNext?: boolean;
        showPrevious?: boolean;
        showFirst?: boolean;
        showLast?: boolean;
        showOmit?: boolean;
    }
    const props = withDefaults(defineProps<iProps>(), {
        lastPage: 1,
        showPageSize: 5,
        showNext: true,
        showPrevious: true,
        showFirst: false,
        showLast: false,
        showOmit: true, // 省略符號
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

        if (lastPage <= props.showPageSize) { // 如果總頁數小於等於showPageSize，直接列出所有頁碼
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
            } else if(props.showPageSize % 2 === 0){ // 在中間偶數就靠前
                for (let i = currPage - halfShowPageSize + 1; i <= currPage + halfShowPageSize; i++) {
                    pageList.push(i);
                }
            } else {  // 在中間奇數就前後加一半
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
        params.page = page.toString();

        emit('jumpRouter');
        router.push({ name: targetName, params });
    }


</script>

<template>
    <ul class="orga-paginationBlock">
        <li v-if="showFirst" class="orga-pagination" :class="{ hide: compCurrentPage == 1 }">
            <ElBtn @click="goto(1)">
                <ElSvgIcon name="angle-double-small-left" />
            </ElBtn>
        </li>
        <li v-if="showPrevious" class="orga-pagination" :class="{ hide: compCurrentPage == 1 }">
            <ElBtn @click="goto(compCurrentPage - 1)">
                <ElSvgIcon name="angle-small-left" />
            </ElBtn>
        </li>

        <li v-if="showOmit" class="omit prev" :class="{show: morePrev}">...</li>

        <li v-for="pageNumber in pageList" :key="'page_'+pageNumber" class="orga-pagination" :class="{ current: pageNumber === compCurrentPage }">
            <ElBtn @click="goto(pageNumber)">
                {{ pageNumber }}
            </ElBtn>
        </li>

        <li v-if="showOmit" class="omit next" :class="{show: moreNext}">...</li>

        <li v-if="showNext" class="orga-pagination" :class="{ hide: compCurrentPage == lastPage }">
            <ElBtn @click="goto(compCurrentPage + 1)">
                <ElSvgIcon name="angle-small-right" />
            </ElBtn>
        </li>
        <li v-if="showLast" class="orga-pagination" :class="{ hide: compCurrentPage == lastPage }">
            <ElBtn @click="goto(lastPage)">
                <ElSvgIcon name="angle-double-small-right" />
            </ElBtn>
        </li>
    </ul>
</template>

<style lang="scss">
    .orga-paginationBlock {
        @include setFlex(center, center, 10px);
        padding: 0;
        margin: 50px 0 0;
        list-style: none;

        .orga-pagination {
            @include setSize(30px, 30px);
            border-radius: 2px;

            font-size: 14px;
            cursor: pointer;
            transition: 0.2s $cubic-FiSo;

            .Btn{
                background: #ddd;
                @include setSize(100%, 100%);
                padding: 3px;
                border-color: #ddd;
                border-radius: 0;

                .text {
                    color: #fff;
                    font-size: 18px;
                }
            }
            .icon {fill: #fff;}

            &:not(.current):hover {
                .Btn {
                    padding: 0;
                    .text { font-size: 20px; }
                }
            }

            &.current {
                background: $colorMain;
                .Btn {
                    color: #fff;
                    background: $colorMain;
                    border-color: $colorMain;
                    cursor: default;
                }
            }

            &.hide {
                width: 0;
                .Btn {
                    padding: 0;
                    border-width: 0;
                }
            }
        }

        .omit {
            @include setFlex(center, flex-end);
            @include setSize(0, 30px);
            word-break: keep-all;

            color: #999;
            font-size: 12px;

            overflow: hidden;
            transition: 0.1s steps(3);
            transform: translateY(2px);
            &.show {
                width: 30px;
            }

            &.prev { margin-right: -10px; }
            &.next { margin-left: -10px; }
        }
    }
</style>