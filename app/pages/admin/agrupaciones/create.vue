<template>
	<div class="p-6">
		<AdminGroupingForm
			:marcas="marca_options"
			:categories="category_options" 
			@submit="saveGrouping" 
		/>
	</div>
</template>

<script setup lang="ts">
	definePageMeta({
		middleware: ['auth'],
		layout: false,
	})

	const { createGrouping } = useGroupings()
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


	const saveGrouping = async (form: any) => {
		await createGrouping(form)
		navigateTo('/admin/agrupaciones')
	}
</script>