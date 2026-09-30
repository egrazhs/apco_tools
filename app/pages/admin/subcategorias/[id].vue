<template>
    <div class="p-6">
        <AdminSubcategoryForm
            v-if="subcategory"
            :initial-data="subcategory"
            :marcas="marca_options || []"
            :categories="categoriesByBrand"
            @submit="updateSubcategory"
        />
    </div>
</template>

<script setup lang="ts">
    definePageMeta({
        middleware: ['auth'],
        layout: false,
    })

    const route = useRoute()
    const { getSubcategoryById, updateSubcategory: update } = useSubcategories()
    const { getBrandsSorted } = useBrands()
    const { getCategoriesByBrandId } = useCategories()

    // Cargar subcategoría con datos relacionados
    const { data: subcategory } = await useAsyncData('subcategory', async () => {
        const { data } = await getSubcategoryById(route.params.id as string)
        return data ?? null
    })

    // Cargar marcas
    const { data: marcas } = await getBrandsSorted()

    const marca_options = computed(() => (marcas || []).map(m => ({
        label: m.name,
        value: m.id as number,
        slug: m.slug
    })))

    // Obtener brand_id de la categoría actual (para preseleccionar)
    const brandData = computed(() => {
        if (!subcategory.value?.categories) return null
        return {
            brand_id: subcategory.value.categories.brand_id,
            category_id: subcategory.value.categories.id
        }
    })

    // Estado para categorías filtradas
    const selectedBrandId = ref<number | null>(null)
    const categoriesByBrand = ref<Array<{ label: string; value: number }>>([])

    // Preseleccionar marca y cargar sus categorías
    watch(
        () => brandData.value?.brand_id,
        async (brandId) => {
            if (!brandId) return

            selectedBrandId.value = brandId

            const { data } = await getCategoriesByBrandId(brandId)
            categoriesByBrand.value = (data || []).map(c => ({
                label: c.name,
                value: c.id
            }))
        },
        { immediate: true }
    )

    const updateSubcategory = async (form: any) => {
        await update(route.params.id as string, form)
        navigateTo('/admin/subcategorias')
    }
</script>