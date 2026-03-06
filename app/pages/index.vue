<template>
	<div>
		<main id="inicio">
			<LandingHeader />
			<LandingProductos />
			<LandingNosotros />
			<LandingDistribuidores />
			<LandingMarcas />
			<LandingContacto />
		</main>

		<MainFooter></MainFooter>
	</div>
</template>

<script setup>
	definePageMeta({
		layout: 'landing'
	})
</script>