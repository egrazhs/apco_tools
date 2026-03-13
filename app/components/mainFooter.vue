<template>
    <footer class="bg-stone-900 text-stone-400 py-12">
        <UContainer>

            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-10">

                <!-- Marca y descripción -->
				<article class="lg:col-span-2">
				    <h6 class="text-white font-bold uppercase tracking-widest text-xs mb-5">APCO Tools</h6>
				    <p class="text-sm leading-relaxed text-stone-500">
				        25 años equipando a los profesionales de México con herramientas y equipos de la más alta calidad,
				        a través de la innovación, servicio y calidad.
				    </p>
				    <!-- Redes sociales -->
				    <div class="flex items-center gap-4 mt-6">
				        <a href="tel:3324860054" class="opacity-60 hover:opacity-100 transition-opacity">
				            <img src="/img/whatsapp.webp" alt="WhatsApp" class="w-8 h-8 object-contain" />
				        </a>
				        <a href="https://www.facebook.com/profile.php?id=100082649351265" target="_blank" class="opacity-60 hover:opacity-100 transition-opacity">
				            <img src="/img/facebook.webp" alt="Facebook" class="w-8 h-8 object-contain" />
				        </a>
				    </div>
				</article>

                <!-- Contacto -->
                <article>
                    <h5 class="text-white font-bold uppercase tracking-widest text-xs mb-5">Contáctanos</h5>
                    <div class="flex flex-col gap-2 text-sm">
                        <a href="tel:3336672206" class="hover:text-red-500 transition-colors">(33) 3667 2206</a>
                        <a href="tel:3316691475" class="hover:text-red-500 transition-colors">(33) 1699 1475</a>
                        <a href="tel:3324860054" class="hover:text-red-500 transition-colors">(33) 2486 0054</a>
                        <a href="mailto:HerramientasAltaCalidad@hotmail.com" class="hover:text-red-500 transition-colors italic break-all mt-2 text-xs">
                            HerramientasAltaCalidad@hotmail.com
                        </a>
                        <p class="text-xs text-stone-600 mt-2 not-italic">
                            Av. La Paz 1181, Col. Centro<br/>CP: 44100, Guadalajara, Jal.
                        </p>
                    </div>
                </article>

                <!-- Navegación -->
                <article>
                    <h5 class="text-white font-bold uppercase tracking-widest text-xs mb-5">Navegación</h5>
                    <ul class="flex flex-col gap-2 text-sm">
                        <li><a href="#inicio" class="hover:text-red-500 transition-colors">Inicio</a></li>
                        <li><a href="#nosotros" class="hover:text-red-500 transition-colors">Nosotros</a></li>
                        <li><a href="#productos" class="hover:text-red-500 transition-colors">Productos</a></li>
                        <li><a href="/productos" class="hover:text-red-500 transition-colors">Catálogo</a></li>
                        <li><a href="#contacto" class="hover:text-red-500 transition-colors">Contacto</a></li>
                        <li><a href="/cart" class="hover:text-red-500 transition-colors">Carro de compra</a></li>
                    </ul>
                </article>

            </div>

            <hr class="border-stone-700 mb-8" />

            <!-- Copyright -->
            <div class="flex flex-col sm:flex-row justify-between items-center gap-3 text-xs text-stone-600">
                <p>© {{ currentYear }} APCO Tools — Herramientas y Suministros SA de CV</p>
                <p>Hecho en Guadalajara, Jalisco 🇲🇽</p>
            </div>

        </UContainer>
    </footer>
</template>

<script setup>
    const currentYear = new Date().getFullYear();
</script>