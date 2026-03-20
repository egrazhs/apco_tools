<template>
	<div class="p-6">
		<AdminSubcategoryForm v-if="subcategory" :initialData="subcategory" @submit="updateSubcategory"/>
	</div>
</template>

<script setup lang="ts">
	definePageMeta({
		middleware: ['auth'],
		layout: false,
	})

	const route = useRoute()
	const { getSubcategoryById, updateSubcategory: update } = useSubcategories()

	const { data: subcategory } = await useAsyncData('subcategory', async () => {
		const { data } = await getSubcategoryById(route.params.id as string)
		return data ?? null
	})

	const updateSubcategory = async (form: any) => {
		await update(route.params.id as string, form)
		navigateTo('/admin/subcategorias')
	}
</script>