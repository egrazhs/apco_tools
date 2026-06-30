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
                        Productos <span class="text-red-600">Destacados</span>
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
                <NuxtLink
                    v-for="(product, i) in products"
                    :key="product.sku"
                    :to="`/productos/${product.slug}`"
                    class="group relative overflow-hidden block"
                    :class="i < products.length - 1 ? 'border-b md:border-b-0 md:border-r border-stone-700' : ''"
                >
                    <!-- Imagen -->
                    <div class="aspect-[4/3] overflow-hidden bg-stone-800 relative">
                        <img
                            :src="product.img"
                            :alt="product.name"
                            class="w-full h-full object-contain p-6 opacity-80 group-hover:opacity-60 group-hover:scale-105 transition-all duration-700"
                        />
                        <!-- SKU badge sobre la imagen, esquina superior izquierda -->
                        <span class="absolute top-3 left-3 bg-stone-900/80 text-stone-300 text-[10px] uppercase tracking-widest font-mono px-2 py-1 backdrop-blur-sm">
                            {{ product.sku }}
                        </span>
                    </div>
 
                    <!-- Contenido con gradiente -->
                    <div class="absolute inset-0 flex flex-col justify-end p-6 md:p-8 bg-gradient-to-t from-stone-950/95 via-stone-950/40 to-transparent">
 
                        <!-- Acento rojo animado -->
                        <div class="w-8 h-0.5 bg-red-600 mb-3 group-hover:w-16 transition-all duration-300" />
 
                        <!-- Nombre -->
                        <h3 class="text-base md:text-lg font-black text-white uppercase leading-tight mb-2">
                            {{ product.name }}
                        </h3>
 
                        <!-- Descripción: siempre visible en mobile, animada en desktop -->
                        <p class="text-stone-400 text-xs leading-relaxed md:opacity-0 md:max-h-0 md:group-hover:opacity-100 md:group-hover:max-h-24 md:overflow-hidden md:transition-all md:duration-500">
                            {{ product.desc }}
                        </p>
 
                        <!-- CTA -->
                        <div class="flex items-center gap-2 mt-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <span class="text-red-500 text-[11px] uppercase tracking-widest font-bold">
                                Ver producto
                            </span>
                            <span class="text-red-500 text-sm">→</span>
                        </div>
                    </div>
                </NuxtLink>
            </div>
 
            <!-- Nota inferior -->
            <p class="text-center text-stone-600 text-xs mt-6 uppercase tracking-widest">
                Distribuidores autorizados RIDGID en Guadalajara
            </p>
 
        </UContainer>
    </section>
</template>

<script setup>
    const products = [
        {
            sku: 'No. Cat. 61748',
            slug: 'aspiradora-12-galones-5-hp-mod-rt1200m',
            name: 'Máquina Sectorial de Limpieza 12 Gal K-60SP',
            img: 'https://http2.mlstatic.com/D_NQ_NP_2X_947032-MLA99464329204_112025-F.webp',
            desc: 'Compacta y portátil, pero con potencia para desazolves difíciles. Motor ½ HP, ideal para drenajes residenciales, comerciales e industriales de 1¼" a 4".',
        },
        {
            sku: 'No. Cat. 36475',
            slug: 'tarraja-manual-12---2-npt-mod-12r',
            name: 'Set de Tarraja Manual 12-R (½" a 2")',
            img: 'https://www.toolferreterias.com/cdn/shop/products/179060116-1_1868633a-d28e-42d4-b2d0-08d9148a1ed4.jpg',
            desc: 'Set completo con 6 cabezales intercambiables de hierro dúctil para tubería ½" a 2" NPT. Compatibles con roscadoras eléctricas. Incluye maletín.',
        },
        {
            sku: 'No. Cat. 36345',
            slug: 'tarraja-manual-12---1-npt-mod-00r',
            name: 'Set de Tarraja Manual 00-R (½" a 1")',
            img: 'https://www.toolferreterias.com/cdn/shop/products/179060110-3.jpg',
            desc: 'Diseñada para roscar tuberías y conduit de ½" a 1" NPT. Liviana y robusta, con 3 cabezales de precisión y operación manual por trinquete.',
        },
    ];
</script>