<template>
	<header class="sticky top-0 bg-white z-10">
		<div class="container mx-auto flex justify-between items-center content-center py-4">
			<article>
				<img src="/img/APCO_PNG.webp" draggable="false" />
			</article>

			<article id="iconos_nav" class="lg:hidden">
				<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6 mt-4 mr-4 cursor-pointer">
					<path id="path_hamburger" class="bg-red-600" stroke-linecap="round" stroke-linejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
					<path id="path_x" class="hidden" stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
	  			</svg>
			</article>

			<nav class="sticky top-0 bg-white uppercase hidden lg:block xl:w-[60%]">
				<div class="flex items-center">
					<p class="w-1/6 p-2 mx-2 text-center bg-red-600 text-white cursor-pointer hover:bg-slate-800 duration-100"><a href="#inicio">Inicio</a></p>
					<p class="w-1/6 p-2 mx-2 text-center bg-red-600 text-white cursor-pointer hover:bg-slate-800 duration-100"><a href="#productos">Productos</a></p>
					<p class="w-1/6 p-2 mx-2 text-center bg-red-600 text-white cursor-pointer hover:bg-slate-800 duration-100"><a href="#nosotros">Nosotros</a></p>
					<p class="w-1/6 p-2 mx-2 text-center bg-red-600 text-white cursor-pointer hover:bg-slate-800 duration-100"><a href="#distribuidores">Marcas</a></p>
					<p class="w-1/6 p-2 mx-2 text-center bg-red-600 text-white cursor-pointer hover:bg-slate-800 duration-100"><a href="#marcas">Precios</a></p>
					<p class="w-1/6 p-2 mx-2 text-center bg-red-600 text-white cursor-pointer hover:bg-slate-800 duration-100"><a href="#contacto">Contacto</a></p>

					<article class="relative">
						<CartMiniSlide />
					</article>
				</div>
			</nav>
		</div>


		<nav id="nav_moviles" class="hidden lg:hidden">
			<div class="flex flex-wrap items-center">
				<article class="relative w-12 h-10">
					<CartMiniSlide />
				</article>
			</div>

			<p class="elemento_nav_moviles w-full p-2 text-center bg-red-600 text-white cursor-pointer hover:bg-slate-800 duration-100"><a class="w-full block" href="#inicio">Inicio</a></p>
			<p class="elemento_nav_moviles w-full p-2 text-center bg-red-600 text-white cursor-pointer hover:bg-slate-800 duration-100"><a class="w-full block" href="#productos">Productos</a></p>
			<p class="elemento_nav_moviles w-full p-2 text-center bg-red-600 text-white cursor-pointer hover:bg-slate-800 duration-100"><a class="w-full block" href="#nosotros">Nosotros</a></p>
			<p class="elemento_nav_moviles w-full p-2 text-center bg-red-600 text-white cursor-pointer hover:bg-slate-800 duration-100"><a class="w-full block" href="#distribuidores">Marcas</a></p>
			<p class="elemento_nav_moviles w-full p-2 text-center bg-red-600 text-white cursor-pointer hover:bg-slate-800 duration-100"><a class="w-full block" href="#marcas">Precios</a></p>
			<p class="elemento_nav_moviles w-full p-2 text-center bg-red-600 text-white cursor-pointer hover:bg-slate-800 duration-100"><a class="w-full block" href="#contacto">Contacto</a></p>
		</nav>
	</header>
</template>

<script setup>
	
</script>