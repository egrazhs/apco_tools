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

	const category = ref(null)

	const fetchCategory = async () => {
		const { data } = await getCategoryById(route.params.id as string)
		if (data) category.value = data
	}

	const updateCategory = async (form: any) => {
		await update(route.params.id as string, form)
		navigateTo('/admin/categorias')
	}

	onMounted(fetchCategory)
</script>