<template>
  <div>
    <h1 class="text-4xl">Marcas</h1>

    <ul v-if="marcas.length">
      <li v-for="marca in marcas" :key="marca.id">
        {{ marca.nombre }}
      </li>
    </ul>

    <p v-else>Cargando marcas...</p>
  </div>
</template>

<script setup>
const { $supabase } = useNuxtApp()

const marcas = ref([])

const { data, error } = await $supabase
  .from('marcas')
  .select('*')

if (error) {
  console.error(error)
} else {
  marcas.value = data
}
</script>
