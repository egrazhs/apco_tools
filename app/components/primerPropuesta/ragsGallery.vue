<template>
    <section class="py-24 bg-stone-100">
        <UContainer>
            <div class="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
                <div>
                    <p class="text-red-600 uppercase tracking-[0.35em] text-xs font-semibold mb-3">
                        En exhibición
                    </p>
                    <h2 class="text-4xl md:text-5xl font-black text-stone-900 uppercase leading-tight">
                        Productos <span class="text-red-600">en Tienda</span>
                    </h2>
                </div>
            </div>

            <UCarousel
                v-slot="{ item }"
                loop
                arrows
                :autoplay="{ delay: 4000 }"
                wheel-gestures
                :items="items"
                :ui="{
                    item: 'basis-1/2 md:basis-1/3 ps-4',
                    container: 'ms-0',
                }"
            >
                <div class="overflow-hidden aspect-square bg-stone-200 group cursor-pointer">
                    <img
                        :src="item"
                        class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        alt="Producto en tienda"
                    />
                </div>
            </UCarousel>
        </UContainer>
    </section>
</template>

<script setup>
    const items = [
        '/img/fotos_productos/1.jpeg',
        '/img/fotos_productos/2.jpeg',
        '/img/fotos_productos/3.jpeg',
        '/img/fotos_productos/4.jpeg',
        '/img/fotos_productos/5.jpeg',
        '/img/fotos_productos/6.jpeg',
    ];
</script>