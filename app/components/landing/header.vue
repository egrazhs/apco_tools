<template>
	<header class="relative w-full h-[85vh] min-h-[500px] overflow-hidden bg-stone-900">

		<!-- Imagen de fondo -->
		<img src="/img/fondo_header.webp" alt="APCO Tools" class="absolute inset-0 w-full h-full object-cover object-center" draggable="false"/>

		<!-- Overlay oscuro -->
		<div class="absolute inset-0 bg-stone-950/65" />

		<!-- Contenido centrado -->
		<div class="relative z-10 h-full flex flex-col items-center justify-center text-center px-6">

			<!-- Eyebrow -->
			<p class="text-red-400 uppercase tracking-[0.35em] text-xs font-semibold mb-6">Distribuidor autorizado · Guadalajara, Jalisco</p>

			<!-- Título principal -->
			<h1 class="text-white text-4xl md:text-6xl lg:text-7xl font-black uppercase leading-tight tracking-tight mb-4">
				Cada herramienta<br />
				<span class="text-red-600">tiene su historia.</span>
			</h1>

			<!-- Subtítulo -->
			<p class="text-stone-300 text-base md:text-lg max-w-xl mx-auto mb-10 leading-relaxed">
				25 años equipando a profesionales con las marcas líderes del mercado industrial.
			</p>

			<!-- CTAs -->
			<div class="flex flex-wrap gap-4 justify-center">
				<UButton to="#productos" size="lg" :ui="{ base: 'rounded-none uppercase tracking-widest font-bold px-8 bg-red-600 hover:bg-red-700 text-white' }" >Ver Productos</UButton>
				<UButton to="#contacto" size="lg" variant="outline" color="white" :ui="{ base: 'rounded-none uppercase tracking-widest font-bold px-8 border-2 border-white text-white hover:bg-white hover:text-stone-900' }" >Cotizar Ahora</UButton>
			</div>
		</div>

		<!-- Indicador de scroll -->
		<div class="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-stone-400">
			<span class="text-xs uppercase tracking-[0.25em]">Explorar</span>
			<div class="w-px h-8 bg-stone-400 animate-pulse" />
		</div>
	</header>
</template>