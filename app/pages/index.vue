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

	<main id="inicio">
		<header class="relative z-10 container mx-auto h-[300px] md:h-[360px] lg:h[450px] xl:h-[550px]">
			<img src="/img/fondo_header.webp" class="w-full h-full cover" draggable="false" />
			<div class="w-full h-full absolute top-0 bg-slate-800/50">
				<p class="absolute top-[50%] -translate-y-1/2 text-white text-center text-xl md:text-4xl w-full">Cada herramienta tiene su historia.</p>
			</div>
		</header>





		<section id="productos" class="container mx-auto">
			<div class="pt-28 mb-8">
				<h3 class="uppercase text-5xl md:text-6xl text-[#9a9a9a]">Productos</h3>
				<hr class="border-red-600  border-y-4 w-full px-0 md:w-[350px]" />
			</div>

			<div class="flex flex-wrap mx-auto justify-center">
				<article class="w-full md:w-1/4 mx-4 bg-gray-200 pb-5 mb-4">
					<img src="/img/productos_1.webp" class="w-full" />
					
					<h4 class="text-4xl md:text-2xl lg:text-4xl p-5">Equipo de limpieza de drenaje</h4>

					<p class="px-5">Arrástrelos de un camión, bájelos o súbalos por una escalera: nuestros limpiadores pueden soportarlo. 
					Hemos apoyado a profesionales (y nuestros productos) durante décadas, acompañando a más plomeros desde aprendices hasta su jubilación que ninguna otra marca.</p>
				</article>

				<article class="w-full md:w-1/4 mx-4 bg-gray-200 pb-5 mb-4">
					<img src="/img/productos_2.webp" class="w-full" />
					<h4 class="text-4xl md:text-2xl lg:text-4xl p-5">Tarrajas para roscado</h4>

					<p class="px-5">Si su trabajo depende de la unión, conformación o conexión de tuberías, el equipo de fabricación de tuberías y roscado RIDGID le ofrece seguridad para todas las conexiones.</p>

					<p class="p-5">Con una construcción que tiene una durabilidad sin comparación y componentes diseñados para funcionar en los entornos más extremos, existe un motivo por el cual más profesionales experimentados confían más en RIDGID que en cualquier otra marca de fabricación de tuberías. Desde nuestros completos montajes o portátiles, con diseños duraderos, RIDGID ofrece un rendimiento que le ayuda a terminar el trabajo con precisión, seguridad y eficiencia.</p>
				</article>
				
				<article class="w-full md:w-1/4 mx-4 bg-gray-200 pb-5  mb-4">
					<img src="/img/productos_3.webp" class="w-full" />
					<h4 class="text-4xl md:text-2xl lg:text-4xl p-5">Herramienta eléctrica y de batería</h4>

					<p class="px-5">Las herramientas eléctricas RIDGID® fueron diseñadas y creadas para ser las “Mejores en su clase” con los estándares de calidad más altos. Además, las herramientas eléctricas RIDGID están respaldadas por la mejor garantía de la industria, lo que las convierte en la opción preferida por los profesionales, que confían en ellas para ganarse la vida. Potentes. Duraderas. Profesionales.</p>
				</article>
			</div>
		</section>


		<section id="nosotros" class="container mx-auto" >
			<div class="pt-28 mb-8">
				<h3 class="uppercase text-5xl md:text-6xl text-[#9a9a9a]">Nosotros</h3>
				<hr class="border-red-600  border-y-4 w-full px-0 md:w-[350px]" />
			</div>

			<div class="flex flex-wrap justify-center items-center">
				<div class="w-full p-4 lg:w-1/3">
					<p class="text-justify">Somos una empresa que nace con la inquietud de ofrecer soluciones y servicios a nuestros clientes, durante este tiempo, hemos concretado 25  años de experiencia en el mercado, ofreciendo herramientas y  productos de la más alta calidad, y las mejores marcas, cubriendo las necesidades y normas de de herramientas y equipos industriales, en cuanto a soluciones  y procesos herramentales , protección personal, con equipos de seguridad industrial e insumos en general, todo esto con el objetivo de dar soluciones rápidas y adecuadas para cada uno de nuestros socios comerciales.</p>

					<p class="text-justify my-4">Nuestro objetivo es generar clientes satisfechos y con la seguridad de saber que lo mas importante son las personas que laboran en sus empresas, mediante la comercialización de equipo herramientas y de protección personal, a través de la innovación, servicio y calidad.</p>
				</div>

				<div class="w-full lg:w-1/3">
					<img src="/img/logo_grande.webp" class="w-full mx-auto m-6">
				</div>
			</div>
		</section>


		<section id="distribuidores" class="container mx-auto pt-28">
			<h4 class="text-4xl text-[#9a9a9a] text-center">Distribuidores Autorizados</h4>

			<article class="flex flex-wrap justify-center items-center">
				<img src="/img/ridgid.webp" class="w-[147px] h-[47px] m-4" draggable="false" />
				<img src="/img/knipex.webp" class="m-4" draggable="false" />
				<img src="/img/dewalt.webp" class="m-4" draggable="false"/>
				<img src="/img/milwaukee.webp" class="m-4" draggable="false"/>
				<img src="/img/stanley.webp" class="m-4" draggable="false" />
			</article>
		</section>

		<section id="marcas" class="container mx-auto pt-28 px-2">
			<h4 class="text-center text-3xl m-4">Puedes consultar todos nuestros productos y precios en nuestro catálogo:</h4>
			
			<a href="catalogo.html" class="block mx-auto my-4 w-[240px] bg-red-600 text-white p-4 text-center text-xl rounded-full hover:bg-slate-800 duration-100">Ver Catálogo</a>

			<p class="text-sm font-bold"><i>*Para mayor información ó promociones, contacte a nuestros asesores.</i></p>
			<p class="text-sm font-bold"><i>*Precio sujeto a cambio sin previo aviso.</i></p>
		</section>

		<section id="contacto" class="container mx-auto pt-28">

			<div class=" mb-8">
				<h3 class="uppercase text-5xl md:text-6xl text-[#9a9a9a]">Contacto</h3>
				<hr class="border-red-600  border-y-4 w-full px-0 md:w-[350px]" />
			</div>


			<article id="mapa" class="flex justify-center">
				<iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d59728.60097493905!2d-103.4052327335102!3d20.668050822884773!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8428b1fec95e9895%3A0x13fa8638a907d2de!2sRIDGID%20Guadalajara%20APCO!5e0!3m2!1ses-419!2smx!4v1681814134913!5m2!1ses-419!2smx" width="70%" height="350" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>
			</article>

			<article class="flex flex-wrap justify-center mb-16">
				<div class="w-full md:w-1/3 m-4">
					<h5 class="text-3xl my-4">Cotizaciones</h5>

					<p>Para todo tipo de preguntas, comentarios e inquietudes; por favor llámanos: <span><em><a href="tel:3324860054">33 2486 0054</a></em></span></p>

					<p class="my-2">O envía un correo a <span><i>HerramientasAltaCalidad@hotmail.com</i></span></p> 

					<p>Por favor completa el formulario a continuación:</p>

					<form class="mt-4">
						<input type="text" name="nombre" placeholder="Nombre*" class="border-8 border-gray-200 w-full">
						<input type="email" name="email" placeholder="Email*" class="border-8 border-gray-200 w-full">
						<input type="text" name="asunto" placeholder="Asunto" class="border-8 border-gray-200 w-full">
						<textarea placeholder="Mensaje" class="border-8 border-gray-200 w-full h-36"></textarea>
						<button type="submit" class="bg-red-600 text-white px-6 py-2 rounded-xl">Enviar</button>
					</form>
				</div>
				
				<div class="w-full md:w-1/3 m-4">
					<h5 class="text-3xl my-4">Centro de distribución</h5>
					<address>Av. La Paz 1181 Col. Centro CP: 44100, Guadalajara, Jalisco.</address>
					<p class="mt-2"><i>HerramientasAltaCalidad@hotmail.com</i></p>

					<h5 class="text-3xl my-4">Contáctanos</h5>
					<p><a href="tel:3336672206">Tel: (33) 3667 2206</a></p>
					<p><a href="tel:3316691475">Tel: (33) 1699 1475</a></p>
					<p><a href="tel:3324860054">Tel: (33) 2486 0054</a></p>

					<hr class="border-red-600 border-4 w-[150px] mt-4">
					<div class="">
						<div>
							<h6 class="text-2xl my-4">Solicita Cotización</h6>
							<h6 class="text-2xl my-4"><a href="tel:3324860054"><img src="/img/whatsapp.webp" class="inline w-14 mr-2" />33 2486 0054</a></h6>
							<h6 class="text-lg my-4"><a href="https://www.facebook.com/profile.php?id=100082649351265" target="_blank"><img src="/img/facebook.webp" class="inline w-12 mr-2" /><i>Herramientas y Suministros SA de CV</i></a></h6>
						</div>
						
					</div>			
				</div>
			</article>
		</section>
	</main>

	<MainFooter></MainFooter>
</template>