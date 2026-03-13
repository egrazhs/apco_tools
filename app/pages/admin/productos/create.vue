<template>
	<div class="p-6">
		<AdminProductosForm :marcas="marca_options || []" @submit="saveProduct" />
	</div>
</template>

<script setup lang="ts">
	definePageMeta({
		middleware: ['auth']
	})

	const { createProduct } = useProducts()
	const { getBrands } = useBrands()
	const { data: marcas } = await getBrands()

	const marca_options = computed(() => (marcas || []).map(m => ({
		label: m.nombre,
		value: m.id as number  // si m.id ya viene como number desde Supabase, está bien
	})))

	const saveProduct = async (form: any) => {
		await createProduct(form)
		navigateTo('/admin/productos')
	}
</script>