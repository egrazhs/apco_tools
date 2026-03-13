<template>
    <section id="nosotros" class="py-28 bg-white">
        <UContainer>
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">

                <!-- Imagen con decoración -->
                <div class="relative order-2 lg:order-1">
                    <div class="absolute -top-6 -left-6 w-32 h-32 bg-red-600 -z-10" />
                    <img
                        src="/img/logo_grande.webp"
                        alt="APCO Tools"
                        class="w-full object-contain bg-stone-50 shadow-2xl p-12"
                    />
                    <div class="absolute -bottom-6 -right-6 w-32 h-32 bg-stone-100 -z-10" />

                    <!-- Badge -->
                    <div class="absolute -bottom-4 -left-4 bg-red-600 text-white p-6 shadow-xl">
                        <p class="text-4xl font-black leading-none">25</p>
                        <p class="text-xs uppercase tracking-widest mt-1">Años</p>
                    </div>
                </div>

                <!-- Texto -->
                <div class="order-1 lg:order-2">
                    <p class="text-red-600 uppercase tracking-[0.35em] text-xs font-semibold mb-5">
                        Quiénes somos
                    </p>
                    <h2 class="text-4xl md:text-5xl font-black text-stone-900 uppercase leading-tight mb-8">
                        Más de dos décadas<br />
                        <span class="text-red-600">al servicio</span><br />
                        del profesional
                    </h2>

                    <USeparator class="border-red-600 border-2 w-16 mb-8" />

                    <p class="text-stone-600 text-lg leading-relaxed mb-5">
                        Somos una empresa fundada con la misión de ofrecer soluciones herramentales a profesionales
                        e industrias. Durante 25 años hemos consolidado relaciones con las marcas más reconocidas,
                        garantizando calidad, respaldo y el mejor precio.
                    </p>
                    <p class="text-stone-500 leading-relaxed mb-10">
                        Cubrimos necesidades de herramienta industrial, protección personal, equipos de seguridad
                        e insumos en general — todo en un solo lugar, con asesoría experta.
                    </p>

                    <UButton
                        to="#contacto"
                        size="lg"
                        :ui="{
                            base: 'rounded-none uppercase tracking-widest font-black px-8',
                            color: { primary: { solid: 'bg-stone-900 hover:bg-red-600 text-white transition-colors duration-300' } }
                        }"
                    >
                        Contáctanos
                    </UButton>
                </div>
            </div>
        </UContainer>
    </section>
</template>