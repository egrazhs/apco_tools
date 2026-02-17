<template>
	<section class="w-full">
		asdas

		<UCarousel
			:items="items"
			loop
			arrows
			indicators
			autoplay="true"
			dots
			:autoplay-delay="5000"
			class="h-[70vh] overflow-hidden rounded-none"
		>
			<template #default="{ item }">
				<div class="relative w-full h-[70vh]">
					<img
						:src="item"
						alt="Foto del local"
						class="w-full h-full object-cover"
					/>

					<!-- Overlay opcional -->
					<div class="absolute inset-0 bg-black/30 flex items-center justify-center">
						<h1 class="text-white text-4xl md:text-6xl font-bold drop-shadow-lg">Nuestro Local</h1>
					</div>
				</div>
			</template>
		</UCarousel>
	</section>
</template>

<script setup lang="ts">
	const items = [
		'./img/fotos_local/1.jpeg',
		'./img/fotos_local/2.jpeg',
		'./img/fotos_local/3.jpeg',
		'./img/fotos_local/4.jpeg',
		'./img/fotos_local/5.jpeg',
		'./img/fotos_local/6.jpeg'
	];
</script>