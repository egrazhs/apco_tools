<template>
    <div class="min-h-screen bg-gray-50 dark:bg-gray-950">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">

            <!-- Header Section -->
            <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <AdminBreadcrumb actual_page="Productos" />

                    <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Productos</h1>
                    <p class="text-sm text-gray-500 dark:text-gray-400 mt-0.5">{{ totalCount }} producto{{ totalCount !== 1 ? 's' : '' }} registrado{{ totalCount !== 1 ? 's' : '' }}</p>
                </div>

                <UButton icon="i-heroicons-arrow-top-right-on-square" color="gray" variant="outline" size="md" class="self-start sm:self-auto" to="/productos" target="_blank">Ver catálogo</UButton>
                <UButton icon="i-heroicons-plus" size="md" class="self-start sm:self-auto" @click="navigateTo('/admin/productos/create')">Nuevo Producto</UButton>
            </div>

            <!-- Filters & Search Bar -->
            <UCard :ui="{ body: { padding: 'p-4' } }">
                <div class="flex flex-col sm:flex-row gap-3">
                    <div class="flex-1">
                        <UInput v-model="searchInput" icon="i-heroicons-magnifying-glass" placeholder="Buscar por nombre o código..." :ui="{ wrapper: 'w-full' }" />
                    </div>
                    <div class="flex gap-2">
                        <USelect v-model="pageSize" :items="pageSizeOptions" class="w-24" />
                        <UButton color="gray" variant="outline" icon="i-heroicons-arrow-path" :loading="pending" @click="refresh">Actualizar</UButton>
                    </div>
                </div>
            </UCard>

            <!-- Table Card -->
            <UCard :ui="{ body: { padding: 'p-0' } }">
                <!-- Table Header -->
                <div class="px-4 py-3 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between">
                    <div class="flex items-center gap-2">
                        <UIcon name="i-heroicons-cube" class="w-4 h-4 text-primary-500" />
                        <span class="text-sm font-medium text-gray-700 dark:text-gray-300">Lista de Productos</span>
                    </div>
                    <UBadge v-if="search" color="primary" variant="subtle" size="xs">{{ totalCount }} resultado{{ totalCount !== 1 ? 's' : '' }}</UBadge>
                </div>

                <!-- Empty State -->
                <div v-if="!pending && products.length === 0" class="flex flex-col items-center justify-center py-16 px-4">
                    <div class="w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-4">
                        <UIcon name="i-heroicons-cube" class="w-8 h-8 text-gray-400" />
                    </div>
                    <h3 class="text-sm font-semibold text-gray-900 dark:text-white mb-1">{{ search ? 'Sin resultados' : 'Sin productos' }}</h3>
                    <p class="text-sm text-gray-500 dark:text-gray-400 text-center max-w-xs">{{ search ? `No se encontraron productos con "${search}"` : 'Comienza agregando tu primer producto.' }}</p>
                    <UButton v-if="!search" icon="i-heroicons-plus" size="sm" class="mt-4" @click="navigateTo('/admin/productos/create')">Agregar Producto</UButton>
                    <UButton v-else color="gray" variant="ghost" size="sm" class="mt-4" @click="clearSearch">Limpiar búsqueda</UButton>
                </div>

                <!-- Table -->
                <UTable v-else :data="products" :columns="columns" :loading="pending" :ui="{tr: { base: 'hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors' }, th: { base: 'bg-gray-50 dark:bg-gray-800/50 text-xs uppercase tracking-wider' }, td: { base: 'text-sm' }}">
                    <template #name-cell="{ row }">
                        <div class="flex items-center gap-3">
                            <div class="w-8 h-8 rounded-lg bg-primary-50 dark:bg-primary-900/30 flex items-center justify-center flex-shrink-0">
                                <img :src="row.original.image_url" />
                            </div>
                            <span class="font-medium text-gray-900 dark:text-white">{{ row.original.name }}</span>
                        </div>
                    </template>

                    <template #actions-cell="{ row }">
                        <div class="flex items-center gap-1">
                            <UTooltip text="Editar">
                                <UButton size="xs" color="gray" variant="ghost" icon="i-heroicons-pencil-square" @click="editProduct(row.original.id)" />
                            </UTooltip>
                            <UTooltip text="Eliminar">
                                <UButton size="xs" color="red" variant="ghost" icon="i-heroicons-trash" @click="confirmDelete(row.original)" />
                            </UTooltip>
                        </div>
                    </template>
                </UTable>

                <!-- Table Footer -->
                <div v-if="products.length > 0" class="px-4 py-3 border-t border-gray-200 dark:border-gray-800 flex flex-col sm:flex-row items-center justify-between gap-3">
                    <p class="text-xs text-gray-500 dark:text-gray-400">Mostrando <span class="font-medium">{{ rangeStart }}-{{ rangeEnd }}</span> de <span class="font-medium">{{ totalCount }}</span> productos</p>
                    <UPagination v-model:page="page" :total="totalCount" :items-per-page="pageSize" />
                </div>
            </UCard>
        </div>

        <UModal v-model:open="deleteModalOpen">
            <template #header>
                <div class="flex items-center gap-3">
                    <div class="w-10 h-10 rounded-full bg-red-50 dark:bg-red-900/20 flex items-center justify-center">
                        <UIcon name="i-heroicons-exclamation-triangle" class="w-5 h-5 text-red-500" />
                    </div>
                    <div>
                        <h3 class="text-base font-semibold text-gray-900 dark:text-white">Eliminar Producto</h3>
                        <p class="text-sm text-gray-500 dark:text-gray-400">Esta acción no se puede deshacer</p>
                    </div>
                </div>
            </template>

            <template #body>
                <p class="text-sm text-gray-600 dark:text-gray-300 py-2">¿Estás seguro que deseas eliminar <span class="font-semibold text-gray-900 dark:text-white">{{ deleteModal.product?.name }}</span>?</p>
            </template>

            <template #footer>
                <div class="flex justify-end gap-3">
                    <UButton color="gray" variant="ghost" @click="deleteModalOpen = false">Cancelar</UButton>
                    <UButton color="red" :loading="deleteModal.loading" @click="handleDelete">Eliminar</UButton>
                </div>
            </template>
        </UModal>
    </div>
</template>

<script setup lang="ts">
    import type { AdminProductListItem } from '~/composables/useAdminProducts'

    definePageMeta({
        middleware: ['auth'],
        layout: false,
    })

    const { getAdminProducts } = useAdminProducts()
    const { deleteProduct } = useProducts()

    // Paginación
    const page = ref(1)
    const pageSize = ref(10)
    const pageSizeOptions = [10, 25, 50, 100]

    // Búsqueda con debounce (espera 400ms tras la última tecla antes de consultar al servidor)
    const searchInput = ref('')
    const search = ref('')
    let searchTimeout: ReturnType<typeof setTimeout> | null = null

    watch(searchInput, (value) => {
        if (searchTimeout) clearTimeout(searchTimeout)
        searchTimeout = setTimeout(() => {
            search.value = value
            page.value = 1
        }, 400)
    })

    onUnmounted(() => {
        if (searchTimeout) clearTimeout(searchTimeout)
    })

    // Reiniciar a la página 1 cuando cambia el tamaño de página
    watch(pageSize, () => {
        page.value = 1
    })

    const { data, pending, refresh } = await useAsyncData(
        'admin-products',
        async () => {
            const { data: rows, count, error } = await getAdminProducts({
                page: page.value,
                pageSize: pageSize.value,
                search: search.value
            })
            if (error) throw error
            return { products: rows, count }
        },
        {
            server: false,
            watch: [page, pageSize, search]
        }
    )

    const products = computed(() => data.value?.products ?? [])
    const totalCount = computed(() => data.value?.count ?? 0)

    const rangeStart = computed(() => (totalCount.value === 0 ? 0 : (page.value - 1) * pageSize.value + 1))
    const rangeEnd = computed(() => Math.min(page.value * pageSize.value, totalCount.value))

    const clearSearch = () => {
        searchInput.value = ''
        search.value = ''
        page.value = 1
    }

    const deleteModalOpen = ref(false)

    const deleteModal = reactive({
        loading: false,
        product: null as AdminProductListItem | null
    })

    const confirmDelete = (product: AdminProductListItem) => {
        deleteModal.product = product
        deleteModalOpen.value = true
    }

    const handleDelete = async () => {
        if (!deleteModal.product) return
        deleteModal.loading = true
        await deleteProduct(String(deleteModal.product.id))
        await refresh()
        deleteModal.loading = false
        deleteModalOpen.value = false
    }

    const editProduct = (id: number) => {
        navigateTo(`/admin/productos/${id}`)
    }

    const columns = [
        { accessorKey: 'name', header: 'Nombre' },
        { accessorKey: 'code', header: 'Código' },
        { id: 'actions', header: 'Acciones' }
    ]
</script>