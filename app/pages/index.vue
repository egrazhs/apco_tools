<template>
	<main id="inicio">
		<LandingHeader />
		<LandingProductos />
		<LandingNosotros />
		<LandingDistribuidores />
		<LandingMarcas />
		<LandingContacto />
	</main>

	<MainFooter></MainFooter>
</template>

<script setup>
	definePageMeta({
		layout: 'landing'
	})
</script>