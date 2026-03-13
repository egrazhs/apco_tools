<template>
    <div>
        <main id="inicio">
            <PrimerPropuestaHeader />
            <PrimerPropuestaStats />
            <PrimerPropuestaNosotros />
            <PrimerPropuestaPlaceGallery />
            <PrimerPropuestaProductos />
            <PrimerPropuestaRagsGallery />
            <PrimerPropuestaBrandsSection />
            <PrimerPropuestaContacto />
        </main>
        <PrimerPropuestaMainFooter />
    </div>
</template>

<script setup>
    definePageMeta({
        layout: 'landing'
    })
</script>