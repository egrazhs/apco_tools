<template>
	<h1>Admin Index</h1>

	<div>
		<NuxtLink to="/admin/categorias" >ver categorias</NuxtLink>
	</div>

	<button @click="handleLogout" class="cursor-pointer">Cerrar sesión</button>
</template>

<script setup lang="ts">
	const { logout } = useAuth()
	const user = useSupabaseUser()

	const handleLogout = async () => {
		await logout()
		await navigateTo('/login')
	}
</script>