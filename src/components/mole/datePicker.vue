<script setup lang="ts">
    import { ref } from 'vue';

    import { str } from '@/hooks/utilityFunctions';

    import VueDatePicker from '@vuepic/vue-datepicker';
    import type { DatePickerInstance } from "@vuepic/vue-datepicker"
    import '@vuepic/vue-datepicker/dist/main.css'

    const datepicker = ref<DatePickerInstance>(null);

    const date = ref(new Date());
    const format = (date: Date) => {
        const year = date.getFullYear();
        const month = str.strPad((date.getMonth() + 1).toString(), 2, '0');
        const day = str.strPad(date.getDate().toString(), 2, '0');

        return `${year}-${month}-${day}`;
    };

    // 開啟日期選擇器選單(暴露出去做總控)
    const openPicker = () => {
        datepicker.value?.openMenu();
    };
    defineExpose({ openPicker });

    const dateClicked = (date: Date) => { }
    const updateMonthYear = (date: {
        instance: number,
        month: number,
        year: number
    }) => {
        // datepicker.value?.setMonthYear(date);
    };
    const invalidHandler = (date) => { }
</script>

<template>
    <VueDatePicker
        ref="datepicker"
        v-model="date"
        class="vueDatePicker"
        :format="format"
        :day-names="['一', '二', '三', '四', '五', '六', '日']"
        :hide-navigation="['time']"

        input-class-name="datePickerInput"
        menu-class-name="pickerBlock"
        calendar-cell-class-name="day"

        locale="tw"
        auto-apply

        @date-update="dateClicked"
        @update-month-year="updateMonthYear"
        @invalid-select="invalidHandler"
    >
        <template #input-icon>
            <ElSvgIcon class="calendarIcon" name="calendar_month"/>
        </template>

        <template #clear-icon="{ clear }">
            <ElSvgIcon class="clearIcon" name="delete_forever" @click="clear"/>
        </template>
    </VueDatePicker>
</template>

<style lang="scss">
    .vueDatePicker{
        .datePickerInput { // input
            background: rgba(255, 255, 255, 0.95);
            height: 55px;
            min-width: 180px;
            // max-width: 210px;
            // min-width: 140px;
            padding: 8px 60px 8px 15px;
            border: 1px solid $colorFont;
            border-radius: 20px;
            font-size: 18px;
            backdrop-filter: blur(5px);
            -webkit-autofill: unset;
            transition: .05s $cubic-FiSo;
            box-sizing: border-box;

            &:disabled {
                background: #eee;
                padding: 8px 15px;
                ~ div {
                    display: none;
                }
            }
            &:focus,
            &.dp__input_focus {
                outline: 0;
                border-color: $colorMain;
                border-width: 2px;
            }
            ~ div {
                position: absolute;
                right: 40px;
                top: 50%;
            }
        }

        .dp__clear_icon { right: 30px; }

        .calendarIcon,
        .clearIcon {
            @include setSize(30px, 30px);
            padding: 0;
            margin: 0;
        }

        .calendarIcon {
            fill: $colorMain;
            transform: translateX(5px);
        }
        .clearIcon {
            fill: $colorError;
            transform: translateY(0.5px);
        }
    }

    .pickerBlock {
        border: 1px solid $colorMain;
        border-radius: 20px;
        box-sizing: border-box;
        overflow: hidden;
        transform: translateY(-5px);
        .dp__arrow_top {
            display: none;
        }

        .day {
            &:hover {
                background: #fff;
                border: 1px solid $colorMain;
            }

            &.dp__today { // 今天
                border-color: $colorMain;
            }
            &.dp__active_date { // 選擇的日期
                background: $colorMain;
                border-radius: 50%;
            }
        }
    }
</style>