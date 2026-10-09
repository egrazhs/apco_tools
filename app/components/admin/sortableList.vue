<template>
    <VueDraggable
        v-model="items"
        :animation="150"
        handle=".drag-handle"
        ghost-class="opacity-40"
        class="flex flex-col gap-2"
        @end="emitReorder"
    >
        <div
            v-for="(item, index) in items"
            :key="item[itemKey]"
            class="flex items-center gap-3 px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800/50"
        >
            <UIcon
                name="i-heroicons-bars-3"
                class="drag-handle cursor-grab active:cursor-grabbing text-gray-500 text-lg shrink-0"
            />
            <span class="text-xs text-gray-500 w-6 text-center shrink-0">{{ index + 1 }}</span>

            <div class="flex-1 min-w-0">
                <slot :item="item" :index="index">
                    {{ item.name }}
                </slot>
            </div>

            <div class="flex gap-1 shrink-0">
                <UButton
                    type="button"
                    color="neutral"
                    variant="ghost"
                    size="xs"
                    icon="i-heroicons-chevron-up"
                    :disabled="index === 0"
                    @click="move(index, -1)"
                />
                <UButton
                    type="button"
                    color="neutral"
                    variant="ghost"
                    size="xs"
                    icon="i-heroicons-chevron-down"
                    :disabled="index === items.length - 1"
                    @click="move(index, 1)"
                />
            </div>
        </div>
    </VueDraggable>
</template>

<script setup lang="ts">
    import { VueDraggable } from 'vue-draggable-plus'

    const props = withDefaults(defineProps<{
        itemKey?: string
    }>(), {
        itemKey: 'id'
    })

    const emit = defineEmits<{
        (e: 'reorder', ids: Array<string | number>): void
    }>()

    const items = defineModel<any[]>({ required: true })

    // Emite los ids en el nuevo orden; el padre decide cómo/cuándo guardar
    const emitReorder = () => {
        emit('reorder', items.value.map(item => item[props.itemKey]))
    }

    // Fallback sin drag (móvil / accesibilidad)
    const move = (index: number, direction: -1 | 1) => {
        const target = index + direction
        if (target < 0 || target >= items.value.length) return

        const copy = [...items.value]
        ;[copy[index], copy[target]] = [copy[target], copy[index]]
        items.value = copy
        emitReorder()
    }
</script>