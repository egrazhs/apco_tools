<template>
    <div class="p-6">
        <AdminMarcasForm v-if="brand" :initialData="brand" @submit="updateBrand"/>

        <UCard v-if="categories.length > 1" class="max-w-md mx-auto mt-6">
            <template #header>
                <div class="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-primary-400">
                    <UIcon name="i-heroicons-arrows-up-down" />
                    <span>Orden de categorías</span>
                </div>
            </template>

            <AdminSortableList v-model="categories" @reorder="handleReorder">
                <template #default="{ item }">
                    <div class="flex items-center gap-2">
                        <span class="text-sm truncate">{{ item.name }}</span>
                        <UBadge
                            v-if="!item.is_active"
                            color="neutral"
                            variant="subtle"
                            size="sm"
                        >
                            Inactiva
                        </UBadge>
                    </div>
                </template>
            </AdminSortableList>
        </UCard>
    </div>
</template>

<script setup lang="ts">
    definePageMeta({
        middleware: ['auth'],
        layout: false,
    })

    const route = useRoute()
    const brandId = route.params.id as string

    const { getBrandById, updateBrand: update } = useBrands()
    const { getAllCategoriesByBrand } = useCategories()
    const { saveOrder } = useReorder()

    const { data: brand } = await useAsyncData('brand', async () => {
        const { data } = await getBrandById(brandId)
        return data ?? null
    })

    // ── CATEGORÍAS DE LA MARCA (ordenables) ────────────────────────────
    const { data: categoriesData, refresh: refreshCategories } = await useAsyncData(
        `brand-${brandId}-categories`,
        async () => {
            const { data } = await getAllCategoriesByBrand(Number(brandId))
            return data ?? []
        }
    )

    // Copia local mutable para el v-model de la lista
    const categories = ref<any[]>([])
    watch(categoriesData, (val) => {
        categories.value = [...(val ?? [])]
    }, { immediate: true })

    const handleReorder = async (ids: Array<string | number>) => {
        const { success } = await saveOrder('categories', ids)

        // Si falló, recargamos para reflejar lo que realmente hay en BD
        if (!success) await refreshCategories()

        console.log('ids enviados:', ids)
    }

    // ── SUBMIT DEL FORM ────────────────────────────────────────────────
    const updateBrand = async (form: any) => {
        await update(brandId, form)
        navigateTo('/admin/marcas')
    }
</script>