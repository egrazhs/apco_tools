<template>
    <div class="min-h-screen bg-white">
        <UContainer class="py-8 md:py-12 xl:py-16">
            <!-- Breadcrumb -->
            <nav class="flex items-center gap-2 text-xs uppercase tracking-widest text-stone-400 mb-8">
                <NuxtLink to="/" class="hover:text-red-600 transition-colors">
                    Inicio
                </NuxtLink>
                <span>/</span>
                <NuxtLink to="/productos" class="hover:text-red-600 transition-colors">
                    Catálogo
                </NuxtLink>
                <span>/</span>
                <span class="text-stone-600">WURTH</span>
            </nav>

            <!-- Header con logo y descripción -->
            <div class="mb-12 xl:mb-16">
                <div class="flex flex-col md:flex-row items-start md:items-center gap-8 mb-8">
                    <!-- Logo WURTH -->
                    <div class="flex-shrink-0">
                        <img
                            src="/img/marcas/wuth.png"
                            alt="WURTH"
                            class="h-20 object-contain"
                        />
                    </div>

                    <!-- Descripción -->
                    <div class="flex-grow">
                        <h1 class="text-4xl md:text-5xl font-serif text-stone-900 uppercase tracking-widest mb-4">
                            Catálogo WURTH
                        </h1>
                        <p class="text-gray-700 text-lg leading-relaxed">
                            Descubre nuestra selección de herramientas y suministros industriales de la marca WURTH.
                            Productos de excelente calidad para profesionales y empresas.
                        </p>
                    </div>
                </div>

                <hr class="border-red-600 border-y-4 w-full md:w-[350px]" />
            </div>

            <!-- Estado: Cargando productos -->
            <div v-if="pending" class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 xl:gap-5">
                <USkeleton
                    v-for="n in 10"
                    :key="n"
                    class="h-72"
                />
            </div>

            <!-- Estado: Error al cargar -->
            <div v-else-if="error" class="flex flex-col items-center justify-center py-24 text-center">
                <UIcon name="i-heroicons-exclamation-triangle" class="w-12 h-12 text-red-600 mb-4" />
                <p class="text-stone-600 text-lg">
                    Ocurrió un error al cargar los productos.
                </p>
                <p class="text-stone-400 text-sm mt-2">
                    Por favor, intenta recargar la página.
                </p>
            </div>

            <!-- Estado: Sin productos -->
            <div v-else-if="!products || products.length === 0" class="flex flex-col items-center justify-center py-24 text-center">
                <UIcon name="i-heroicons-cube" class="w-12 h-12 text-stone-200 mb-4" />
                <p class="text-stone-400 text-lg">
                    No hay productos disponibles en este momento.
                </p>
            </div>

            <!-- Grid de productos -->
            <div v-else class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 xl:gap-5 mb-20">
                <ProductCard
                    v-for="product in products"
                    :key="product.id"
                    :product="product"
                />
            </div>

            <!-- Información adicional -->
            <CatalogoInformacionAdicional />
        </UContainer>
    </div>
</template>

<script setup lang="ts">
    const { getProductsByBrand } = useProducts()

    const BRAND_ID = '8' // WURTH

    // ── 1. CARGAR PRODUCTOS DE WURTH ───────────────────────────────────────
    const { data: products, pending, error } = await useAsyncData(
        'wurth-products',
        async () => {
            try {
                const { data, error: fetchError } = await getProductsByBrand(BRAND_ID)

                if (fetchError) {
                    console.error('Error fetching WURTH products:', fetchError)
                    throw fetchError
                }

                return data || []
            } catch (err) {
                console.error('Unexpected error in WURTH catalog:', err)
                throw err
            }
        },
        {
            server: true,
            watch: []
        }
    )

    // ── 2. SEO ─────────────────────────────────────────────────────────────
    useSeoMeta({
        title: 'Catálogo WURTH | APCO Tools',
        description: 'Explora herramientas y suministros industriales WURTH disponibles en APCO Tools.',
        ogTitle: 'Catálogo WURTH | APCO Tools',
        ogDescription: 'Explora herramientas y suministros industriales WURTH disponibles en APCO Tools.',
    })
</script>