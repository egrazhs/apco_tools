<template>
  <div class="p-6">
    <AdminGroupingForm @submit="saveGrouping" />
  </div>
</template>

<script setup lang="ts">
	definePageMeta({
		middleware: ['auth'],
		layout: false,
	})

	const { createGrouping } = useGroupings()

	const saveGrouping = async (form: any) => {
		await createBrand(form)
		navigateTo('/admin/agrupaciones')
	}
</script>