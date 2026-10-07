<template>
	<div class="p-6">
		<AdminGroupingForm 
			v-if="grouping" 
			:initialData="grouping" 
			:marcas="marca_options || []"
	        :categories="category_options"
			@submit="updateGrouping"
		/>
	</div>
</template>

<script setup lang="ts">
	definePageMeta({
		middleware: ['auth'],
		layout: false,
	})

	const route = useRoute()
	const { getGroupingById, updateGrouping: update } = useGroupings()
	const { getBrandsSorted } = useBrands()
    const { getCategories } = useCategories()

	const { data: grouping } = await useAsyncData('grouping', async () => {
	  const { data } = await getGroupingById(route.params.id as string)
	  return data ?? null
	})

	// Cargar marcas
    const { data: marcas } = await getBrandsSorted()
    const {data: categories} = await getCategories();

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

	const updateGrouping = async (form: any) => {
		await update(route.params.id as string, form)
		navigateTo('/admin/agrupaciones')
	}

	
</script>