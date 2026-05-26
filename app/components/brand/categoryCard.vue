<template>
    <NuxtLink :to="`/catalogo/ridgid/${category.slug}`" class="group relative overflow-hidden h-64 md:h-72 block">
        <!-- Imagen de fondo -->
        <img 
            :src="category.image" 
            :alt="category.name"
            class="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        
        <!-- Overlay oscuro base -->
        <div class="absolute inset-0 bg-black/40 transition-colors duration-300 group-hover:bg-red-600/90"></div>

        <!-- Contenido - texto y label -->
        <div class="absolute inset-0 flex flex-col items-center justify-center p-6">
            <!-- Label pequeño en la esquina superior (visible siempre) -->
            <span class="absolute top-4 right-4 text-white text-xs uppercase tracking-widest font-semibold opacity-100">
                {{ category.label }}
            </span>

            <!-- Título principal - visible solo en hover -->
            <h3 class="text-white text-center font-serif text-2xl md:text-3xl uppercase tracking-widest leading-tight transition-opacity duration-300 opacity-0 group-hover:opacity-100">
                {{ category.name }}
            </h3>

            <!-- Descripción - visible solo en hover -->
            <p v-if="category.description" class="text-white text-sm text-center mt-3 transition-opacity duration-300 opacity-0 group-hover:opacity-100 max-w-xs">
                {{ category.description }}
            </p>
        </div>

        <!-- CTA flecha - visible en hover -->
        <div class="absolute bottom-4 right-4 text-white font-semibold text-lg transition-opacity duration-300 opacity-0 group-hover:opacity-100">
            →
        </div>
    </NuxtLink>
</template>

<script setup>
defineProps({
    category: {
        type: Object,
        required: true,
        validator: (category) => {
            return category.id && category.name && category.slug && category.image;
        }
    }
});
</script>