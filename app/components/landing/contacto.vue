<template>
    <section id="contacto" class="bg-white pt-20 pb-16">
        <UContainer>

            <!-- Encabezado -->
            <div class="mb-8">
                <h3 class="uppercase text-5xl md:text-6xl text-stone-400">Contacto</h3>
                <hr class="border-red-600 border-y-4 w-full md:w-[350px]" />
            </div>

            <!-- Mapa -->
            <div class="flex justify-center mb-10">
                <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d59728.60097493905!2d-103.4052327335102!3d20.668050822884773!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8428b1fec95e9895%3A0x13fa8638a907d2de!2sRIDGID%20Guadalajara%20APCO!5e0!3m2!1ses-419!2smx!4v1681814134913!5m2!1ses-419!2smx"
                    width="100%"
                    height="350"
                    class="w-full md:w-[70%]"
                    style="border:0;"
                    allowfullscreen
                    loading="lazy"
                    referrerpolicy="no-referrer-when-downgrade"
                />
            </div>

            <!-- Columnas -->
            <div class="flex flex-wrap justify-center mb-16 gap-4">

                <!-- Formulario -->
                <div class="w-full md:w-1/3">
                    <h5 class="text-3xl my-4 text-stone-900">Cotizaciones</h5>
                    <p class="text-stone-600">
                        Para todo tipo de preguntas, comentarios e inquietudes; por favor llámanos:
                        <a href="tel:3324860054" class="font-semibold text-stone-900 hover:text-red-600 transition-colors">
                            <em>33 2486 0054</em>
                        </a>
                    </p>
                    <p class="my-2 text-stone-600">
                        O envía un correo a
                        <a href="mailto:HerramientasAltaCalidad@hotmail.com" class="italic hover:text-red-600 transition-colors">
                            HerramientasAltaCalidad@hotmail.com
                        </a>
                    </p>
                    <p class="text-stone-600">Por favor completa el formulario a continuación:</p>

                    <form class="mt-4 flex flex-col gap-3" @submit.prevent>
                        <UInput
                            type="text"
                            name="nombre"
                            placeholder="Nombre*"
                            size="lg"
                            :ui="{ base: 'bg-white text-stone-900' }"
                        />
                        <UInput
                            type="email"
                            name="email"
                            placeholder="Email*"
                            size="lg"
                            :ui="{ base: 'bg-white text-stone-900' }"
                        />
                        <UInput
                            type="text"
                            name="asunto"
                            placeholder="Asunto"
                            size="lg"
                            :ui="{ base: 'bg-white text-stone-900' }"
                        />
                        <UTextarea
                            name="mensaje"
                            placeholder="Mensaje"
                            :rows="5"
                            :ui="{ base: 'bg-white text-stone-900 resize-none' }"
                        />
                        <UButton
                            type="submit"
                            class="bg-red-600 hover:bg-stone-900 text-white px-6 py-2 rounded-xl transition-colors duration-200 w-fit"
                        >
                            Enviar
                        </UButton>
                    </form>
                </div>

                <!-- Info de contacto -->
                <div class="w-full md:w-1/3">
                    <h5 class="text-3xl my-4 text-stone-900">Centro de distribución</h5>
                    <address class="not-italic text-stone-600">
                        Av. La Paz 1181 Col. Centro CP: 44100, Guadalajara, Jalisco.
                    </address>
                    <p class="mt-2 text-stone-600">
                        <a href="mailto:HerramientasAltaCalidad@hotmail.com" class="italic hover:text-red-600 transition-colors">
                            HerramientasAltaCalidad@hotmail.com
                        </a>
                    </p>

                    <h5 class="text-3xl my-4 text-stone-900">Contáctanos</h5>
                    <p><a href="tel:3336672206" class="text-stone-600 hover:text-red-600 transition-colors">Tel: (33) 3667 2206</a></p>
                    <p><a href="tel:3316691475" class="text-stone-600 hover:text-red-600 transition-colors">Tel: (33) 1699 1475</a></p>
                    <p><a href="tel:3324860054" class="text-stone-600 hover:text-red-600 transition-colors">Tel: (33) 2486 0054</a></p>

                    <hr class="border-red-600 border-4 w-[150px] mt-4" />

                    <h6 class="text-2xl my-4 text-stone-900">Solicita Cotización</h6>
                    <h6 class="text-2xl my-3">
                        <a href="tel:3324860054" class="flex items-center gap-2 hover:text-red-600 transition-colors text-stone-700">
                            <img src="/img/whatsapp.webp" class="w-14" alt="WhatsApp" />
                            33 2486 0054
                        </a>
                    </h6>
                    <h6 class="text-lg my-3">
                        <a href="https://www.facebook.com/profile.php?id=100082649351265" target="_blank" class="flex items-center gap-2 hover:text-red-600 transition-colors text-stone-700">
                            <img src="/img/facebook.webp" class="w-12" alt="Facebook" />
                            <i>Herramientas y Suministros SA de CV</i>
                        </a>
                    </h6>
                </div>

            </div>
        </UContainer>
    </section>
</template>