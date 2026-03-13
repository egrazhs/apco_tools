<template>
	<div class="p-6">
		<AdminProductosForm :initialData="product" :marcas="marcasOptions || []" @submit="updateProduct"/>
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
	
	const [{ data: brandsData }, { data: productData }] = await Promise.all([
	  getBrands(),
	  getProductById(route.params.id as string)
	])

	const marcas = ref(brandsData || [])
	const product = ref(productData)

	const marcasOptions = computed(() =>
	  (marcas.value || []).map(m => ({
	    label: m.nombre,
	    value: Number(m.id)
	  }))
	)

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
	    ...cleanForm,
	    marca_id: Number(cleanForm.marca_id)
	  })
	  navigateTo('/admin/productos')
	}
</script>