<template>
  <div class="max-w-5xl mx-auto px-4 py-10">
    <UCard v-if="producto">
      <div class="grid md:grid-cols-2 gap-8">

        <img :src="producto.imagen_principal" class="w-full rounded-lg"/>

        <div>
          <h1 class="text-3xl font-bold mb-4">{{ producto.nombre }}</h1>

          <p class="mb-4">{{ producto.descripcion_larga }}</p>

          <p class="text-2xl font-bold text-primary mb-6">${{ producto.precio_venta }}</p>

          <UButton size="lg" disabled>Contactar / Comprar</UButton>
        </div>

      </div>
    </UCard>
  </div>
</template>

<script setup>
const route = useRoute()

const { $supabase } = useNuxtApp()

const { data: producto, error } = await $supabase.from('productos').select(`*, marcas ( nombre )`).eq('slug', route.params.slug).single()

</script>
