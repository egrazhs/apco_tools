<template>
  <section class="py-20 bg-gray-50">
    <UContainer>

      <!-- Header -->
      <div class="text-center mb-12">
        <p class="text-sm uppercase tracking-widest text-gray-500 mb-3">
          Trabajamos con marcas que ya conoces
        </p>

        <h2 class="text-3xl md:text-4xl font-bold text-gray-900">
          Las marcas que encuentras con nosotros
        </h2>

        <p class="mt-4 text-gray-600 max-w-2xl mx-auto">
          Calidad, variedad y buen precio para cada proyecto.
        </p>
      </div>

      <!-- Carousel -->
      <UCarousel
        :items="brands"
        :ui="{ item: 'basis-1/2 sm:basis-1/3 md:basis-1/4 lg:basis-1/6' }"
        autoScroll
        arrows
        loop
        indicators
        class="mb-12"
      >
        <template #default="{ item }">
          <div class="flex items-center justify-center p-6">
            <img
              :src="item.logo"
              :alt="item.name"
              class="h-12 md:h-16 object-contain transition duration-300 hover:scale-110"
            />
          </div>
        </template>
      </UCarousel>

      <!-- Botón -->
      <div class="text-center">
        <UButton to="/marcas" variant="outline" size="lg">Ver todas las marcas</UButton>
      </div>

    </UContainer>
  </section>
</template>

<script setup>
const brands = [
  { name: 'Truper', logo: './img/marcas/truper.jpg' },
  { name: 'Klein Tools', logo: './img/marcas/klein.png' },
  { name: 'RIDGID', logo: './img/marcas/ridgid.webp' },
  { name: 'DeWalt', logo: './img/marcas/dewalt.webp' },
  { name: 'WURTH', logo: './img/marcas/wuth.png' },
  { name: 'Leatherman', logo: './img/marcas/leatherman.jpg' },
  { name: 'Morse', logo: './img/marcas/Morse.png' },
  { name: 'Weston', logo: './img/marcas/weston.png' },
  { name: 'Diager', logo: './img/marcas/diager.png' },
  { name: 'Dogo Tuls', logo: './img/marcas/dogo.png' },
  { name: 'victorinox', logo: './img/marcas/victorinox.png' },
  { name: 'Knipex', logo: './img/marcas/knipex.webp' },
];
</script>
