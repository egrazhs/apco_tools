<template>
	<div class="p-6">
		<AdminMarcasForm v-if="brand" :initialData="brand" @submit="updateBrand"/>
	</div>
</template>

<script setup lang="ts">
	definePageMeta({
		middleware: ['auth']
	})

	const route = useRoute()
	const { getBrandById, updateBrand: update } = useBrands()

	const { data: brand } = await useAsyncData('brand', async () => {
	  const { data } = await getBrandById(route.params.id as string)
	  return data ?? null
	})

	const updateBrand = async (form: any) => {
		await update(route.params.id as string, form)
		navigateTo('/admin/marcas')
	}

	
</script>