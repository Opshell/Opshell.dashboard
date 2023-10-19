<script setup lang="ts">
    import { obj } from '@/hooks/opshellLibary';
    // 路由註冊表
    import routes from '@/router/routes';
    import { RouteRecordRaw } from 'vue-router';

    const route = useRoute();

    const patientFeatureMenu = computed(() => {
        let menu = obj.getObjInArray(routes, 'name', 'Patient');

        if (menu && menu.children) {
            menu = menu.children.map((e: RouteRecordRaw) => {
                return {
                    title: e.meta?.title,
                    icon: e.meta?.icon,
                    href: `/patient/${route.params.pid}/${e.path}`,
                };
            });
        } else {
            menu = [];
        }

        return menu;
    });

    const inPatient = computed(() => {
        return (route.matched[0].name === 'Patient')
    });

    onMounted(() => {
        // get the sticky element
        const stickyElm = document.querySelector('.navBlock')
        const observer = new IntersectionObserver(
            ([e]) => e.target.classList.toggle('stuck', e.intersectionRatio < 1),
            {threshold: [1]}
        );

        if(stickyElm){
            observer.observe(stickyElm)
        }
    });

    // 深度監看 router
    // watch(route, (newVal) => {
    //     console.log('Route：', newVal);
    // }, { deep: true });
</script>

<template>
    <nav class="navBlock">
        <h1 class="currentPageTitle">
            <ElSvgIcon :name="route.meta.icon" />
            {{ route.meta.title }}
        </h1>

        <div v-if="inPatient" class="menu">
            <ElBtn href='/patient-list/1' class="back" >回到列表</ElBtn> <!-- [#] 連結記得之後要換成動態的-->
            <ElBtn v-for="(item, i) in patientFeatureMenu"
                :href="item.href" :key="'nav_'+i"
                :class="{ current: item.title == route.matched[1].meta.title }"
            >
                {{ item.title }}
            </ElBtn>
        </div>
    </nav>
</template>

<style lang="scss">
    .navBlock {
        display: flex;
        align-items: center;
        justify-content: space-between;

        position: sticky;
        top: -1px;

        background: #fff;
        border-radius: 50px 50px 0 0;

        transition: .25s cubic-bezier(0.645, 0.045, 0.355, 1);
        z-index: 100;
        .currentPageTitle {
            align-self: flex-start;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 8px;

            background: $colorMain;
            padding: 20px 40px;
            border-radius: 50px 0 50px 0;
            margin: 0 25px 0 -40px;

            font-size: 20px;
            color: #fff;
            .icon {
                @include setSize(20px, 20px);
                fill: #fff;
            }

            @include setRWD(1800px) { margin-left: -30px; };
            @include setRWD(1024px) { margin-left: -20px; };
            @include setRWD(600px) { margin-left: -10px; };
        }

        .menu {
            display: flex;
            align-items: center;
            justify-content: flex-end;
            gap: 20px;
            padding: 20px 0;
            // .Btn:first-child {
            //     background-color: $colorFont;
            //     border-color: $colorFont;
            //     color: #fff;
            // }
        }

        &.stuck {
            border-radius: 0;
            box-shadow: 0 1px 2px 0 rgba($color: #000, $alpha: .25);
            .currentPageTitle {
                border-radius:  0 0 50px 0;
                box-shadow: 1px 1px 5px 0 rgba($color: #000, $alpha: 0.35);
            }
            .menu {
                // padding: 5px 0;
            }
        }
    }
</style>
