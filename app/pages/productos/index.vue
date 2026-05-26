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

        <!-- Estado de carga -->
        <!--
        <div v-if="pending" class="flex justify-center py-16">
            <div class="space-y-4 w-full max-w-4xl">
                <USkeleton class="h-48 w-full" />
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <USkeleton class="h-56" />
                    <USkeleton class="h-56" />
                    <USkeleton class="h-56" />
                </div>
            </div>
        </div>
        -->

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

        <!-- Sección de información adicional (opcional) -->
        <div class="mt-20 pt-12 border-t border-gray-200">
            <h3 class="text-2xl text-stone-900 mb-4 uppercase tracking-widest">
                ¿No encuentras lo que buscas?
            </h3>
            <p class="text-gray-600 mb-6 max-w-2xl">
                Nuestro equipo de asesores está disponible para ayudarte a encontrar la solución perfecta para tu proyecto. 
                Contáctanos para cotizaciones personalizadas.
            </p>
            <NuxtLink 
                to="/#contacto" 
                class="inline-block bg-red-600 text-white px-8 py-3 uppercase tracking-widest font-semibold text-sm hover:bg-red-700 transition-colors duration-200"
            >
                Solicitar Cotización
            </NuxtLink>
        </div>
    </section>
</template>

<script setup>
const brands = [
    {
        id: 1,
        name: 'RIDGID',
        slug: 'ridgid',
        logo: '/img/ridgid.webp',
        description: 'Herramientas profesionales de drenaje, roscado y eléctricas',
        product_count: 69
    },
];
</script>