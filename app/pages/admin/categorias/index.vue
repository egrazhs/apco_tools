<template>
	<div class="p-6 space-y-6">
		<div class="flex justify-between items-center">
			<h1 class="text-2xl font-bold">Categorías</h1>
			<UButton icon="i-heroicons-plus" @click="navigateTo('/admin/categorias/create')">Nueva Categoría</UButton>
		</div>

		<UCard>
			<UTable :data="categories" :columns="columns">
				<template #activo-cell="{ row }">
					<UBadge :color="row.original.activo ? 'green' : 'red'">{{ row.original.activo ? 'Activo' : 'Inactivo' }}</UBadge>
				</template>

				<template #actions-cell="{ row }">
					<div class="flex gap-2">
						<UButton size="xs" color="gray" icon="i-heroicons-pencil-square" @click="editCategory(row.original.id)"/>
						<UButton size="xs" color="red" icon="i-heroicons-trash" @click="removeCategory(row.original.id)" />
					</div>
				</template>
			</UTable>
		</UCard>
	</div>
</template>

<script setup lang="ts">
	definePageMeta({
		middleware: ['auth']
	})

	const { getCategories, deleteCategory } = useCategories();
	const categories = ref([]);

	const columns = [
		{
			accessorKey: 'nombre',
			header: 'Nombre'
		},
		{
			accessorKey: 'slug',
			header: 'Slug'
		},
		{
			accessorKey: 'activo',
			header: 'Estado'
		},
		{
			id: 'actions',
			header: 'Acciones'
		}
	]

	const fetchCategories = async () => {
		const { data } = await getCategories()
		if (data)
			categories.value = data
	}

	const editCategory = (id: string) => {
		navigateTo(`/admin/categorias/${id}`)
	}

	const removeCategory = async (id: string) => {
		if (!confirm('¿Eliminar categoría?')) return
		
		await deleteCategory(id)
		fetchCategories()
	}

	onMounted(fetchCategories)
</script>