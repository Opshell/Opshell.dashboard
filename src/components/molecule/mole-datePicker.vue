<script setup lang="ts">
    import { ref } from 'vue';

    import { str } from '@/hooks/opshellLibary';

    import VueDatePicker from '@vuepic/vue-datepicker';
    import '@vuepic/vue-datepicker/dist/main.css'

    const date = ref(new Date());
    const format = (date: Date) => {
        const year = date.getFullYear();
        const month = str.strPad((date.getMonth() + 1).toString(), 2, '0');
        const day = str.strPad(date.getDate().toString(), 2, '0');

        return `${year}-${month}-${day}`;
    };
</script>

<template>
    <VueDatePicker v-model="date" :format="format" class="vueDatePicker"
        locale="tw"
        :day-names="['一', '二', '三', '四', '五', '六', '日']"
        input-class-name="datePickerInput"
        menu-class-name="pickerBlock"
        calendar-cell-class-name="day"

        :hide-navigation="['time']"

        auto-apply
    >
        <template #input-icon>
            <ElSvgIcon class="calendarIcon" name="calendar"/>
        </template>

        <template #clear-icon="{ clear }">
            <ElSvgIcon class="clearIcon" name="trash" @click="clear"/>
        </template>
    </VueDatePicker>
</template>

<style lang="scss">
    .vueDatePicker{
        .datePickerInput { // input
            background: rgba(255, 255, 255, 0.95);
            @include setSize(190px, 55px);
            // max-width: 210px;
            // min-width: 140px;
            padding: 8px 70px 8px 20px;
            border: 1px solid $colorFont;
            border-radius: 20px;
            font-size: 18px;
            backdrop-filter: blur(5px);
            -webkit-autofill: unset;
            transition: .05s $cubic-FiSo;
            box-sizing: border-box;

            &:disabled {
                background: #eee;
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

        .dp__clear_icon {
            right: 30px;
        }

        .calendarIcon,
        .clearIcon {
            @include setSize(30px, 30px);
            padding: 2px;
            margin: 0 10px 0 0;
        }

        .calendarIcon { fill: $colorMain; }
        .clearIcon { fill: $colorError; }
    }

    .pickerBlock {
        border: 1px solid $colorMain;
        border-radius: 20px;
        transform: translateY(-5px);
        box-sizing: border-box;
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