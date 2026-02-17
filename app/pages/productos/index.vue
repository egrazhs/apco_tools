<template>
	<div class="max-w-7xl mx-auto px-4 py-10">
		<!-- Header -->
		<div class="mb-8">
			<h1 class="text-3xl font-bold mb-4">Productos</h1>

			<UInput
				v-model="search"
				icon="i-heroicons-magnifying-glass"
				placeholder="Buscar producto..."
				size="lg"
			/>
		</div>

		<!-- Grid Productos -->
		<ProductGrid :products="productos_filtrados"/>
	</div>
</template>


<script setup>
	const { $supabase } = useNuxtApp()

	const products = ref([])

	const { data, pending, error } = await $supabase.from('productos').select('*, marcas(nombre)');

	if (error) {
  		console.error(error)
	} else {
  		products.value = data
	}

	const search = ref('')

	const productos_filtrados = computed(() => {
		if (!search.value) return products.value

		return products.value.filter(p =>
			p.nombre.toLowerCase().includes(search.value.toLowerCase())
		)
	})
</script>
