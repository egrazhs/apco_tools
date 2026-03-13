<template>
    <section id="marcas" class="py-16 md:py-24 bg-white">
        <UContainer>

            <!-- Header -->
            <div class="text-center mb-14">
                <p class="text-red-600 uppercase tracking-[0.35em] text-xs font-semibold mb-4">
                    Distribuidores autorizados
                </p>
                <h2 class="text-4xl md:text-5xl font-black text-stone-900 uppercase leading-tight">
                    Marcas que <span class="text-red-600">Reconoces</span>
                </h2>
                <p class="mt-4 text-stone-500 max-w-xl mx-auto">
                    Calidad garantizada de los fabricantes líderes en herramienta profesional.
                </p>
            </div>

            <!-- Grid de marcas -->
            <div class="bg-stone-50 border-y border-stone-200 py-8 mb-14">
                <div class="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
                    <div
                        v-for="brand in brands"
                        :key="brand.name"
                        class="flex items-center justify-center h-20 px-4 opacity-60 hover:opacity-100 transition-opacity duration-300"
                    >
                        <img
                            :src="brand.logo"
                            :alt="brand.name"
                            class="max-h-12 max-w-full object-contain"
                        />
                    </div>
                </div>
            </div>

            <!-- CTA -->
            <div class="text-center">
                <UButton
                    to="/productos"
                    size="lg"
                    class="rounded-none uppercase tracking-widest font-black px-10 bg-red-600 hover:bg-stone-900 text-white transition-colors duration-300"
                >
                    Ver Catálogo Completo
                </UButton>
                <p class="text-stone-400 text-xs mt-4">
                    * Precios sujetos a cambio sin previo aviso · Consulta promociones con nuestros asesores
                </p>
            </div>

        </UContainer>
    </section>
</template>

<script setup>
    const brands = [
        { name: 'Truper',      logo: '/img/marcas/truper.jpg' },
        { name: 'Klein Tools', logo: '/img/marcas/klein.png' },
        { name: 'RIDGID',      logo: '/img/marcas/ridgid.webp' },
        { name: 'DeWalt',      logo: '/img/marcas/dewalt.webp' },
        { name: 'WURTH',       logo: '/img/marcas/wuth.png' },
        { name: 'Leatherman',  logo: '/img/marcas/leatherman.jpg' },
        { name: 'Morse',       logo: '/img/marcas/Morse.png' },
        { name: 'Weston',      logo: '/img/marcas/weston.png' },
        { name: 'Diager',      logo: '/img/marcas/diager.png' },
        { name: 'Dogo Tuls',   logo: '/img/marcas/dogo.png' },
        { name: 'Victorinox',  logo: '/img/marcas/victorinox.png' },
        { name: 'Knipex',      logo: '/img/marcas/knipex.webp' },
    ];
</script>