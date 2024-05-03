<script setup lang="ts">
    import { obj } from '@/hooks/utilityFunctions';
    // 路由註冊表
    import routes from '@/router/routes';
    import { RouteRecordRaw } from 'vue-router';

    const route = useRoute();
    const router = useRouter();

    const patientFeatureMenu = computed(() => {
        let menu = obj.getObjInArray(routes, 'name', 'Patient');

        if (menu && menu.children) {
            menu = menu.children.map((e: RouteRecordRaw) => {
                return {
                    title: e.meta?.title,
                    icon: e.meta?.icon,
                    href: `/patient/${route.params?.patient_id}/${e.path}`,
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
</script>

<template>
    <nav class="navBlock">
        <ElSvgIcon name="undo" class="Btn back" @click="() => { router.back()}"></ElSvgIcon>

        <h1 class="currentPageTitle">
            <ElSvgIcon :name="route.meta.icon" />
            {{ route.meta.title }}
            <div class="cover"></div>
        </h1>

        <!-- [#] 好像有點怪怪的 -->
        <transition name="fadeY">
            <div v-if="inPatient" class="menu">
                <ElBtn v-for="(item, i) in patientFeatureMenu"
                    :href="item.href" :key="'nav_'+i"
                    :class="{ current: item.title == route.matched[1].meta.title }"
                >
                    {{ item.title }}
                </ElBtn>
            </div>
        </transition>
    </nav>
</template>

<style lang="scss">
    .navBlock {
        flex-shrink: 0;
        @include setFlex(flex-start, center, 6px);
        position: sticky;
        top: -1px;
        @include setSize(100%, 65px);
        transition: .25s cubic-bezier(0.645, 0.045, 0.355, 1);
        z-index: 100;

        .icon.back {
            background: #fff;
            @include setSize(55px, 55px);
            padding: 12px;
            border-radius: 50%;
            fill: $colorFont;
            cursor: pointer;
            transform: translateY(-2px);
        }

        .currentPageTitle {
            position: relative;
            @include setFlex(flex-start, center, 8px);
            background: #fff;
            height: 100%;
            padding: 10px 45px 10px 25px;
            border-radius: 50px 100px 0 0;

            font-size: 20px;
            font-weight: normal;
            color: $colorMain;

            &::before,
            &::after {
                content: '';
                position: absolute;
                background: transparent;
                @include setSize(30px, 30px);
                z-index: -1;
            }
            &::before{
                left: -30px;
                bottom: 0;
                border-radius: 0 0 35px 0;
                box-shadow: 5px 5px 0 5px #fff;
            }
            &::after {
                right: -42px;
                bottom: -10px;
                @include setSize(40px, 70px);
                border-radius: 0 0 0 55px;
                box-shadow: -10px 10px 0 10px #fff;
                transform: rotateZ(-36deg);
            }

            .cover {
                position: absolute;
                bottom: 0;
                right: -65px;
                background: $colorBack;
                width: 25px;
                height: 10px;
            }

            .icon {
                @include setSize(30px, 30px);
                fill: $colorMain;
            }
        }

        .menu {
            flex: 1;
            align-self: flex-start;
            @include setFlex(flex-end, center);
            gap: 15px;
            transform: translateY(-1px);
        }

        &.stuck {
            background: #fff;
            border-radius: 0;
            box-shadow: 0 1px 2px 0 rgba($color: #000, $alpha: .25);
            .currentPageTitle {
                &::before,
                &::after,
                .cover { visibility: hidden; }
            }

            .menu {
                align-self: center;
            }
        }
    }
</style>
