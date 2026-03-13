<template>
    <section id="contacto" class="py-28 bg-stone-900">
        <UContainer>
            <!-- Header -->
            <div class="mb-16">
                <p class="text-red-500 uppercase tracking-[0.35em] text-xs font-semibold mb-4">
                    Estamos para servirte
                </p>
                <h2 class="text-4xl md:text-5xl font-black text-white uppercase leading-tight">
                    Solicita tu <span class="text-red-600">Cotización</span>
                </h2>
            </div>

            <div class="grid grid-cols-1 lg:grid-cols-2 gap-16">

                <!-- Info columna izquierda -->
                <div class="space-y-10">
                    <!-- Dirección -->
                    <div>
                        <p class="text-red-500 text-xs uppercase tracking-widest font-semibold mb-3">
                            Centro de distribución
                        </p>
                        <p class="text-white text-lg font-semibold">Av. La Paz 1181</p>
                        <p class="text-stone-400">Col. Centro CP: 44100, Guadalajara, Jalisco.</p>
                    </div>

                    <!-- Teléfonos -->
                    <div>
                        <p class="text-red-500 text-xs uppercase tracking-widest font-semibold mb-3">
                            Teléfonos
                        </p>
                        <div class="space-y-2">
                            <a href="tel:3336672206" class="block text-stone-300 hover:text-red-500 transition-colors font-mono">
                                (33) 3667 2206
                            </a>
                            <a href="tel:3316691475" class="block text-stone-300 hover:text-red-500 transition-colors font-mono">
                                (33) 1699 1475
                            </a>
                            <a href="tel:3324860054" class="block text-stone-300 hover:text-red-500 transition-colors font-mono">
                                (33) 2486 0054
                            </a>
                        </div>
                    </div>

                    <!-- Email -->
                    <div>
                        <p class="text-red-500 text-xs uppercase tracking-widest font-semibold mb-3">
                            Correo electrónico
                        </p>
                        <a
                            href="mailto:HerramientasAltaCalidad@hotmail.com"
                            class="text-stone-300 hover:text-red-500 transition-colors break-all"
                        >
                            HerramientasAltaCalidad@hotmail.com
                        </a>
                    </div>

                    <!-- Redes sociales -->
                    <div>
                        <p class="text-red-500 text-xs uppercase tracking-widest font-semibold mb-4">
                            Contáctanos directo
                        </p>
                        <div class="flex flex-col gap-3">
                            <a
                                href="tel:3324860054"
                                class="flex items-center gap-3 group"
                            >
                                <img src="/img/whatsapp.webp" class="w-10 h-10 object-contain" alt="WhatsApp" />
                                <span class="text-stone-300 group-hover:text-red-500 transition-colors">
                                    33 2486 0054 — WhatsApp
                                </span>
                            </a>
                            <a
                            
                                href="https://www.facebook.com/profile.php?id=100082649351265"
                                target="_blank"
                                class="flex items-center gap-3 group"
                            >
                                <img src="/img/facebook.webp" class="w-10 h-10 object-contain" alt="Facebook" />
                                <span class="text-stone-300 group-hover:text-red-500 transition-colors">
                                    Herramientas y Suministros SA de CV
                                </span>
                            </a>
                        </div>
                    </div>
                </div>

                <!-- Formulario columna derecha -->
                <div class="bg-stone-800 p-8 md:p-10">
                    <h3 class="text-white font-black uppercase text-xl mb-8 tracking-wider">
                        Envíanos un mensaje
                    </h3>

                    <form class="space-y-4" @submit.prevent>
                        <UInput
                            placeholder="Nombre *"
                            size="lg"
                            :ui="{
                                base: 'rounded-none bg-white text-stone-900',
                            }"
                        />
                        <UInput
                            type="email"
                            placeholder="Correo electrónico *"
                            size="lg"
                            :ui="{
                                base: 'rounded-none bg-white text-stone-900',
                            }"
                        />
                        <UInput
                            placeholder="Asunto"
                            size="lg"
                            :ui="{
                                base: 'rounded-none bg-white text-stone-900',
                            }"
                        />
                        <UTextarea
                            placeholder="Mensaje"
                            :rows="5"
                            :ui="{
                                base: 'rounded-none resize-none bg-white text-stone-900',
                            }"
                        />
                        <UButton
                            type="submit"
                            block
                            size="lg"
                            :ui="{
                                base: 'rounded-none uppercase tracking-widest font-black',
                                color: { primary: { solid: 'bg-red-600 hover:bg-red-700 text-white' } }
                            }"
                        >
                            Enviar Mensaje
                        </UButton>
                    </form>
                </div>
            </div>

            <!-- Mapa -->
            <div class="mt-16">
                <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d59728.60097493905!2d-103.4052327335102!3d20.668050822884773!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8428b1fec95e9895%3A0x13fa8638a907d2de!2sRIDGID%20Guadalajara%20APCO!5e0!3m2!1ses-419!2smx!4v1681814134913!5m2!1ses-419!2smx"
                    width="100%"
                    height="300"
                    style="border:0; filter: grayscale(80%) contrast(1.1);"
                    allowfullscreen
                    loading="lazy"
                    referrerpolicy="no-referrer-when-downgrade"
                />
            </div>
        </UContainer>
    </section>
</template>