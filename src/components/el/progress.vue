<script setup lang="ts">
    type tStyleType = 'bar' | 'circle';
    const props = withDefaults(defineProps<{
        disabled?: boolean;
        styleType?: tStyleType;
        percent: number;
        elWidth?: string;
    }>(), {
        disabled: false,
        styleType: 'bar',
        percent: 0,
        elWidth: '100px',
    });

    // [-]common
    const status = computed(() => {
        if(props.percent >= 100){
            return 'success';
        } else if(props.percent >= 50) {
            return 'half';
        }
    });

    // [-] bar
    const percentWidth = computed(() => {
        return `calc(${props.percent}% - 4px)`;
    });

    // [-] circle
    const circleStyle = computed(() => {
        return `--percent:${props.percent}; --width:${props.elWidth}`;
    });
</script>

<template>
    <div class="el-progress" :class="{ disabled }">
        <div v-if="styleType == 'bar'" class="bar" :style="{'--width': elWidth}">
            <div class="percent" :class="[status]" :style="{width: percentWidth}" ></div>
        </div>

        <div v-else-if="styleType == 'circle'"
            class="cycle" :class="[status]"
            :style="circleStyle"
        >{{ percent }}%</div>
    </div>
</template>

<style lang="scss">
    @property --percent{
        syntax: '<number>';
        inherits: true;
        initial-value: 0;
    }
    @keyframes progressPercent {
        from {--percent: 0}
    }

    .el-progress {
        .bar {
            position: relative;
            background: #eee;
            @include setSize(var(--width), 12px);
            border: 1px solid #aaa;
            border-radius: 6px;
            transform: translateX(-1px);
            overflow: hidden;

            .percent {
                position: absolute;
                top: 50%;
                left: 2px;
                background: $colorMain;
                height: 7px;

                border-radius: 3px;
                transform: translateY(-50%);
                transition: .2s linear;

                &.success {
                    background: $colorSuccess;
                    transition: .1s $cubic-SiRo;
                }
                &.half { background: $colorWarning; }
            }
        }

        .cycle {
            --border: 5px;
            --borderColor: #31726e;

            position: relative;
            display: inline-grid;
            place-content: center;

            border: calc(var(--border) + 4px) solid #eee;
            border-radius: 50%;
            width: var(--width);
            aspect-ratio: 1;
            margin: 5px;

            font-size: 25px;
            font-weight: bold;
            font-family: sans-serif;

            animation: progressPercent 1s $cubic-FiSo .5s both;
            &.success { --borderColor: #12b75c; }
            &.half { --borderColor: #EFD218; }

            &::before{
                content: "";
                position: absolute;
                border-radius: 50%;
                inset: calc((var(--border) + 2px) * -1);
                background: conic-gradient(var(--borderColor) calc(var(--percent) * 1%),#0000 0), // 進度
                            radial-gradient(farthest-side,var(--borderColor) 98%,#0000) top/var(--border) var(--border) no-repeat; // 圓邊

                -webkit-mask:radial-gradient(farthest-side,#0000 calc(99% - var(--border)),#000 calc(100% - var(--border)));
                        mask:radial-gradient(farthest-side,#0000 calc(99% - var(--border)),#000 calc(100% - var(--border)));
            }

            &::after {
                content: "";
                position: absolute;
                border-radius: 50%;
                inset: calc(50% - var(--border)/2);
                background: var(--borderColor);
                transform: rotate(calc(var(--percent) * 3.6deg))  translateY(calc(50% - var(--width)/2 + 2px));
                transition: .2s $cubic-FiSo;
            }
        }

        &.disabled {
            .bar {
                .percent {
                    background: #ccc;
                }
            }
        }
    }
</style>