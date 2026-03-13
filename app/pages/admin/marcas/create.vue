<template>
  <div class="p-6">
    <AdminMarcasForm @submit="saveBrand" />
  </div>
</template>

<script setup lang="ts">
	definePageMeta({
		middleware: ['auth'],
		layout: false,
	})

	const { createBrand } = useBrands()

	const saveBrand = async (form: any) => {
		await createBrand(form)
		navigateTo('/admin/marcas')
	}
</script>