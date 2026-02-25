<template>
	<h1>Admin Index</h1>

	<button @click="logout" class="cursor-pointer">Cerrar sesión</button>
</template>

<script setup>
	const { $supabase } = useNuxtApp()

	const logout = async () => {
	  await $supabase.auth.signOut()
	  await navigateTo('/login')
	}
</script>