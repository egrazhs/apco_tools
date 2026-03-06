<template>
	<div class="p-6">
		<AdminCategoryForm v-if="category" :initialData="category" @submit="updateCategory"/>
	</div>
</template>

<script setup lang="ts">
	definePageMeta({
		middleware: ['auth']
	})

	const route = useRoute()
	const { getCategoryById, updateCategory: update } = useCategories()

	const { data: category } = await useAsyncData('category', async () => {
		const { data } = await getCategoryById(route.params.id as string)
		return data ?? null
	})

	const updateCategory = async (form: any) => {
		await update(route.params.id as string, form)
		navigateTo('/admin/categorias')
	}
</script>