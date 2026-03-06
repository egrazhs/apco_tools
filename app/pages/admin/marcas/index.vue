<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-950">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">

      <!-- Header Section -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div class="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-1">
            <UIcon name="i-heroicons-home" class="w-4 h-4" />
            <span>Admin</span>
            <UIcon name="i-heroicons-chevron-right" class="w-3 h-3" />
            <span class="text-gray-900 dark:text-white font-medium">Marcas</span>
          </div>
          <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Marcas</h1>
          <p class="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
            {{ brands?.length ?? 0 }} marca{{ (brands?.length ?? 0) !== 1 ? 's' : '' }} registrada{{ (brands?.length ?? 0) !== 1 ? 's' : '' }}
          </p>
        </div>
        <UButton
          icon="i-heroicons-plus"
          size="md"
          class="self-start sm:self-auto"
          @click="navigateTo('/admin/marcas/create')"
        >
          Nueva Marca
        </UButton>
      </div>

      <!-- Search Bar -->
      <UCard :ui="{ body: { padding: 'p-4' } }">
        <div class="flex flex-col sm:flex-row gap-3">
          <div class="flex-1">
            <UInput
              v-model="search"
              icon="i-heroicons-magnifying-glass"
              placeholder="Buscar marcas..."
              :ui="{ wrapper: 'w-full' }"
            />
          </div>
          <UButton
            color="gray"
            variant="outline"
            icon="i-heroicons-arrow-path"
            :loading="refreshing"
            @click="handleRefresh"
          >
            Actualizar
          </UButton>
        </div>
      </UCard>

      <!-- Table Card -->
      <UCard :ui="{ body: { padding: 'p-0' } }">
        <!-- Table Header -->
        <div class="px-4 py-3 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between">
          <div class="flex items-center gap-2">
            <UIcon name="i-heroicons-bookmark" class="w-4 h-4 text-primary-500" />
            <span class="text-sm font-medium text-gray-700 dark:text-gray-300">Lista de Marcas</span>
          </div>
          <UBadge
            v-if="filteredBrands.length !== brands?.length"
            color="primary"
            variant="subtle"
            size="xs"
          >
            {{ filteredBrands.length }} resultado{{ filteredBrands.length !== 1 ? 's' : '' }}
          </UBadge>
        </div>

        <!-- Empty State -->
        <div v-if="filteredBrands.length === 0" class="flex flex-col items-center justify-center py-16 px-4">
          <div class="w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-4">
            <UIcon name="i-heroicons-bookmark" class="w-8 h-8 text-gray-400" />
          </div>
          <h3 class="text-sm font-semibold text-gray-900 dark:text-white mb-1">
            {{ search ? 'Sin resultados' : 'Sin marcas' }}
          </h3>
          <p class="text-sm text-gray-500 dark:text-gray-400 text-center max-w-xs">
            {{ search ? `No se encontraron marcas con "${search}"` : 'Comienza agregando tu primera marca.' }}
          </p>
          <UButton
            v-if="!search"
            icon="i-heroicons-plus"
            size="sm"
            class="mt-4"
            @click="navigateTo('/admin/marcas/create')"
          >
            Agregar Marca
          </UButton>
          <UButton
            v-else
            color="gray"
            variant="ghost"
            size="sm"
            class="mt-4"
            @click="search = ''"
          >
            Limpiar búsqueda
          </UButton>
        </div>

        <!-- Table -->
        <UTable
          v-else
          :data="filteredBrands"
          :columns="columns"
          :ui="{
            tr: { base: 'hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors' },
            th: { base: 'bg-gray-50 dark:bg-gray-800/50 text-xs uppercase tracking-wider' },
            td: { base: 'text-sm' }
          }"
        >
          <template #nombre-cell="{ row }">
            <div class="flex items-center gap-3">
              <div class="w-8 h-8 rounded-lg bg-primary-50 dark:bg-primary-900/30 flex items-center justify-center flex-shrink-0">
                <UIcon name="i-heroicons-bookmark" class="w-4 h-4 text-primary-500" />
              </div>
              <span class="font-medium text-gray-900 dark:text-white">{{ row.original.nombre }}</span>
            </div>
          </template>

          <template #actions-cell="{ row }">
            <div class="flex items-center gap-1">
              <UTooltip text="Editar">
                <UButton
                  size="xs"
                  color="gray"
                  variant="ghost"
                  icon="i-heroicons-pencil-square"
                  @click="editBrand(row.original.id)"
                />
              </UTooltip>
              <UTooltip text="Eliminar">
                <UButton
                  size="xs"
                  color="red"
                  variant="ghost"
                  icon="i-heroicons-trash"
                  @click="confirmDelete(row.original)"
                />
              </UTooltip>
            </div>
          </template>
        </UTable>

        <!-- Table Footer -->
        <div
          v-if="filteredBrands.length > 0"
          class="px-4 py-3 border-t border-gray-200 dark:border-gray-800"
        >
          <p class="text-xs text-gray-500 dark:text-gray-400">
            Mostrando <span class="font-medium">{{ filteredBrands.length }}</span> de <span class="font-medium">{{ brands?.length ?? 0 }}</span> marcas
          </p>
        </div>
      </UCard>
    </div>

    <!-- Delete Confirmation Modal -->
    <UModal v-model:open="deleteModalOpen">
      <template #header>
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-full bg-red-50 dark:bg-red-900/20 flex items-center justify-center">
            <UIcon name="i-heroicons-exclamation-triangle" class="w-5 h-5 text-red-500" />
          </div>
          <div>
            <h3 class="text-base font-semibold text-gray-900 dark:text-white">Eliminar Marca</h3>
            <p class="text-sm text-gray-500 dark:text-gray-400">Esta acción no se puede deshacer</p>
          </div>
        </div>
      </template>

      <template #body>
        <p class="text-sm text-gray-600 dark:text-gray-300 py-2">
          ¿Estás seguro que deseas eliminar
          <span class="font-semibold text-gray-900 dark:text-white">{{ deleteModal.marca?.nombre }}</span>?
        </p>
      </template>

      <template #footer>
        <div class="flex justify-end gap-3">
          <UButton color="gray" variant="ghost" @click="deleteModalOpen = false">
            Cancelar
          </UButton>
          <UButton color="red" :loading="deleteModal.loading" @click="handleDelete">
            Eliminar
          </UButton>
        </div>
      </template>
    </UModal>
  </div>
</template>

<script setup lang="ts">
	definePageMeta({
		middleware: ['auth']
	})

	const { getBrands, deleteBrand } = useBrands()
	const { data: brands, refresh } = await useAsyncData('brands', async () => {
		const { data } = await getBrands()
		return data ?? []
	})

	// Search
	const search = ref('')
	const filteredBrands = computed(() => {
		if (!search.value) return brands.value ?? []
		const q = search.value.toLowerCase()
		return (brands.value ?? []).filter((b: any) => b.nombre?.toLowerCase().includes(q))
	})

	// Refresh
	const refreshing = ref(false)
	const handleRefresh = async () => {
		refreshing.value = true
		await refresh()
		refreshing.value = false
	}

	// Delete modal
	const deleteModalOpen = ref(false)
	const deleteModal = reactive({
		loading: false,
		marca: null as any
	})

	const confirmDelete = (marca: any) => {
		deleteModal.marca = marca
		deleteModalOpen.value = true
	}

	const handleDelete = async () => {
		deleteModal.loading = true
		await deleteBrand(deleteModal.marca.id)
		await refresh()
		deleteModal.loading = false
		deleteModalOpen.value = false
	}

	// Edit
	const editBrand = (id: string) => { navigateTo(`/admin/marcas/${id}`) }

	// Columns
	const columns = [
		{ accessorKey: 'nombre', header: 'Nombre' },
		{ id: 'actions', header: 'Acciones' }
	]
</script>