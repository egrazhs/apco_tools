<template>
    <button
        class="group border-2 border-stone-200 hover:border-red-600 text-left transition-colors overflow-hidden flex flex-col"
        @click="$emit('select')"
    >
        <!-- Imagen / placeholder -->
        <div class="relative aspect-[4/3] w-full bg-stone-50 border-b border-stone-200 overflow-hidden">
            <img
                v-if="imageUrl && !imageFailed"
                :src="imageUrl"
                :alt="name"
                class="w-full h-full object-contain p-4 transition-transform duration-300 group-hover:scale-105"
                loading="lazy"
                @error="imageFailed = true"
            />
            <div v-else class="w-full h-full flex items-center justify-center">
                <UIcon name="i-heroicons-photo" class="w-12 h-12 text-stone-200" />
            </div>

            <!-- Número de orden -->
            <span class="absolute top-2 left-3 text-3xl font-bold text-stone-300 group-hover:text-red-200 transition-colors">
                {{ String(index + 1).padStart(2, '0') }}
            </span>
        </div>

        <!-- Contenido -->
        <div class="p-5 flex flex-col flex-1">
            <p class="text-stone-800 font-semibold text-lg leading-tight">{{ name }}</p>

            <p v-if="description" class="mt-2 text-stone-600 text-sm">{{ description }}</p>

            <div class="mt-4 flex items-center gap-1 text-red-600 opacity-0 group-hover:opacity-100 transition-opacity">
                <span class="text-xs uppercase tracking-widest">{{ actionLabel }}</span>
                <UIcon name="i-heroicons-arrow-right" class="w-3 h-3" />
            </div>
        </div>
    </button>
</template>

<script setup lang="ts">
    const props = withDefaults(defineProps<{
        name: string
        index: number
        imageKey?: string | null
        description?: string | null
        actionLabel?: string
        showImage?: boolean
    }>(), {
        imageKey: null,
        description: null,
        actionLabel: 'Ver productos',
        showImage: true
    })

    defineEmits<{ (e: 'select'): void }>()

    const supabase = useSupabaseClient()
    const imageFailed = ref(false)

    // image_key se guarda sin extensión; el archivo en el bucket es <image_key>.webp
    const imageUrl = computed(() => {
        if (!props.showImage || !props.imageKey) return null
        const { data } = supabase.storage
            .from('subcategory_images')
            .getPublicUrl(`${props.imageKey}.webp`)
        return data?.publicUrl ?? null
    })

    // Si cambia la imagen, reintentar
    watch(() => props.imageKey, () => { imageFailed.value = false })
</script>