<template>
    <section class="bg-red-600 py-12">
        <UContainer>
            <div class="grid grid-cols-2 md:grid-cols-4 divide-x divide-red-500 divide-y md:divide-y-0">
                <div v-for="stat in stats" :key="stat.label" class="text-center px-6 py-4">
                    <UIcon :name="stat.icon" class="text-red-300 text-2xl mb-2" />
                    <p class="text-4xl md:text-5xl font-black text-white">{{ stat.value }}</p>
                    <p class="text-red-100 text-xs uppercase tracking-widest mt-2">{{ stat.label }}</p>
                </div>
            </div>
        </UContainer>
    </section>
</template>

<script setup>
    const stats = [
        { value: '25+',    icon: 'i-heroicons-trophy',        label: 'Años de experiencia' },
        { value: '12+',    icon: 'i-heroicons-tag',           label: 'Marcas líderes' },
        { value: '5,000+', icon: 'i-heroicons-wrench-screwdriver', label: 'Productos disponibles' },
        { value: '100%',   icon: 'i-heroicons-shield-check',  label: 'Garantía de calidad' },
    ];
</script>