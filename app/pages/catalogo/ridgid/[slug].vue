<template>
    <div class="min-h-screen bg-white">
        <UContainer class="py-8 md:py-12 xl:py-16">
 
            <!-- Breadcrumb -->
            <nav class="flex items-center gap-2 text-xs uppercase tracking-widest text-stone-400 mb-8">
                <NuxtLink to="/" class="hover:text-red-600 transition-colors">Inicio</NuxtLink>
                <span>/</span>
                <NuxtLink to="/productos" class="hover:text-red-600 transition-colors">Catálogo</NuxtLink>
                <span>/</span>
                <NuxtLink to="/catalogo/ridgid" class="hover:text-red-600 transition-colors">RIDGID</NuxtLink>
                <span>/</span>
                <span class="text-stone-600">{{ category?.name }}</span>
            </nav>
 
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
 
                <!-- ── Sidebar (desktop) ───────────────────────────────────── -->
                <aside class="hidden lg:block w-56 xl:w-64 shrink-0 sticky top-8">
                    <div class="border border-stone-200">
 
                        <!-- Encabezado de categoría -->
                        <NuxtLink
                            to="/catalogo/ridgid"
                            class="flex items-center gap-2 px-4 py-3 border-b border-stone-200 bg-stone-50 hover:bg-stone-100 transition-colors group"
                        >
                            <UIcon
                                name="i-heroicons-arrow-left"
                                class="w-3 h-3 text-stone-400 group-hover:text-red-600 transition-colors"
                            />
                            <span class="text-xs uppercase tracking-widest text-stone-500 group-hover:text-red-600 transition-colors">
                                RIDGID
                            </span>
                        </NuxtLink>
 
                        <div class="px-4 py-3 border-b border-stone-200">
                            <p class="text-sm font-bold text-stone-800 uppercase tracking-wide leading-tight">
                                {{ category?.name }}
                            </p>
                        </div>
 
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
 
                <!-- ── Contenido principal ─────────────────────────────────── -->
                <main class="flex-1 min-w-0">
 
                    <!-- Título de sección -->
                    <div class="mb-8 xl:mb-10">
                        <h1 class="font-serif text-3xl md:text-4xl xl:text-5xl text-stone-800 leading-tight">
                            {{ selectedSub ? selectedSub.name : category?.name }}
                        </h1>
                        <div class="mt-3 border-b-4 border-red-600 w-20" />
                    </div>
 
                    <!-- ── ESTADO 1: Grid de subcategorías ──────────────────── -->
                    <div v-if="!selectedSub" class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                        <button
                            v-for="(sub, index) in subcategories"
                            :key="sub.id"
                            class="group border-2 border-stone-200 hover:border-red-600 p-6 text-left transition-colors"
                            @click="selectSubcategory(sub)"
                        >
                            <span class="text-4xl font-bold text-stone-100 group-hover:text-red-100 transition-colors">
                                {{ String(index + 1).padStart(2, '0') }}
                            </span>
                            <p class="mt-2 text-stone-800 font-semibold text-lg leading-tight">{{ sub.name }}</p>
                            <div class="mt-4 flex items-center gap-1 text-red-600 opacity-0 group-hover:opacity-100 transition-opacity">
                                <span class="text-xs uppercase tracking-widest">Ver productos</span>
                                <UIcon name="i-heroicons-arrow-right" class="w-3 h-3" />
                            </div>
                        </button>
                    </div>
 
                    <!-- ── ESTADO 2: Productos de la subcategoría ───────────── -->
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
        </UContainer>
    </div>
</template>

<script setup lang="ts">
const route = useRoute()
const router = useRouter()

const { getCategoryBySlug } = useCategories()
const { getSubcategoriesByCategory } = useSubcategories()
const { getProductsBySubcategory } = useProducts()

const { data:category_data } = await getCategoryBySlug(route.params.slug)
const { data: subcategories_data } = await getSubcategoriesByCategory(category_data.id)

const category = ref(category_data || {} )
const subcategories = ref(subcategories_data || [])

const selectedSub = computed(() =>
    subcategories.value.find(s => s.slug === route.query.sub) ?? null
)


// ── 3. Productos de la subcategoría seleccionada ──────────────────────────────
const { data: products, pending: loadingProducts } = await useAsyncData(
    `products-${route.query.sub}`,   // ← clave por sub, no por slug de categoría
    async () => {
        if (!selectedSub.value) return []
        const { data } = await getProductsBySubcategory(selectedSub.value.id)
        return data ?? []
    },
    { watch: [() => route.query.sub] }
)

// ── Navegación ────────────────────────────────────────────────────────────────
function selectSubcategory(sub: { slug: string }) {
    router.push({ query: { sub: sub.slug } })
}

function clearSub() {
    router.push({ query: {} })
}

// ── SEO ───────────────────────────────────────────────────────────────────────
useSeoMeta({
    title: () => selectedSub.value
        ? `${selectedSub.value.name} | ${category.value?.name} | RIDGID — APCO Tools`
        : `${category.value?.name} | RIDGID — APCO Tools`,
})
</script>