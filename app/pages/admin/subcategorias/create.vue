<template>
  <div class="p-6">
    <AdminSubcategoryForm @submit="saveSubcategory" />
  </div>
</template>

<script setup lang="ts">
	definePageMeta({
		middleware: ['auth'],
		layout: false,
	})

	const { createSubcategory } = useSubcategories()

	const saveSubcategory = async (form: any) => {
		await createSubcategory(form)
		navigateTo('/admin/subcategorias')
	}
</script>