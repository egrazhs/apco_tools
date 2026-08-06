<template>
    <section class="container mx-auto">
        <!-- Header con breadcrumb -->
        <div class="pt-20 pb-8 flex items-center gap-2 text-sm text-gray-600">
            <NuxtLink to="/productos" class="hover:text-red-600 transition-colors">
                Productos
            </NuxtLink>
            <span>/</span>
            <span class="text-stone-900 font-semibold">HPTR</span>
        </div>

        <!-- Encabezado con logo y descripción -->
        <div class="mb-16">
            <div class="flex flex-col md:flex-row items-start md:items-center gap-8 mb-8">
                <!-- Logo HPTR -->
                <div class="flex-shrink-0">
                    <img 
                        src="/img/marcas/hptr.jpg" 
                        alt="HPTR"
                        class="h-20 object-contain"
                    />
                </div>
                <!-- Descripción -->
                <div class="flex-grow">
                    <h1 class="text-4xl md:text-5xl font-serif text-stone-900 uppercase tracking-widest mb-4">
                        Catálogo HPTR
                    </h1>
                    <p class="text-gray-700 text-lg">
                        Explora nuestra completa línea de herramientas y equipos profesionales HPTR. 
                        Selecciona una categoría para ver los productos disponibles.
                    </p>
                </div>
            </div>
            <hr class="border-red-600 border-y-4 w-full md:w-[350px]" />
        </div>

        <!-- Loading state -->
        <div v-if="pending" class="text-center py-12">
            <p class="text-gray-500">Cargando categorías...</p>
        </div>

        <!-- Error state -->
        <div v-else-if="error" class="text-center py-12">
            <p class="text-red-600">Error al cargar las categorías: {{ error }}</p>
        </div>

        <!-- Grid de categorías -->
        <div v-else-if="categories && categories.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
            <BrandCategoryCard
                v-for="category in categories"
                :key="category.id"
                :category="category"
                brand="hptr"
            />
        </div>

        <!-- Empty state -->
        <div v-else class="text-center py-12">
            <p class="text-gray-500">No hay categorías disponibles en este momento.</p>
        </div>

        <CatalogoInformacionAdicional />
    </section>
</template>

<script setup>
    const { getCategoriesByBrand } = useCategories()
    
    const BRAND_ID = '18'
    
    const { data: categories, pending, error } = await useAsyncData(
        'categories',
        async () => {
            const { data, error: fetchError } = await getCategoriesByBrand(BRAND_ID)
            
            if (fetchError) {
                console.error('Error fetching categories:', fetchError)
                throw fetchError
            }
            
            return data
        },
        {
            server: true,
            watch: []
        }
    )
</script>