<script setup lang="ts">
    const route = useRoute();
</script>

<template>
    <main class="main-block">
        <header class="header-block">
            <template v-if="$slots.title">
                <slot name="title"></slot>
            </template>
            <div v-else class="title-block">
                <ElSvgIcon :name="route.meta.icon" />
                <h1 class="title">{{ route.meta.title }}</h1>
                <span v-if="route.meta.summary" class="summary">{{ route.meta.summary }}</span>
            </div>

            <div class="features-block">
                <slot name="features"></slot>
            </div>
        </header>

        <article class="content-block">
            <slot></slot>
        </article>

        <footer class="footer-block">
            <div class="plugin-block">
                <slot name="footer-features"></slot>
            </div>

            <div class="copyright-box">
                <span class="text copyright">Copyright © 2024 www.Opshell.info </span>
                <span class="text design">
                    <a href="https://github.com/Opshell" target="_blank" rel="noopener noreferrer"
                        >Designed By Opshell</a
                    >
                </span>
            </div>
        </footer>
    </main>
</template>

<style lang="scss">
    .main-block {
        @include setFlex(flex-start, stretch, 0, column);
        @include setSize(100%, 100%);
        .header-block {
            flex-shrink: 0;
            @include setSize(100%, 80px);
            border-bottom: 1px solid var(--color-view-block);
            @extend %scope;

            .title-block {
                @include setFlex(flex-start, flex-end, 1rem);
                .icon {
                    @include setSize(40px, 40px);
                    fill: var(--color-primary);
                }
                .title {
                    color: var(--color-primary);
                    font-size: 1.75rem;
                    line-height: 1.2;
                }
                .summary {
                    color: var(--color-text);
                    font-size: 1.125rem;
                }
            }

            .features-block {
                @include setFlex(flex-end, center, 10px);
                min-width: 280px;
            }
        }

        .content-block {
            position: relative;
            height: calc(100% - 155px);
            padding-bottom: 1.875rem;
            @extend %scope;

            padding-right: calc(2.5rem - 5px);
            @include setRWD (1680px) { padding-right: calc(1.875rem - 5px); }
            @include setRWD (1024px) { padding-right: calc(1.428rem - 5px); }
            @include setRWD (600px) { padding-right: calc(.83rem - 5px); }

            overflow: hidden;
            overflow-y: auto;

            /* 卷軸設定 */
            &::-webkit-scrollbar {
                background: #eee;
                width: 5px;
                border-radius: 2.5px;
            }
            &::-webkit-scrollbar-thumb {
                background: var(--color-primary);
                border-radius: 2.5px;
                // border: .031rem solid rgba(153, 153, 153, 0.5);
                // box-shadow: 0 0 .625rem .125rem #20476e;
            }
        }

        .footer-block {
            flex-shrink: 0;

            display: grid;
            grid-template-areas: "plugin copyright";
            grid-template-columns: repeat(2, auto);
            gap: 1.25rem;

            background: var(--color-border-box);
            @include setSize(100%, 75px);
            @extend %scope;
            border-top: .063rem solid var(--color-view-block);
            .plugin-block {
                grid-area: plugin;
                @include setFlex(flex-start);
            }
            .copyright-box {
                grid-area: copyright;
                @include setFlex(flex-end);
                font-size: .875rem;
            }
        }
    }
</style>