<template>
    <NuxtLink :to="`/catalogo/${brand.slug}`" class="group">
        <article class="bg-gray-200 p-8 min-h-64 flex flex-col justify-between hover:shadow-lg transition-all duration-300 cursor-pointer">
            
            <!-- Logo de marca -->
            <div class="flex justify-center items-center h-24 mb-6 bg-white">
                <img 
                    :src="brand.logo" 
                    :alt="brand.name"
                    class="h-20 object-contain transition-transform duration-300 group-hover:scale-110"
                />
            </div>

            <!-- Nombre de marca
            <h3 class="text-3xl text-stone-900 text-center mb-4 uppercase tracking-widest">
                {{ brand.name }}
            </h3>
            -->

            <!-- Descripción -->
            <p class="text-gray-700 text-sm leading-relaxed text-center mb-6 flex-grow">
                {{ brand.description }}
            </p>

            <!-- Badge con cantidad de productos -->
            <div class="flex justify-center items-center gap-3">
                <span v-if="brand.product_count > 0" class="inline-block bg-red-600 text-white text-xs uppercase tracking-widest px-3 py-1">
                    {{ brand.product_count }} producto{{ brand.product_count !== 1 ? 's' : '' }}
                </span>
                <span class="inline-block text-red-600 font-semibold text-sm uppercase tracking-widest group-hover:translate-x-1 transition-transform duration-300">
                    Ver →
                </span>
            </div>

        </article>
    </NuxtLink>
</template>

<script setup>
defineProps({
    brand: {
        type: Object,
        required: true,
        validator: (brand) => {
            return brand.id && brand.name && brand.slug && brand.logo;
        }
    }
});
</script>