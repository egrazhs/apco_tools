<template>
	<header class="sticky top-0 bg-white z-50">
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

					<article class="relative w-12 h-10">
						<a href="cart.html">
							<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1" stroke="currentColor" class="w-6 h-7 cursor-pointer absolute m-1">
								<path stroke-linecap="round" stroke-linejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
							</svg>
							<span id="cart_size" class="absolute bottom-0 right-1 border-rounded text-xl font-bold"></span>
						</a>
						
					</article>
				</div>
			</nav>
		</div>


		<nav id="nav_moviles" class="hidden lg:hidden">
			<div class="flex flex-wrap items-center">
				<article class="relative w-12 h-10">
					<a href="cart.html">
						<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1" stroke="currentColor" class="w-6 h-7 cursor-pointer absolute m-1"> 
							<path stroke-linecap="round" stroke-linejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
						</svg>
						<span id="cart_size_moviles" class="absolute bottom-0 right-1 border-rounded text-xl font-bold"></span>
					</a>
					
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