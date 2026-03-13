<template>
    <div>
        <h1 class="text-4xl">Marcas</h1>
        <ul v-if="marcas && marcas.length">
            <li v-for="marca in marcas" :key="marca.id">
                {{ marca.nombre }}
            </li>
        </ul>
        <p v-else>Cargando marcas...</p>
    </div>
</template>

<script setup>
const { $supabase } = useNuxtApp()

const { data: marcas, error } = await useAsyncData('marcas', async () => {
    const { data, error } = await $supabase.from('marcas').select('*')
    if (error) throw error
    return data
})

if (error.value) {
    console.error(error.value)
}
</script>