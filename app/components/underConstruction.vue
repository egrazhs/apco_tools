<template>
    <div class="min-h-screen w-full bg-white flex items-center justify-center px-4">
        <div class="max-w-2xl w-full text-center">
            <!-- Icono de construcción -->
            <div class="mb-8">
                <div class="inline-flex items-center justify-center w-24 h-24 bg-red-50 rounded-none">
                    <svg class="w-12 h-12 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                    </svg>
                </div>
            </div>

            <!-- Encabezado -->
            <h1 class="text-5xl md:text-6xl font-serif font-bold text-gray-900 mb-4">
                Página en Construcción
            </h1>

            <!-- Línea decorativa roja -->
            <div class="w-24 h-1 bg-red-600 mx-auto mb-6"></div>

            <!-- Descripción -->
            <p class="text-xl text-gray-600 mb-8">
                Estamos trabajando en esta página para ofrecerte la mejor experiencia. 
                Vuelve pronto para ver nuestras novedades.
            </p>

            <!-- Información adicional -->
            <div class="bg-stone-50 border border-stone-200 rounded-none p-6 mb-8">
                <p class="text-gray-700 mb-2">
                    <span class="font-semibold text-gray-900">¿Necesitas ayuda?</span>
                </p>
                <p class="text-gray-600 text-sm">
                    Contáctanos por teléfono o completa el formulario de cotización en la sección de contacto.
                </p>
            </div>

            <!-- Botones de acción -->
            <div class="flex flex-col sm:flex-row gap-4 justify-center">
                <UButton
                    to="/"
                    variant="outline"
                    size="lg"
                    class="px-8"
                >
                    Volver al Inicio
                </UButton>

                <UButton
                    to="#contacto"
                    variant="solid"
                    color="red"
                    size="lg"
                    class="px-8 bg-red-600 hover:bg-red-700"
                >
                    Contactanos
                </UButton>
            </div>

            <!-- Footer informativo -->
            <div class="mt-12 pt-8 border-t border-stone-200">
                <p class="text-sm text-gray-500">
                    APCO Tools - Herramientas y Suministros SA de CV
                </p>
                <p class="text-sm text-gray-500 mt-2">
                    <span class="inline-block mr-4">📞 (33) 2486 0054</span>
                    <span class="inline-block">✉️ HerramientasAltaCalidad@hotmail.com</span>
                </p>
            </div>
        </div>
    </div>
</template>

<script setup>
// No requiere lógica adicional, es un componente de presentación
</script>

<style scoped>
/* Animación sutil para el contenedor */
</style>