<template>
	<div>
		<main id="inicio">
			<LandingHeader />
			<PrimerPropuestaStats />
			<!--<PrimerPropuestaPlaceGallery />-->
			<PrimerPropuestaProductos />
			<PlaceGallery/>
			<LandingNosotros />
			<PrimerPropuestaRagsGallery />
			<PrimerPropuestaBrandsSection />
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