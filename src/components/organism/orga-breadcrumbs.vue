<script setup lang="ts">
    const route = useRoute();

    const breadcrumbs = computed(()=> {
        const matched = route.matched;

        let list = [
            {
                title: '',
                path: '/',
                icon: 'home',
            }
        ];

        matched.forEach((el) => {
            if (el.meta.title) {
                list.push({
                    title: el.meta.title,
                    path: el.path,
                    icon: el.meta.icon || '',
                });
            }
        });

        return list;
    });
</script>

<template>
    <div class="breadcrumbsBox">
        <router-link v-for="(item, i) in breadcrumbs" :key="'breadcrumb_' + i"
            :to="item.path" class="breadcrumb" :class="{ home: i == 0, current: i == breadcrumbs.length - 1 }"
            :style="{ 'z-index': breadcrumbs.length - i }"
        >
            <ElSvgIcon :name="item.icon"></ElSvgIcon>
            <span class="text">{{ item.title }}</span>
        </router-link>
    </div>
</template>

<style lang="scss">
    .breadcrumbsBox {
        @include setFlex(flex-start, center, -10px);
        .breadcrumb {
            @include setFlex();
            gap: 8px;
            background: $colorBlock;
            @include setSize(auto, 55px);
            padding: 10px 25px 10px 35px;
            border-radius: 0 27.5px 27.5px 0;
            box-shadow: 3px 0 8px -3px rgba($color: #000000, $alpha: 0.45);
            margin-right: -20px;

            .icon { @include setSize(25px, 25px); }
            .text { font-size: 22px; }

            &.home {
                @include setSize(60px, 60px);
                padding: 10px;
                border-radius: 50%;
                z-index: 1;
                .icon { @include setSize(30px, 30px); }
                .text { display: none;}
            }
            &.current {
                margin: 0;
            }
        }
    }
</style>