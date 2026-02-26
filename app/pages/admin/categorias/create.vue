<template>
  <div class="p-6">
    <AdminCategoryForm @submit="saveCategory" />
  </div>
</template>

<script setup lang="ts">
	definePageMeta({
		middleware: ['auth']
	})

	const { createCategory } = useCategories()

	const saveCategory = async (form: any) => {
		await createCategory(form)
		navigateTo('/admin/categorias')
	}
</script>