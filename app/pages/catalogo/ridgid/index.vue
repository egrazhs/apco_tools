<template>
    <section class="container mx-auto">
        <!-- Header con breadcrumb -->
        <div class="pt-20 pb-8 flex items-center gap-2 text-sm text-gray-600">
            <NuxtLink to="/productos" class="hover:text-red-600 transition-colors">
                Productos
            </NuxtLink>
            <span>/</span>
            <span class="text-stone-900 font-semibold">RIDGID</span>
        </div>

        <!-- Encabezado con logo y descripción -->
        <div class="mb-16">
            <div class="flex flex-col md:flex-row items-start md:items-center gap-8 mb-8">
                <!-- Logo RIDGID -->
                <div class="flex-shrink-0">
                    <img 
                        src="/img/ridgid.webp" 
                        alt="RIDGID"
                        class="h-20 object-contain"
                    />
                </div>

                <!-- Descripción -->
                <div class="flex-grow">
                    <h1 class="text-4xl md:text-5xl font-serif text-stone-900 uppercase tracking-widest mb-4">
                        Catálogo RIDGID
                    </h1>
                    <p class="text-gray-700 text-lg">
                        Explora nuestra completa línea de herramientas y equipos profesionales RIDGID. 
                        Selecciona una categoría para ver los productos disponibles.
                    </p>
                </div>
            </div>

            <hr class="border-red-600 border-y-4 w-full md:w-[350px]" />
        </div>

        <!-- Grid de categorías -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
            <BrandCategoryCard
                v-for="category in categories"
                :key="category.id"
                :category="category"
            />
        </div>

        <!-- Sección adicional -->
        <div class="py-12 border-t border-gray-200">
            <h3 class="text-2xl font-serif text-stone-900 mb-4 uppercase tracking-widest">
                ¿Necesitas ayuda?
            </h3>
            <p class="text-gray-600 mb-6 max-w-2xl">
                Si no encuentras el producto que buscas o necesitas una cotización personalizada, 
                nuestro equipo de asesores está disponible para ayudarte.
            </p>
            <NuxtLink 
                to="/#contacto" 
                class="inline-block bg-red-600 text-white px-8 py-3 uppercase tracking-widest font-semibold text-sm hover:bg-red-700 transition-colors duration-200"
            >
                Contactar
            </NuxtLink>
        </div>
    </section>
</template>

<script setup>

const categories = ref([
    {
        id: 1,
        name: 'Diagnóstico, inspección y localización',
        slug: 'diagnostico-inspeccion-localizacion',
        label: 'Diagnóstico, inspección y localización',
        image: 'https://cdn2.ridgid.com/resources/images/7bfb046a-59ab-4f7d-9090-f3ca4cd9dda2',
        description: 'Las herramientas de diagnóstico, inspección y localización de tuberías o líneas soterradas SeeSnake® y SeekTech® de RIDGID® fijan el estándar de calidad en cuanto a robustez, capacidad de empuje y facilidad de uso.'
    },
    {
        id: 2,
        name: 'Prensado',
        slug: 'prensado',
        label: 'Prensado',
        image: 'https://cdn2.ridgid.com/resources/images/2fc380f1-e91c-47a9-9014-494aae18aaac',
        description: 'Las herramientas de prensado RIDGID® no tienen rival en la producción de conexiones rápidas y fiables en tubos multicapa, PEX, de acero inoxidable y cobre.'
    },
    {
        id: 3,
        name: 'Limpieza de Drenajes',
        slug: 'limpieza-de-drenajes',
        label: 'Limpieza de Drenaje',
        image: 'https://cdn2.ridgid.com/resources/images/96104a12-8391-42a3-b716-9cba6d94cfd0',
        description: 'Las limpiadoras de drenajes RIDGID®, que incluyen herramientas manuales, máquinas para fregaderos, limpiadoras seccionales/a tambor y limpiadoras de alta presión, han ofrecido a los profesionales un rendimiento fiable durante décadas.'
    },
    {
        id: 4,
        name: 'Fabricación de roscado y tuberías',
        slug: 'frabricacion-de-roscado-y-tuberias',
        label: 'Fabricación de roscado y tuberías',
        image: 'https://cdn2.ridgid.com/resources/images/ea5b5b38-3626-40d6-8288-d0dbd0f1ee05',
        description: 'Herramientas de confianza para los trabajos de roscado y fabricación de tubos más exigentes.'
    },
    {
        id: 5,
        name: 'Llaves y herramientas para tubos',
        slug: 'llaves-y-herramientas-para-tubos',
        label: 'Llaves y herramientas para tubos',
        image: 'https://cdn2.ridgid.com/resources/images/1731f14f-7929-438e-88fe-aec050b3884b',
        description: 'Llaves de alta resistencia para los trabajos más difíciles y herramientas para doblar, prensar y preparar tuberías.'
    },
    {
        id: 6,
        name: 'Herramientas de servicios públicos y de electricistas',
        slug: 'herramientas-de-servicios-publicos',
        label: 'Herramientas de servicios públicos y de electricistas',
        image: 'https://cdn2.ridgid.com/resources/images/ebe18bdd-dce2-4e71-a963-dcc248f16d22',
        description: 'Las herramientas de servicios públicos y de electricistas RIDGID® mezclan innovación con eficiencia para realizar un trabajo rápido de corte de cables, engarzado de terminales y perforación de cajas/tableros.'
    },
    {
        id: 7,
        name: 'Herramientas de uso general y manuales',
        slug: 'herramientas-de-uso-general-y-manuales',
        label: 'Herramientas de uso general y manuales',
        image: 'https://cdn2.ridgid.com/resources/images/b4789841-c3b0-4770-ac2a-7ce7c9d96748',
        description: 'Las herramientas RIDGID® de uso general, desde yunques hasta tornillos de banco, ofrecen el mismo nivel de robustez y confiabilidad que usted espera de nuestra marca.'
    },
    {
        id: 8,
        name: 'Aspiradoras para sólidos y líquidos',
        slug: 'aspiradoras-para-solidos-y-liquidos',
        label: 'Aspiradoras para sólidos y líquidos',
        image: 'https://cdn2.ridgid.com/resources/images/e33ff25a-37ba-4266-8bb7-2c69bc23df49',
        description: 'Las aspiradoras para sólidos y líquidos RIDGID®, tanto grandes como pequeñas, están a la vanguardia en cuanto a su potencia, rendimiento y durabilidad para hacer bien el trabajo.'
    },
]);
</script>