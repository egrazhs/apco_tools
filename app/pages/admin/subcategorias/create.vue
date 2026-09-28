<template>
    <div class="p-6">
        <AdminSubcategoryForm
            :marcas="marca_options || []"
            :categories-by-brand="categoriesByBrand"
            @submit="saveSubcategory"
        />
    </div>
</template>

<script setup lang="ts">
    definePageMeta({
        middleware: ['auth'],
        layout: false,
    })

    const { createSubcategory } = useSubcategories()
    const { getBrandsSorted } = useBrands()

    // Cargar marcas
    const { data: marcas } = await getBrandsSorted()

    const marca_options = computed(() => (marcas || []).map(m => ({
        label: m.name,
        value: m.id as number,
        slug: m.slug
    })))

    // Estado para categorías filtradas
    const selectedBrandId = ref<number | null>(null)
    const categoriesByBrand = ref<Array<{ label: string; value: number }>>([])

    // Cargar categorías cuando cambia la marca seleccionada
    const { getCategoriesByBrandId } = useCategories()
    
    watch(selectedBrandId, async (brandId) => {
        if (!brandId) {
            categoriesByBrand.value = []
            return
        }

        const { data } = await getCategoriesByBrand(brandId)
        categoriesByBrand.value = (data || []).map(c => ({
            label: c.name,
            value: c.id
        }))
    })

    const saveSubcategory = async (form: any) => {
        // Actualizar selectedBrandId para que las categorías se carguen
        selectedBrandId.value = form.brand_id
        
        // Esperar a que las categorías se carguen
        await nextTick()
        
        // Guardar
        await createSubcategory(form)
        navigateTo('/admin/subcategorias')
    }
</script>