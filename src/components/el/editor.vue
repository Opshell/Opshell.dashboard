<script setup lang="ts">
    import { useQuasar } from 'quasar';

    const data = defineModel({ default: `` });

    const $q = useQuasar();

    const toolbar = [
        ['viewsource'],
        [
            {
                label: $q.lang.editor.align,
                icon: $q.iconSet.editor.align,
                fixedLabel: true,
                list: 'only-icons',
                options: ['left', 'center', 'right', 'justify']
            },
            {
                label: $q.lang.editor.align,
                icon: $q.iconSet.editor.align,
                fixedLabel: true,
                options: ['left', 'center', 'right', 'justify']
            }
        ],
        ['bold', 'italic', 'strike', 'underline', 'subscript', 'superscript'],
        ['image', 'file', 'video'],
        ['token', 'hr', 'link', 'custom_btn'],
        [
            {
                label: $q.lang.editor.formatting,
                icon: $q.iconSet.editor.formatting,
                list: 'no-icons',
                options: [
                    'p',
                    'h1',
                    'h2',
                    'h3',
                    'h4',
                    'h5',
                    'h6',
                    'code'
                ]
            },
            {
                label: $q.lang.editor.fontSize,
                icon: $q.iconSet.editor.fontSize,
                fixedLabel: true,
                fixedIcon: true,
                list: 'no-icons',
                options: [
                    'size-1',
                    'size-2',
                    'size-3',
                    'size-4',
                    'size-5',
                    'size-6',
                    'size-7'
                ]
            },
            {
                label: $q.lang.editor.defaultFont,
                icon: $q.iconSet.editor.font,
                fixedIcon: true,
                list: 'no-icons',
                options: [
                    'default_font',
                    'arial',
                    'arial_black',
                    'comic_sans',
                    'courier_new',
                    'impact',
                    'lucida_grande',
                    'times_new_roman',
                    'verdana'
                ]
            },
            'removeFormat'
        ],
        ['quote', 'unordered', 'ordered', 'outdent', 'indent'],
        ['undo', 'redo'],
        ['print', 'fullscreen']
    ];
    const fonts = {
        arial: 'Arial',
        arial_black: 'Arial Black',
        comic_sans: 'Comic Sans MS',
        courier_new: 'Courier New',
        impact: 'Impact',
        lucida_grande: 'Lucida Grande',
        times_new_roman: 'Times New Roman',
        verdana: 'Verdana'
    };
</script>

<template>
    <q-editor
        v-model="data"
        :dense="$q.screen.lt.md"
        :toolbar
        :fonts
        :definitions="{
            'blod': {label: '粗體', tip: '粗體'},
        }"
    ></q-editor>
</template>

<style lang="scss">

</style>