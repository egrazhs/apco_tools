<template>
	<div class="p-6">
		<AdminProductosForm :marcas="marca_options || []" :categories="category_options" :subcategories="subcategory_options" @submit="saveProduct" />
	</div>
</template>

<script setup lang="ts">
	definePageMeta({
		middleware: ['auth'],
		layout: false,
	})

	const { createProduct } = useProducts()
	const { getBrands } = useBrands()
	const { getCategories } = useCategories()
	const { getSubcategories } = useSubcategories()

	const { data: marcas } = await getBrands()
	const { data: categories } = await getCategories()
	const { data: subcategories } = await getSubcategories()

	const marca_options = computed(() => (marcas || []).map(m => ({
		label: m.name,
		value: m.id as number  // si m.id ya viene como number desde Supabase, está bien
	})))

	const category_options = computed(() => (categories || []).map(c =>({
		label: c.name,
		value: c.id as number
	})))

	const subcategory_options = computed(() => (subcategories || []).map(s => ({
		label: s.name,
		value: s.id as number
	})))

	const saveProduct = async (form: any) => {
		await createProduct(form)
		navigateTo('/admin/productos')
	}
</script>