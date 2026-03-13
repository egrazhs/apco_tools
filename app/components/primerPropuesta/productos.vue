<template>
    <section id="productos" class="py-16 md:py-28 bg-stone-900">
        <UContainer>

            <!-- Header -->
            <div class="flex flex-col md:flex-row md:items-end justify-between mb-12 md:mb-16 gap-6">
                <div>
                    <p class="text-red-500 uppercase tracking-[0.35em] text-xs font-semibold mb-4 text-center md:text-left">
                        Lo que encontrarás
                    </p>
                    <h2 class="text-4xl md:text-5xl font-black text-white uppercase leading-tight text-center md:text-left">
                        Nuestros <span class="text-red-600">Productos</span>
                    </h2>
                </div>
                <UButton
                    to="/productos"
                    class="text-stone-400 hover:text-red-500 uppercase tracking-widest text-xs font-bold bg-transparent hover:bg-transparent mx-auto md:mx-0"
                    variant="ghost"
                >
                    Ver catálogo completo →
                </UButton>
            </div>

            <!-- Cards -->
            <div class="grid grid-cols-1 md:grid-cols-3 border border-stone-700">
                <article
                    v-for="(product, i) in products"
                    :key="product.title"
                    class="group relative overflow-hidden cursor-pointer"
                    :class="i < products.length - 1 ? 'border-b md:border-b-0 md:border-r border-stone-700' : ''"
                >
                    <!-- Imagen con overlay permanente -->
                    <div class="aspect-[4/3] overflow-hidden">
                        <img
                            :src="product.img"
                            :alt="product.title"
                            class="w-full h-full object-cover opacity-40 md:opacity-50 group-hover:opacity-25 group-hover:scale-105 transition-all duration-700"
                        />
                    </div>

                    <!-- Contenido siempre visible -->
                    <div class="absolute inset-0 flex flex-col justify-end p-6 md:p-8 bg-gradient-to-t from-stone-950/90 via-stone-950/30 to-transparent">
                        <div class="w-8 h-1 bg-red-600 mb-4 group-hover:w-16 transition-all duration-300" />
                        <h3 class="text-lg md:text-xl font-black text-white uppercase leading-tight mb-3">
                            {{ product.title }}
                        </h3>
                        <!-- Descripción siempre visible en mobile, animada en desktop -->
                        <p class="text-stone-300 text-sm leading-relaxed md:opacity-0 md:max-h-0 md:group-hover:opacity-100 md:group-hover:max-h-32 md:overflow-hidden md:transition-all md:duration-500">
                            {{ product.desc }}
                        </p>
                        <!-- CTA -->
                        <p class="text-red-500 text-xs uppercase tracking-widest font-bold mt-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 hidden md:block">
                            Ver más →
                        </p>
                    </div>
                </article>
            </div>

        </UContainer>
    </section>
</template>

<script setup>
    const products = [
        {
            img: '/img/productos_1.webp',
            title: 'Equipo de limpieza de drenaje',
            desc: 'Construidos para los profesionales más exigentes. Décadas acompañando a plomeros desde aprendices hasta su retiro.',
        },
        {
            img: '/img/productos_2.webp',
            title: 'Tarrajas para roscado',
            desc: 'Fabricación y roscado de tuberías con durabilidad sin comparación. Diseñados para entornos extremos.',
        },
        {
            img: '/img/productos_3.webp',
            title: 'Herramienta eléctrica y de batería',
            desc: 'Potentes, duraderas y profesionales. Respaldadas por la mejor garantía de la industria.',
        },
    ];
</script>