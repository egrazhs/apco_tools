<template>
	<div class="max-w-7xl mx-auto px-4 py-10">
		<div class="mb-8">
			<h1 class="text-3xl font-bold mb-4">Productos</h1>

			<UInput v-model="search" icon="i-heroicons-magnifying-glass" placeholder="Buscar producto..." size="lg" />
		</div>

		<div v-if="pending">Cargando productos...</div>

		<div v-else-if="error">Error cargando productos</div>

		<ProductGrid v-else :products="productos_filtrados"/>
	</div>
</template>


<script setup lang="ts">
	const supabase = useSupabaseClient()

	const search = ref('')

	const { data: products, pending, error } = await useAsyncData('productos', async () => {
		const { data, error } = await supabase.from('productos').select('*, marcas(nombre)')

		if (error) throw error

		return data
	})

	const productos_filtrados = computed(() => {
		if (!products.value) return []

		if (!search.value) return products.value

		return products.value.filter((p: any) => p.nombre.toLowerCase().includes(search.value.toLowerCase()))
	})
</script>