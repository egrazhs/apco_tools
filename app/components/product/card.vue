<template>
    <div
        class="group bg-white overflow-hidden border border-stone-200
               hover:border-red-600 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 flex flex-col"
    >
        <!-- Imagen -->
        <div class="relative overflow-hidden aspect-square">
            <!-- Skeleton while loading -->
            <USkeleton
                v-if="loadingImage"
                class="w-full h-full"
            />

            <!-- Imagen cargada -->
            <img
                v-show="!loadingImage && primaryImage"
                :src="primaryImage?.url"
                :alt="primaryImage?.altText || product.name"
                class="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
                @load="loadingImage = false"
            />

            <!-- Fallback si no hay imagen -->
            <div
                v-if="!primaryImage && !loadingImage"
                class="w-full h-full flex items-center justify-center text-stone-300"
            >
                <UIcon name="i-heroicons-photo" class="text-5xl" />
            </div>

            <!-- Badge sin stock -->
            <div
                v-if="product.stock === 0"
                class="absolute inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center"
            >
                <span class="text-xs font-bold tracking-[0.2em] uppercase text-stone-500 bg-white px-3 py-1.5 border border-stone-200">
                    Sin stock
                </span>
            </div>

            <!-- Badge marca -->
            <div
                v-if="product.brands?.name"
                class="absolute top-3 left-3 bg-white text-stone-700
                       text-[10px] font-bold tracking-widest uppercase px-2.5 py-1 border border-stone-200"
            >
                {{ product.brands.name }}
            </div>

            <!-- Badge oferta -->
            <div
                v-if="product.precioOferta"
                class="absolute top-3 right-3 bg-red-600 text-white
                       text-[10px] font-bold tracking-widest uppercase px-2.5 py-1"
            >
                Oferta
            </div>
        </div>

        <!-- Info -->
        <div class="flex flex-col flex-1 p-4 gap-3">
            <div class="flex-1 space-y-1">
                <h3 class="font-bold text-stone-900 leading-snug line-clamp-2 group-hover:text-red-600 transition-colors duration-200">
                    {{ product.name }}
                </h3>
                <p class="text-xs text-stone-400 line-clamp-2 leading-relaxed">
                    {{ product.short_description }}
                </p>
            </div>

            <!-- Precio -->
            <div class="flex items-baseline gap-2">
                <span class="text-xl font-black text-stone-900">
                    {{ formatCurrency(product.precioOferta || product.price) }}
                </span>
                <span
                    v-if="product.precioOferta"
                    class="text-xs text-stone-400 line-through"
                >
                    {{ formatCurrency(product.price) }}
                </span>
            </div>

            <!-- Acciones -->
            <div class="flex flex-col gap-2 pt-1">
                <UButton
                    :to="`/productos/${product.slug}`"
                    variant="outline"
                    block
                    size="sm"
                    class="rounded-none border-stone-300 text-stone-700 hover:border-stone-900 hover:text-stone-900 hover:bg-transparent transition-colors"
                >
                    Ver detalles
                </UButton>
            </div>
        </div>
    </div>
</template>

<script setup>
    const { formatCurrency } = useCurrency()
    const { getPrimaryImage } = useProductImages()

    const props = defineProps({
        product: {
            type: Object,
            required: true
        }
    })

    // ============================================
    // DECISIÓN: Skeleton loader vs spinner
    // Por qué: USkeleton es más elegante, mantiene
    // layout estable (sin CLS), mejor UX general
    // ============================================

    const loadingImage = ref(true)
    const primaryImage = ref(null)

    // Fetch imagen primaria al montar
    onMounted(async () => {
        try {
            const image = await getPrimaryImage(props.product.id)
            primaryImage.value = image
        } catch (error) {
            console.error('Error loading primary image:', error)
            loadingImage.value = false
        }
    })
</script>