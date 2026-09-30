<template>
    <div class="p-6">
        <AdminSubcategoryForm
            :marcas="marca_options"
            :categories="category_options"
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
    const { getCategories } = useCategories()

    // Cargar catálogos completos (una sola vez)
    const [{ data: marcas }, { data: categories }] = await Promise.all([
        getBrandsSorted(),
        getCategories()
    ])

    const marca_options = computed(() => (marcas || []).map(m => ({
        label: m.name,
        value: m.id as number,
        brand_id: m.id,
        slug: m.slug
    })))

    // Todas las categorías, con brand_id para que el form filtre por marca
    const category_options = computed(() => (categories || []).map(c => ({
        label: c.name,
        value: c.id as number,
        brand_id: c.brand_id as number
    })))

    const saveSubcategory = async (form: any) => {
        await createSubcategory(form)
        navigateTo('/admin/subcategorias')
    }
</script>