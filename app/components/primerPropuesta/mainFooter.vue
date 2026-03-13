<template>
    <footer class="bg-stone-950 text-stone-400 pt-16 pb-8">
        <UContainer>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-10 mb-12">
                <!-- Sobre nosotros -->
                <div>
                    <img src="/img/logo_grande.webp" alt="APCO" class="h-16 object-contain mb-6 opacity-80" />
                    <p class="text-sm leading-relaxed">
                        25 años equipando a los profesionales de México con herramientas y equipos de la más alta calidad.
                    </p>
                </div>

                <!-- Contacto -->
                <div>
                    <h5 class="text-white font-bold uppercase tracking-widest text-xs mb-5">
                        Contáctanos
                    </h5>
                    <div class="space-y-2 text-sm">
                        <a href="tel:3336672206" class="block hover:text-red-500 transition-colors">
                            (33) 3667 2206
                        </a>
                        <a href="tel:3316691475" class="block hover:text-red-500 transition-colors">
                            (33) 1699 1475
                        </a>
                        <a href="tel:3324860054" class="block hover:text-red-500 transition-colors">
                            (33) 2486 0054
                        </a>
                        <a href="mailto:HerramientasAltaCalidad@hotmail.com" class="block hover:text-red-500 transition-colors break-all mt-3">
                            HerramientasAltaCalidad@hotmail.com
                        </a>
                    </div>
                </div>

                <!-- Navegación -->
                <div>
                    <h5 class="text-white font-bold uppercase tracking-widest text-xs mb-5">
                        Navegación
                    </h5>
                    <ul class="space-y-2 text-sm">
                        <li><a href="#inicio" class="hover:text-red-500 transition-colors">Inicio</a></li>
                        <li><a href="#nosotros" class="hover:text-red-500 transition-colors">Nosotros</a></li>
                        <li><a href="#productos" class="hover:text-red-500 transition-colors">Productos</a></li>
                        <li><a href="/catalogo.html" class="hover:text-red-500 transition-colors">Catálogo</a></li>
                        <li><a href="#contacto" class="hover:text-red-500 transition-colors">Contacto</a></li>
                    </ul>
                </div>
            </div>

            <div class="border-t border-stone-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs">
                <p>© {{ currentYear }} APCO Tools — Herramientas y Suministros SA de CV</p>
                <p>Av. La Paz 1181, Col. Centro, Guadalajara, Jalisco.</p>
            </div>
        </UContainer>
    </footer>
</template>

<script setup>
    const currentYear = new Date().getFullYear();
</script>