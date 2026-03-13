<template>
    <div class="grid gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        <ProductCard
            v-for="(product, index) in products"
            :key="product.id"
            :product="product"
            :style="{ animationDelay: `${index * 60}ms` }"
            class="animate-fade-in"
        />
    </div>
</template>

<script setup>
    defineProps({
        products: {
            type: Array,
            required: true
        }
    })
</script>

<style scoped>
    @keyframes fade-in {
        from { opacity: 0; transform: translateY(16px); }
        to   { opacity: 1; transform: translateY(0); }
    }
    .animate-fade-in {
        opacity: 0;
        animation: fade-in 0.4s ease forwards;
    }
</style>