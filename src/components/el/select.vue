<script setup lang="ts">
    import { VueStyleProp } from 'quasar';
    import { useGlobalProperties } from '@/hooks/utilityFunctions';

    const porxy = useGlobalProperties();

    interface iOptions {
        title: number | string;
        value: number;
    }

    const props = withDefaults(defineProps<{
        options: iOptions[],
        type?: 'select' | 'feature',
    }>(), {
        options: () => [],
        type: 'select',
    });

    const finalOptions = computed(() => {
        const options = porxy._.cloneDeep(props.options);

        if (porxy._.findIndex(options, { title: '請選擇', value: 0 }) === -1){
            options.unshift({ title: '請選擇', value: 0 });
        }

        return options;
    });

    const data = defineModel();

    const Attr = useAttrs();
    const attrStyle = Attr?.style as VueStyleProp;
</script>

<template>
    <q-select
        class="el-select"
        :class="{ feature: type == 'feature' }"
        v-model="data"
        :options="finalOptions"

        option-label="title"
        option-value="value"

        fill-input
        emit-value
        map-options

        dropdown-icon="keyboard_arrow_down"
        transition-show="jump-down"
        transition-hide="jump-down"
        popup-content-class="el-select-list"
        :popup-content-style="attrStyle"

        :menu-offset="[0, 10]"

        v-bind="$attrs"
    >
        <template v-if="$slots.selected" #selected>
            <slot name="selected" />
        </template>
        <template v-if="$slots.option" #option>
            <slot name="option" />
        </template>
        <template v-if="$slots['no-option']" #no-option>
            <slot name="no-option" />
        </template>
    </q-select>
</template>

<style lang="scss">
    .q-select {
        @include setSize(100%, 45px);

        .q-field {
            // 樣式覆蓋[尺寸]
            &__inner,
            &__control,
            &__control-container,
            &__marginal,
            &__native {
                height: 100%;
                min-height: unset;
            }

            // 文字樣式
            &__native,
            &__prefix,
            &__suffix {
                color: var(--color-title);
            }

            &__control { // 主外殼
                background: var(--color-extreme-reverse);
                border: 1px solid var(--color-border-box);
                border-radius: 5px;

                font-size: var(--font-size-remark);
                overflow: hidden;
                transition: .2s $cubic-FiSo;

                &::before { display: none; }
                &-container { @include setFlex(space-between); }
            }

            &__native { // 結果框
                padding: 10px;
                line-height: 1;
            }

            &__append {// 下拉圖標區塊
                padding-right: 3px;
            }
        }

        &.feature {
            width: auto;
            .q-field__native {
                padding: 0 10px;
            }
        }

        &:hover:not(.q-field--disabled) {
            .q-field__native,
            .q-field__prefix,
            .q-field__suffix {
                color: var(--color-primary);
            }

            .icon { fill: var(--color-primary); }
            .q-icon { color: var(--color-primary); }
            .q-field__control{ border-color: var(--color-hover-light); }
        }

        // [M] 狀態
        &.q-field {
            &--standard {
                .q-field__control {
                    &::after {
                        display: none;
                        transform: none;
                    }
                }
            }

            &--focused {
                .q-field__native,
                .q-field__prefix,
                .q-field__suffix {
                    color: var(--color-primary);
                }

                .icon { fill: var(--color-primary); }
                .q-icon { color: var(--color-primary); }

                .q-field__control{
                    border-color: var(--color-primary);
                    box-shadow: 0 0 0 2px var(--color-hover-light);
                    color: var(--color-primary);
                }
            }

            &--disabled {
                .q-field {
                    &__control {
                        background: var(--color-view-block);
                    }
                }
            }
        }
    }

    // [M]列表
    .el-select-list {
        background: var(--color-extreme-reverse);
        max-height: 200px;
        padding: 5px;
        border-radius: 5px;
        box-shadow: 0px 4px 15px 0px rgba(0, 0, 0, 0.1);
        overflow: hidden;
        .q-virtual-scroll {
            &__padding {
                // background: unset;
                height: 1px !important;
            }

            &__content {
                @include setFlex(flex-start, stretch, 5px, column);
                max-height: 188px;
                padding-right: 3px;
                overflow: hidden auto;

                // 卷軸底
                &::-webkit-scrollbar {
                    background: var(--color-extreme-reverse);
                    @include setSize(3px, 3px);
                    border-radius: 1.5px;
                }
                // 卷軸體
                &::-webkit-scrollbar-thumb {
                    background: var(--color-primary-light);
                    border-radius: 1.5px;
                    box-shadow: 0 0 1px 0 rgba(0, 0, 0, 0.3);
                }
                &::-webkit-scrollbar-button {
                    display: none;
                }

                .q-item {
                    flex-shrink: 0;
                    @include setFlex();
                    @include setSize(100%, 35px);
                    min-height: unset;
                    border-radius: 5px;
                    font-size: var(--font-size-remark);
                    text-align: center;
                    cursor: pointer;

                    .icon {
                        @include setSize(28px, 28px);
                        transform: translate3d(-5px, -2px, 0);
                    }
                    &__label {
                        transform: translateY(1px);
                    }

                    &--active {
                        background: var(--color-primary);
                        color: var(--color-extreme-reverse);
                    }
                    &:hover {
                        background: var(--color-hover-light);
                        border-radius: 5px;
                        color: var(--color-primary);
                        .icon {
                            fill: var(--color-primary);
                        }
                    }
                }
            }
        }
    }
</style>
