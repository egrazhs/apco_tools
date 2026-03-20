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
            <span class="text-gray-900 dark:text-white font-medium">Subcategorías</span>
          </div>
          <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Subcategorías</h1>
          <p class="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
            {{ subcategories?.length ?? 0 }} Subcategoría{{ (subcategories?.length ?? 0) !== 1 ? 's' : '' }} registrada{{ (subcategories?.length ?? 0) !== 1 ? 's' : '' }}
          </p>
        </div>
        <UButton
          icon="i-heroicons-plus"
          size="md"
          class="self-start sm:self-auto"
          @click="navigateTo('/admin/subcategorias/create')"
        >
          Nueva Subcategoría
        </UButton>
      </div>

      <!-- Filters & Search Bar -->
      <UCard :ui="{ body: { padding: 'p-4' } }">
        <div class="flex flex-col sm:flex-row gap-3">
          <div class="flex-1">
            <UInput
              v-model="search"
              icon="i-heroicons-magnifying-glass"
              placeholder="Buscar categorías..."
              :ui="{ wrapper: 'w-full' }"
            />
          </div>
          <div class="flex gap-2">
            <USelectMenu
              v-model="filterEstado"
              :options="estadoOptions"
              value-attribute="value"
              option-attribute="label"
              placeholder="Estado"
              class="w-36"
            />
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
        </div>
      </UCard>

      <!-- Table Card -->
      <UCard :ui="{ body: { padding: 'p-0' } }">
        <!-- Table Header -->
        <div class="px-4 py-3 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between">
          <div class="flex items-center gap-2">
            <UIcon name="i-heroicons-tag" class="w-4 h-4 text-primary-500" />
            <span class="text-sm font-medium text-gray-700 dark:text-gray-300">Lista de Categorías</span>
          </div>
          <UBadge
            v-if="filteredSubcategories.length !== subcategories?.length"
            color="primary"
            variant="subtle"
            size="xs"
          >
            {{ filteredSubcategories.length }} resultado{{ filteredSubcategories.length !== 1 ? 's' : '' }}
          </UBadge>
        </div>

        <!-- Empty State -->
        <div v-if="filteredSubcategories.length === 0" class="flex flex-col items-center justify-center py-16 px-4">
          <div class="w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-4">
            <UIcon name="i-heroicons-tag" class="w-8 h-8 text-gray-400" />
          </div>
          <h3 class="text-sm font-semibold text-gray-900 dark:text-white mb-1">
            {{ search || filterEstado ? 'Sin resultados' : 'Sin subcategorías' }}
          </h3>
          <p class="text-sm text-gray-500 dark:text-gray-400 text-center max-w-xs">
            {{ search || filterEstado ? 'Intenta con otros filtros o términos de búsqueda.' : 'Comienza agregando tu primera subcategoría.' }}
          </p>
          <UButton
            v-if="!search && !filterEstado"
            icon="i-heroicons-plus"
            size="sm"
            class="mt-4"
            @click="navigateTo('/admin/subcategorias/create')"
          >
            Agregar Subcategoría
          </UButton>
          <UButton
            v-else
            color="gray"
            variant="ghost"
            size="sm"
            class="mt-4"
            @click="clearFilters"
          >
            Limpiar filtros
          </UButton>
        </div>

        <!-- Table -->
        <UTable
          v-else
          :data="filteredSubcategories"
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
                <UIcon name="i-heroicons-tag" class="w-4 h-4 text-primary-500" />
              </div>
              <span class="font-medium text-gray-900 dark:text-white">{{ row.original.nombre }}</span>
            </div>
          </template>

          <template #slug-cell="{ row }">
            <span class="font-mono text-xs px-2 py-1 rounded-md bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400">
              {{ row.original.slug }}
            </span>
          </template>

          <template #activo-cell="{ row }">
            <UBadge
              :color="row.original.activo ? 'green' : 'red'"
              variant="subtle"
              class="gap-1.5"
            >
              <span
                class="w-1.5 h-1.5 rounded-full inline-block"
                :class="row.original.activo ? 'bg-green-500' : 'bg-red-500'"
              />
              {{ row.original.activo ? 'Activa' : 'Inactiva' }}
            </UBadge>
          </template>

          <template #actions-cell="{ row }">
            <div class="flex items-center gap-1">
              <UTooltip text="Editar">
                <UButton
                  size="xs"
                  color="gray"
                  variant="ghost"
                  icon="i-heroicons-pencil-square"
                  @click="editSubcategory(row.original.id)"
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
          v-if="filteredSubcategories.length > 0"
          class="px-4 py-3 border-t border-gray-200 dark:border-gray-800 flex items-center justify-between"
        >
          <p class="text-xs text-gray-500 dark:text-gray-400">
            Mostrando <span class="font-medium">{{ filteredSubcategories.length }}</span> de <span class="font-medium">{{ subcategories?.length ?? 0 }}</span> subcategorías
          </p>
          <div class="flex items-center gap-3 text-xs text-gray-400 dark:text-gray-500">
            <span class="flex items-center gap-1">
              <span class="w-1.5 h-1.5 rounded-full bg-green-500 inline-block" />
              {{ activeCount }} activa{{ activeCount !== 1 ? 's' : '' }}
            </span>
            <span class="flex items-center gap-1">
              <span class="w-1.5 h-1.5 rounded-full bg-red-500 inline-block" />
              {{ inactiveCount }} inactiva{{ inactiveCount !== 1 ? 's' : '' }}
            </span>
          </div>
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
            <h3 class="text-base font-semibold text-gray-900 dark:text-white">Eliminar Subcategoría</h3>
            <p class="text-sm text-gray-500 dark:text-gray-400">Esta acción no se puede deshacer</p>
          </div>
        </div>
      </template>

      <template #body>
        <p class="text-sm text-gray-600 dark:text-gray-300 py-2">
          ¿Estás seguro que deseas eliminar
          <span class="font-semibold text-gray-900 dark:text-white">{{ deleteModal.subcategoria?.nombre }}</span>?
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
  middleware: ['auth'],
  layout: false,
})

const { getSubcategories, deleteSubcategory } = useSubcategories()
const { data: subcategories, refresh } = await useAsyncData('subcategories', async () => {
  const { data } = await getSubcategories()
  return data ?? []
})

// Search & Filters
const search = ref('')
const filterEstado = ref<boolean | null>(null)
const estadoOptions = [
  { label: 'Todos', value: null },
  { label: 'Activas', value: true },
  { label: 'Inactivas', value: false }
]

const filteredSubcategories = computed(() => {
  let result = subcategories.value ?? []
  if (search.value) {
    const q = search.value.toLowerCase()
    result = result.filter((c: any) =>
      c.nombre?.toLowerCase().includes(q) ||
      c.slug?.toLowerCase().includes(q)
    )
  }
  if (filterEstado.value !== null) {
    result = result.filter((c: any) => c.activo === filterEstado.value)
  }
  return result
})

const activeCount = computed(() => (subcategories.value ?? []).filter((c: any) => c.activo).length)
const inactiveCount = computed(() => (subcategories.value ?? []).filter((c: any) => !c.activo).length)

const clearFilters = () => {
  search.value = ''
  filterEstado.value = null
}

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
  subcategoria: null as any
})

const confirmDelete = (subcategoria: any) => {
  deleteModal.subcategoria = subcategoria
  deleteModalOpen.value = true
}

const handleDelete = async () => {
  deleteModal.loading = true
  await deleteSubcategory(deleteModal.subcategoria.id)
  await refresh()
  deleteModal.loading = false
  deleteModalOpen.value = false
}

// Edit
const editSubcategory = (id: string) => {
  navigateTo(`/admin/subcategorias/${id}`)
}

// Columns
const columns = [
  { accessorKey: 'nombre', header: 'Nombre' },
  { accessorKey: 'slug', header: 'Slug' },
  { accessorKey: 'activo', header: 'Estado' },
  { id: 'actions', header: 'Acciones' }
]
</script>