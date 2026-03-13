<template>
    <section id="nosotros" class="bg-white py-16 md:py-24">
        <UContainer>
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

                <!-- Columna izquierda: texto -->
                <div>
                    <p class="text-red-600 uppercase tracking-[0.35em] text-xs font-semibold mb-4 text-center lg:text-left">
                        Quiénes somos
                    </p>
                    <h2 class="text-5xl md:text-6xl font-black uppercase text-stone-900 leading-tight mb-6 text-center lg:text-left">
                        Nosotros
                    </h2>
                    <div class="w-16 h-1 bg-red-600 mb-8 mx-auto lg:mx-0" />

                    <p class="text-stone-600 leading-relaxed mb-5 text-center lg:text-left">
                        Somos una empresa con <strong class="text-stone-900">25 años de experiencia</strong> en el mercado,
                        fundada con la misión de ofrecer soluciones herramentales a profesionales e industrias.
                        Trabajamos con las mejores marcas para cubrir necesidades de herramienta industrial,
                        protección personal y equipos de seguridad.
                    </p>
                    <p class="text-stone-500 leading-relaxed mb-10 text-center lg:text-left">
                        Nuestro objetivo es generar clientes satisfechos, con la certeza de que lo más importante
                        son las personas que laboran en sus empresas — por eso ofrecemos asesoría experta,
                        respaldo postventa y el mejor precio del mercado.
                    </p>

                    <!-- Tres pilares -->
                    <div class="grid grid-cols-3 gap-4 sm:gap-6">
                        <div
                            v-for="pilar in pilares"
                            :key="pilar.title"
                            class="flex flex-col items-center lg:items-start gap-2"
                        >
                            <UIcon :name="pilar.icon" class="text-red-600 text-2xl" />
                            <p class="font-black text-stone-900 uppercase text-xs sm:text-sm tracking-wide text-center lg:text-left">
                                {{ pilar.title }}
                            </p>
                            <p class="text-stone-500 text-xs leading-relaxed text-center lg:text-left hidden sm:block">
                                {{ pilar.desc }}
                            </p>
                        </div>
                    </div>
                </div>

                <!-- Columna derecha: logo -->
                <div class="relative flex items-center justify-center mt-8 lg:mt-0">
                    <div class="absolute -top-6 -right-6 w-40 h-40 bg-red-600 -z-10 hidden lg:block" />
                    <div class="absolute -bottom-6 -left-6 w-40 h-40 bg-stone-100 -z-10 hidden lg:block" />

                    <div class="bg-stone-50 p-8 sm:p-12 shadow-xl w-full">
                        <img
                            src="/img/logo_grande.webp"
                            alt="APCO Tools"
                            class="w-full object-contain"
                            draggable="false"
                        />
                    </div>

                    <div class="absolute -bottom-4 -left-4 bg-red-600 text-white p-5 shadow-xl hidden lg:block">
                        <p class="text-4xl font-black leading-none">25</p>
                        <p class="text-xs uppercase tracking-widest mt-1 text-red-100">Años</p>
                    </div>
                </div>

            </div>
        </UContainer>
    </section>
</template>

<script setup>
    const pilares = [
        {
            icon: 'i-heroicons-shield-check',
            title: 'Calidad',
            desc: 'Solo trabajamos con marcas líderes y productos certificados.',
        },
        {
            icon: 'i-heroicons-bolt',
            title: 'Rapidez',
            desc: 'Soluciones y cotizaciones ágiles para no frenar tu trabajo.',
        },
        {
            icon: 'i-heroicons-user-group',
            title: 'Servicio',
            desc: 'Asesoría personalizada antes y después de tu compra.',
        },
    ];
</script>