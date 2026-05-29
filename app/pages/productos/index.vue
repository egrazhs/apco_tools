<template>
    <section id="productos" class="container mx-auto">
        <!-- Header con título -->
        <div class="pt-28 mb-12">
            <h3 class="uppercase text-5xl md:text-6xl text-[#9a9a9a] font-serif">Productos</h3>
            <hr class="border-red-600 border-y-4 w-full px-0 md:w-[350px]" />
        </div>

        <!-- Hero section -->
        <div class="mb-16 text-center">
            <h2 class="text-3xl md:text-4xl font-serif text-stone-900 mb-4">
                Selecciona una Marca
            </h2>
            <p class="text-gray-600 max-w-2xl mx-auto mb-4">
                Explora nuestro catálogo de herramientas y equipos profesionales de las mejores marcas del mercado.
            </p>
            <p class="text-sm text-gray-500">
                <em>Haz clic en una marca para ver todos sus productos disponibles.</em>
            </p>
        </div>

        <!-- Grid de marcas -->
        <div v-if="brands && brands.length > 0" class="mb-16">
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <BrandCard
                    v-for="brand in brands"
                    :key="brand.id"
                    :brand="brand"
                />
            </div>
        </div>

        <!-- Sin marcas (fallback) -->
        <div v-else class="text-center py-16">
            <p class="text-gray-500 text-lg mb-4">
                Aún no hay marcas disponibles. Por favor, contacta a nuestro equipo.
            </p>
            <NuxtLink to="/#contacto" class="text-red-600 font-semibold hover:text-red-700">
                Ir a Contacto →
            </NuxtLink>
        </div>

        <CatalogoInformacionAdicional />
    
    </section>
</template>

<script setup>
    const { getBrands } = useBrands()
    const { getTotalProductsByBrand } = useProducts()

    const { data: brands } = await useAsyncData('brands-with-counts', async () => {
        const { data: raw_brands } = await getBrands()
        if (!raw_brands) return []

        const with_counts = await Promise.all(
            raw_brands.map(async (brand) => {
                const { count } = await getTotalProductsByBrand(brand.id)
                return { ...brand, product_count: count ?? 0 }
            })
        )

        // Solo muestra marcas que tienen al menos un producto activo
        return with_counts.filter(brand => brand.product_count > 0)
    })
</script>