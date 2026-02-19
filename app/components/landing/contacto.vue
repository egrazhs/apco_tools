<template>
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
</template>