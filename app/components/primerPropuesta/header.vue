<template>
    <section id="inicio" class="relative min-h-screen flex items-center justify-center overflow-hidden">
        <!-- Fondo -->
        <div class="absolute inset-0">
            <img
                src="/img/fondo_header.webp"
                alt="APCO Tools"
                class="w-full h-full object-cover"
            />
            <div class="absolute inset-0 bg-stone-950/75" />
        </div>

        <!-- Línea decorativa izquierda -->
        <div class="absolute left-8 top-1/2 -translate-y-1/2 hidden lg:flex flex-col items-center gap-3">
            <div class="w-px h-24 bg-red-600" />
            <p class="text-stone-400 text-xs uppercase tracking-[0.3em] rotate-90 whitespace-nowrap my-6">
                Guadalajara · Jalisco
            </p>
            <div class="w-px h-24 bg-red-600" />
        </div>

        <!-- Contenido -->
        <div class="relative z-10 text-center px-6 max-w-5xl mx-auto">
            <p class="text-red-500 uppercase tracking-[0.35em] text-xs font-semibold mb-8">
                Distribuidor autorizado · 25 años de experiencia
            </p>

            <h1 class="text-6xl md:text-8xl lg:text-9xl font-black text-white uppercase leading-none tracking-tighter mb-8">
                Herramientas<br />
                <span class="text-red-600">de Alto</span><br />
                Rendimiento
            </h1>

            <p class="text-stone-300 text-lg md:text-xl max-w-2xl mx-auto mb-12 leading-relaxed">
                Equipamos a los profesionales de México con las marcas líderes del mercado industrial.
            </p>

            <div class="flex flex-wrap gap-4 justify-center">
                <UButton
                    to="#productos"
                    size="xl"
                    :ui="{
                        base: 'rounded-none uppercase tracking-widest font-black px-10',
                        color: { primary: { solid: 'bg-red-600 hover:bg-red-700 text-white' } }
                    }"
                >
                    Ver Productos
                </UButton>
                <UButton
                    to="#contacto"
                    size="xl"
                    variant="outline"
                    :ui="{
                        base: 'rounded-none uppercase tracking-widest font-black px-10 border-2',
                        color: { white: { outline: 'border-white text-white hover:bg-white hover:text-stone-900' } }
                    }"
                    color="white"
                >
                    Solicitar Cotización
                </UButton>
            </div>
        </div>

        <!-- Indicador scroll -->
        <div class="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-stone-500">
            <span class="text-xs uppercase tracking-[0.3em]">Explorar</span>
            <div class="w-px h-10 bg-stone-500 animate-pulse" />
        </div>
    </section>
</template>