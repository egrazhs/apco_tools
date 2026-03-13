<template>
    <div class="min-h-screen bg-stone-50">
        <!-- Hero header -->
        <div class="border-b border-stone-200 bg-white">
            <div class="max-w-7xl mx-auto px-6 py-12">
                <p class="text-xs font-semibold tracking-[0.25em] uppercase text-stone-400 mb-2">Catálogo</p>
                <h1 class="text-5xl font-black tracking-tight text-stone-900 mb-8" style="font-family: 'Georgia', serif;">
                    Nuestros <em class="italic font-normal text-amber-600">productos</em>
                </h1>
                <div class="max-w-md">
                    <UInput
                        v-model="search"
                        icon="i-heroicons-magnifying-glass"
                        placeholder="Buscar producto..."
                        size="lg"
                        :ui="{
                            base: 'bg-stone-100 border-0 focus:ring-2 focus:ring-amber-500 rounded-full text-stone-900 placeholder-stone-400',
                            icon: { leading: { wrapper: 'text-stone-400' } }
                        }"
                    />
                </div>
            </div>
        </div>

        <!-- Contenido -->
        <div class="max-w-7xl mx-auto px-6 py-10">
            <!-- Estado de carga -->
            <div v-if="pending" class="flex items-center justify-center py-32 gap-3 text-stone-400">
                <UIcon name="i-heroicons-arrow-path" class="animate-spin text-xl" />
                <span class="text-sm tracking-wide">Cargando productos...</span>
            </div>

            <!-- Estado de error -->
            <div v-else-if="error" class="flex flex-col items-center justify-center py-32 gap-2 text-stone-400">
                <UIcon name="i-heroicons-exclamation-triangle" class="text-3xl text-red-400" />
                <p class="text-sm">Error al cargar los productos</p>
            </div>

            <!-- Grid de productos -->
            <template v-else>
                <p class="text-xs text-stone-400 tracking-wide mb-6 uppercase">
                    {{ productos_filtrados.length }} resultado{{ productos_filtrados.length !== 1 ? 's' : '' }}
                </p>
                <ProductGrid :products="productos_filtrados" />

                <!-- Empty state -->
                <div v-if="productos_filtrados.length === 0" class="flex flex-col items-center justify-center py-32 gap-2 text-stone-400">
                    <UIcon name="i-heroicons-face-frown" class="text-4xl" />
                    <p class="text-sm">No se encontraron productos para <strong class="text-stone-600">"{{ search }}"</strong></p>
                </div>
            </template>
        </div>
    </div>
</template>

<script setup lang="ts">
    const supabase = useSupabaseClient()
    const search = ref('')

    const { data: products, pending, error } = await useAsyncData('productos', async () => {
        const { data, error } = await supabase.from('productos').select('*, marcas(nombre)')
        if (error) throw error
        return data
    })

    const productos_filtrados = computed(() => {
        if (!products.value) return []
        if (!search.value) return products.value
        return products.value.filter((p: any) =>
            p.nombre.toLowerCase().includes(search.value.toLowerCase())
        )
    })
</script>