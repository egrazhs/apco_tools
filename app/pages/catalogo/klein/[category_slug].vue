<template>
    <div class="min-h-screen bg-white">
        <UContainer class="py-8 md:py-12 xl:py-16">
            <!-- Breadcrumb -->
            <nav class="flex items-center gap-2 text-xs uppercase tracking-widest text-stone-400 mb-8">
                <NuxtLink to="/" class="hover:text-red-600 transition-colors">Inicio</NuxtLink>
                <span>/</span>
                <NuxtLink to="/productos" class="hover:text-red-600 transition-colors">Catálogo</NuxtLink>
                <span>/</span>
                <NuxtLink to="/catalogo/klein" class="hover:text-red-600 transition-colors">KLEIN</NuxtLink>
                <span>/</span>
                <span class="text-stone-600">{{ category?.name }}</span>
            </nav>

            <!-- ── CASO 1: MOSTRAR AGRUPACIONES ──────────────────────────────── -->
            <template v-if="paso === 'groupings' && groupings.length > 0">
                <div class="mb-8 xl:mb-10">
                    <h1 class="font-serif text-3xl md:text-4xl xl:text-5xl text-stone-800 leading-tight">
                        {{ category?.name }}
                    </h1>
                    <div class="mt-3 border-b-4 border-red-600 w-20" />
                </div>

                <!-- Mobile: chips de agrupación -->
                <div class="lg:hidden mb-6 -mx-4 px-4 overflow-x-auto pb-2 flex gap-2">
                    <button
                        v-for="group in groupings"
                        :key="group.id"
                        :class="[
                            'shrink-0 px-4 py-1.5 text-sm font-semibold border-2 transition-colors',
                            selectedGrouping?.id === group.id
                                ? 'border-red-600 text-red-600 bg-red-50'
                                : 'border-stone-300 text-stone-500 bg-white hover:border-stone-500'
                        ]"
                        @click="selectGrouping(group)"
                    >
                        {{ group.name }}
                    </button>
                </div>

                <!-- Grid de agrupaciones -->
                <div class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                    <SubcategoryCard
                        v-for="(group, index) in groupings"
                        :key="group.id"
                        :name="group.name"
                        :index="index"
                        :description="group.description"
                        action-label="Ver opciones"
                        :show-image="false"
                        @select="selectGrouping(group)"
                    />
                </div>
            </template>

            <!-- ── CASO 2: MOSTRAR SUBCATEGORÍAS O PRODUCTOS ─────────────────── -->
            <template v-else>
                <!-- Mobile: chips de subcategoría (scroll horizontal) -->
                <div class="lg:hidden mb-6 -mx-4 px-4 overflow-x-auto pb-2 flex gap-2">
                    <button
                        :class="[
                            'shrink-0 px-4 py-1.5 text-sm font-semibold border-2 transition-colors',
                            !selectedSub
                                ? 'border-red-600 text-red-600 bg-red-50'
                                : 'border-stone-300 text-stone-500 bg-white hover:border-stone-500'
                        ]"
                        @click="clearSub"
                    >
                        Todas
                    </button>
                    <button
                        v-for="sub in subcategories"
                        :key="sub.id"
                        :class="[
                            'shrink-0 px-4 py-1.5 text-sm font-semibold border-2 transition-colors',
                            selectedSub?.id === sub.id
                                ? 'border-red-600 text-red-600 bg-red-50'
                                : 'border-stone-300 text-stone-500 bg-white hover:border-stone-500'
                        ]"
                        @click="selectSubcategory(sub)"
                    >
                        {{ sub.name }}
                    </button>
                </div>

                <!-- Layout principal -->
                <div class="flex gap-8 xl:gap-12 items-start">
                    <!-- ── Sidebar (desktop) ───────────────────────────────── -->
                    <aside class="hidden lg:block w-56 xl:w-64 shrink-0 sticky top-8">
                        <div class="border border-stone-200">

                            <!-- Encabezado de categoría -->
                            <NuxtLink
                                to="/catalogo/klein"
                                class="flex items-center gap-2 px-4 py-3 border-b border-stone-200 bg-stone-50 hover:bg-stone-100 transition-colors group"
                            >
                                <UIcon
                                    name="i-heroicons-arrow-left"
                                    class="w-3 h-3 text-stone-400 group-hover:text-red-600 transition-colors"
                                />
                                <span class="text-xs uppercase tracking-widest text-stone-500 group-hover:text-red-600 transition-colors">
                                    KLEIN
                                </span>
                            </NuxtLink>

                            <div class="px-4 py-3 border-b border-stone-200">
                                <p class="text-sm font-bold text-stone-800 uppercase tracking-wide leading-tight">
                                    {{ selectedGrouping?.name || category?.name }}
                                </p>
                            </div>

                            <!-- Botón volver (si viene de agrupación) -->
                            <button
                                v-if="selectedGrouping"
                                class="w-full px-4 py-2 text-xs text-stone-400 hover:text-red-600 hover:bg-red-50 transition-colors border-b border-stone-200 flex items-center gap-1.5"
                                @click="clearGrouping"
                            >
                                <UIcon name="i-heroicons-arrow-left" class="w-3 h-3" />
                                Volver a opciones
                            </button>

                            <!-- Lista de subcategorías -->
                            <nav class="py-1">
                                <button
                                    v-for="sub in subcategories"
                                    :key="sub.id"
                                    :class="[
                                        'w-full text-left px-4 py-2.5 text-sm transition-colors border-l-2',
                                        selectedSub?.id === sub.id
                                            ? 'border-l-red-600 text-red-600 bg-red-50 font-semibold'
                                            : 'border-l-transparent text-stone-600 hover:text-stone-900 hover:bg-stone-50 font-medium'
                                    ]"
                                    @click="selectSubcategory(sub)"
                                >
                                    {{ sub.name }}
                                </button>
                            </nav>
                        </div>
                    </aside>

                    <!-- ── Contenido principal ────────────────────────────── -->
                    <main class="flex-1 min-w-0">
                        <!-- Título de sección -->
                        <div class="mb-8 xl:mb-10">
                            <h1 class="font-serif text-3xl md:text-4xl xl:text-5xl text-stone-800 leading-tight">
                                {{ selectedSub ? selectedSub.name : (selectedGrouping?.name || category?.name) }}
                            </h1>
                            <div class="mt-3 border-b-4 border-red-600 w-20" />
                        </div>

                        <!-- ── ESTADO 1: Grid de subcategorías ──────────────── -->
                        <div v-if="!selectedSub" class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                            <SubcategoryCard
                                v-for="(sub, index) in subcategories"
                                :key="sub.id"
                                :name="sub.name"
                                :index="index"
                                :image-key="sub.image_key"
                                @select="selectSubcategory(sub)"
                            />
                        </div>

                        <!-- ── ESTADO 2: Productos de la subcategoría ───────── -->
                        <template v-else>

                            <!-- Botón volver -->
                            <button
                                class="flex items-center gap-1.5 text-sm text-stone-400 hover:text-red-600 transition-colors mb-6 -mt-2"
                                @click="clearSub"
                            >
                                <UIcon name="i-heroicons-arrow-left" class="w-4 h-4" />
                                <span>Ver todas las subcategorías</span>
                            </button>

                            <!-- Skeletons de carga -->
                            <div
                                v-if="loadingProducts"
                                class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4"
                            >
                                <USkeleton
                                    v-for="n in 6"
                                    :key="n"
                                    class="h-72"
                                />
                            </div>

                            <!-- Sin resultados -->
                            <div
                                v-else-if="!products?.length"
                                class="flex flex-col items-center justify-center py-24 text-center"
                            >
                                <UIcon name="i-heroicons-cube" class="w-12 h-12 text-stone-200 mb-4" />
                                <p class="text-stone-400 text-lg">Sin productos disponibles en esta subcategoría.</p>
                            </div>

                            <!-- Grid de productos -->
                            <div
                                v-else
                                class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4 xl:gap-6"
                            >
                                <ProductCard
                                    v-for="product in products"
                                    :key="product.id"
                                    :product="product"
                                />
                            </div>

                        </template>

                    </main>
                </div>
            </template>
        </UContainer>
    </div>
</template>

<script setup lang="ts">
    const route = useRoute()
    const router = useRouter()

    const { getCategoryBySlug } = useCategories()
    const { getGroupingsByCategory } = useGroupings()
    const { getSubcategoriesByCategory, getSubcategoriesByGrouping } = useSubcategories()
    const { getProductsBySubcategory } = useProducts()

    // ── 1. CARGAR CATEGORÍA ────────────────────────────────────────────────
    const { data: categoryData } = await useAsyncData(
        `category-${route.params.category_slug}`,
        async () => {
            const { data } = await getCategoryBySlug(route.params.category_slug)
            return data
        }
    )

    const category = computed(() => categoryData.value || {})

    // ── 2. CARGAR AGRUPACIONES ─────────────────────────────────────────────
    const { data: groupingsData } = await useAsyncData(
        `groupings-${category.value?.id}`,
        async () => {
            if (!category.value?.id) return []
            const { data } = await getGroupingsByCategory(category.value.id)
            return data ?? []
        },
        { watch: [() => category.value?.id] }
    )

    const groupings = computed(() => groupingsData.value || [])

    // ── 3. AGRUPACIÓN SELECCIONADA ─────────────────────────────────────────
    const selectedGrouping = computed(() =>
        groupings.value.find(g => g.slug === route.query.grouping) ?? null
    )

    // ── 4. CARGAR SUBCATEGORÍAS ────────────────────────────────────────────
    // Si hay agrupación seleccionada, cargar de la agrupación
    // Si no hay, cargar todas las subcategorías directas de la categoría
    const { data: subcategoriesData } = await useAsyncData(
        () => `subcategories-${selectedGrouping.value?.id || category.value?.id}`,
        async () => {
            if (!category.value?.id) return []

            if (selectedGrouping.value) {
                // Cargar subcategorías de la agrupación
                const { data } = await getSubcategoriesByGrouping(selectedGrouping.value.id)
                return data ?? []
            } else if (groupings.value.length === 0) {
                // No hay agrupaciones, cargar todas directas
                const { data } = await getSubcategoriesByCategory(category.value.id)
                return data ?? []
            }

            return []
        },
        { watch: [() => selectedGrouping.value?.id, () => category.value?.id] }
    )

    const subcategories = computed(() => subcategoriesData.value || [])

    // ── 5. SUBCATEGORÍA SELECCIONADA ───────────────────────────────────────
    const selectedSub = computed(() =>
        subcategories.value.find(s => s.slug === route.query.sub) ?? null
    )

    // ── 6. DETERMINAR PASO ACTUAL ──────────────────────────────────────────
    const paso = computed(() => {
        const { grouping } = route.query

        // Si hay agrupaciones pero no se seleccionó ninguna, mostrar agrupaciones
        if (groupings.value.length > 0 && !grouping) {
            return 'groupings'
        }

        // Si hay una agrupación seleccionada o no hay agrupaciones, mostrar subcategorías
        return 'subcategories'
    })

    // ── 7. CARGAR PRODUCTOS ────────────────────────────────────────────────
    const { data: products, pending: loadingProducts } = await useAsyncData(
        () => `products-${selectedSub.value?.id}`,
        async () => {
            if (!selectedSub.value?.id) return []
            const { data } = await getProductsBySubcategory(selectedSub.value.id)
            return data ?? []
        },
        { watch: [() => selectedSub.value?.id] }
    )

    // ── 8. NAVEGACIÓN ──────────────────────────────────────────────────────

    function selectGrouping(grouping: { slug: string }) {
        router.push({ query: { grouping: grouping.slug } })
    }

    function clearGrouping() {
        router.push({ query: {} })
    }

    function selectSubcategory(sub: { slug: string }) {
        const query: Record<string, string> = { sub: sub.slug }
        if (route.query.grouping) {
            query.grouping = route.query.grouping as string
        }
        router.push({ query })
    }

    function clearSub() {
        if (route.query.grouping) {
            router.push({ query: { grouping: route.query.grouping } })
        } else {
            router.push({ query: {} })
        }
    }

    // ── 9. SEO ─────────────────────────────────────────────────────────────
    useSeoMeta({
        title: () => {
            if (selectedSub.value) {
                return `${selectedSub.value.name} | ${category.value?.name} | RIDGID — APCO Tools`
            }
            if (selectedGrouping.value) {
                return `${selectedGrouping.value.name} | ${category.value?.name} | RIDGID — APCO Tools`
            }
            return `${category.value?.name} | RIDGID — APCO Tools`
        },
    })
</script>