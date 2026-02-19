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
	onMounted(() => {
  const toast = useToast()
  toast.add({
    title: 'TEST'
  })
})
	definePageMeta({
		layout: 'landing'
	})
</script>