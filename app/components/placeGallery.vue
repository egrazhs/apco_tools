<template>
  <section class="py-16">
    <div class="max-w-6xl mx-auto px-4">
      
      <!-- Título -->
      <div class="text-center mb-8">
        <h2 class="text-2xl md:text-3xl font-bold">
          Conoce nuestra ferretería
        </h2>
        <p class="text-gray-500 mt-2">
          Visítanos y encuentra todo lo que necesitas
        </p>
      </div>

      <UCarousel v-slot="{ item }" :items="items" :ui="{ item: 'basis-1/3' }" class="relative overflow-hidden rounded-xl">
        <img :src="item" width="234" height="234" class="rounded-lg">
      </UCarousel>

      <UCarousel
    v-slot="{ item }"
    loop
    arrows
    :autoplay="{ delay: 2000 }"
    wheel-gestures
    :prev="{ variant: 'solid' }"
    :next="{ variant: 'solid' }"
    :items="items"
    :ui="{
      item: 'basis-1/3 ps-0',
      prev: 'sm:start-8',
      next: 'sm:end-8',
      container: 'ms-0'
    }"
  >
    <img :src="item" width="320" height="320">
  </UCarousel>

    </div>
  </section>
</template>

<script setup lang="ts">
  const items = [
    './img/fotos_productos/1.jpeg',
    './img/fotos_productos/2.jpeg',
    './img/fotos_productos/3.jpeg',
    './img/fotos_productos/4.jpeg',
    './img/fotos_productos/5.jpeg',
    './img/fotos_productos/6.jpeg'
  ]
</script>