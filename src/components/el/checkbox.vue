<script setup lang="ts">
    const data = defineModel();
</script>

<template>
    <q-checkbox
        class="el-checkbox"
        v-model="data"

        v-bind="$attrs"
    >
    </q-checkbox>
</template>

<style lang="scss">
    .el-checkbox {
        .q-checkbox {
            &__inner {
                &--truthy,
                &--indet {
                    .q-checkbox__bg {
                        background: var(--color-primary);
                        border-color: var(--color-primary);
                    }
                }
            }
        }
    }

    body.desktop .el-checkbox:not(.disabled) .q-checkbox__inner:before {
        background: var(--color-primary-light);
    }
</style>