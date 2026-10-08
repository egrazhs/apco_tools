<template>
    <section class="w-full bg-stone-950">
        <UCarousel
            :items="items"
            loop
            arrows
            dots
            :autoplay="{ delay: 5000 }"
        >
            <template #default="{ item }">
                <div class="relative w-full h-[320px] md:h-[480px] xl:h-[600px] 2xl:h-[720px] overflow-hidden">
                    <img
                        :src="item"
                        alt="Nuestro local"
                        class="w-full h-full object-cover object-center"
                        draggable="false"
                    />
                    <div class="absolute inset-0 bg-stone-950/40" />

                    <div class="absolute inset-0 flex flex-col items-center justify-end pb-16 px-6 text-center">
                        <p class="text-red-400 uppercase tracking-[0.35em] text-xs font-semibold mb-3">
                            Av. La Paz 1181, Col. Centro, Guadalajara
                        </p>
                        <h2 class="text-white text-3xl md:text-5xl font-black uppercase tracking-tight drop-shadow-xl">
                            Visítanos en Tienda
                        </h2>
                    </div>
                </div>
            </template>
        </UCarousel>
    </section>
</template>

<script setup lang="ts">
    const items = [
        '/img/fotos_local/7.png',
        '/img/fotos_local/2.jpeg',
        '/img/fotos_local/3.jpeg',
        '/img/fotos_local/8.jpeg',
        '/img/fotos_local/5.jpeg',
        '/img/fotos_local/6.jpeg'
    ];
</script>