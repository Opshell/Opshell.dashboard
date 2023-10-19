<script setup lang="ts">
    interface iProps {
        name: string;
        modelValue?: string | null;
        value: string | number;
    };
    const props = withDefaults(defineProps<iProps>(), {
        name: '',
        modelValue: '',
        value: ''
    });

    // type-based (TS)
    const emit = defineEmits<{
        (e: 'change', id: number): void;
        (e: 'update:modelValue', value: string): void;
    }>();

    // input值更新的時候，emit出去
    const updateModelValue = (event: Event) => {
        // 不斷言 HTMLInputElement的話 取值會有錯誤
        const target = event.target as HTMLInputElement;

        emit('update:modelValue', target.value);
    };
</script>

<template>
    <label class="radioInput">
        <input class="radioValue" type="radio" :value="value" :name="name" @input="updateModelValue($event)"/>
        <div class="point"></div>
        <span class="text">
            <slot></slot>
        </span>
    </label>
</template>

<style scoped lang="scss">
    .radioInput {
        display: flex;
        align-items: center;
        justify-content: flex-start;
        cursor: pointer;

        &:hover {
            .point::before {
                @include setSize(9px, 9px);
            }
        }
        .radioValue {
            @include setSize(0, 0);
            &:checked + .point::before {
                @include setSize(15px, 15px);
            }
        }

        .point {
            @include setFlex();

            position: relative;
            background: #fff;
            @include setSize(25px, 25px);
            border-radius: 50%;
            border: 1px solid $colorMain;
            margin-right: 5px;
            &::before {
                content: '';
                background: $colorMain;
                @include setSize(0, 0);
                border-radius: 50%;
                transition: 0.15s $cubic-FiSo;
                z-index: 1;
            }
        }

        .text {
            color: #444;
            user-select: none;
        }
    }
</style>