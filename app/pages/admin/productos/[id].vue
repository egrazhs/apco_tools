<template>
	<div class="p-6">
		<AdminProductosForm :productId="Number(route.params.id)" :initialData="product" :marcas="marcasOptions || []" :categories="category_options" :subcategories="subcategory_options" @submit="updateProduct"/>
	</div>
</template>

<script setup lang="ts">
	definePageMeta({
		middleware: ['auth'],
		layout: false,
	})

	const route = useRoute()
	const { getProductById, updateProduct: update } = useProducts()
	const { getBrands } = useBrands()
	const { getCategories } = useCategories()
	const { getSubcategories } = useSubcategories()
	
	const [{ data: brandsData }, { data: productData }, { data: categoriesData}, { data: SubcategoriesData}] = await Promise.all([
		getBrands(),
		getProductById(route.params.id as string),
		getCategories(),
		getSubcategories(),
	])

	const marcas = ref(brandsData || [])
	const product = ref(productData)
	const categories = ref(categoriesData)
	const subcategories = ref(SubcategoriesData)

	const marcasOptions = computed(() => (marcas.value || []).map(m => ({
		label: m.name,
		value: Number(m.id)
	})))

	const category_options = computed(() => (categories.value || []).map(c => ({
		label: c.name,
		value: Number(c.id)
	})))

	const subcategory_options = computed(() => (subcategories.value || []).map(s => ({
		label: s.name,
		value: Number(s.id)
	})))

	const fetchProduct = async () => {
		const { data } = await getProductById(route.params.id as string)
		if (data) product.value = data
	}

	const fetchBrands = async () => {
		const { data } = await getBrands()
		if (data) marcas.value = data
	}	

	const updateProduct = async (form: any) => {
		const { id, created_at, ...cleanForm } = form
		
		await update(route.params.id as string, {
			...cleanForm
		})
		
		navigateTo('/admin/productos')
	}
</script>