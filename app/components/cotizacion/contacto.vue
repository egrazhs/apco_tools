<template>
    <section id="contacto" class="container mx-auto pt-28">
        <div class="mb-8">
            <h3 class="uppercase text-5xl md:text-6xl text-[#9a9a9a]">Contacto</h3>
            <hr class="border-red-600 border-y-4 w-full px-0 md:w-[350px]" />
        </div>

        <article id="mapa" class="flex justify-center mb-16">
            <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d59728.60097493905!2d-103.4052327335102!3d20.668050822884773!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8428b1fec95e9895%3A0x13fa8638a907d2de!2sRIDGID%20Guadalajara%20APCO!5e0!3m2!1ses-419!2smx!4v1681814134913!5m2!1ses-419!2smx" 
                width="70%" 
                height="350" 
                style="border:0;" 
                allowfullscreen="" 
                loading="lazy" 
                referrerpolicy="no-referrer-when-downgrade"
            ></iframe>
        </article>

        <article class="flex flex-wrap justify-center mb-16">
            <div class="w-full md:w-1/3 m-4">
                <h5 class="text-3xl my-4">Cotizaciones</h5>
                <p>Para todo tipo de preguntas, comentarios e inquietudes; por favor llámanos: <span><em><a href="tel:3324860054">33 2486 0054</a></em></span></p>
                <p class="my-2">O envía un correo a <span><i>HerramientasAltaCalidad@hotmail.com</i></span></p> 
                <p>Por favor completa el formulario a continuación:</p>

                <!-- Formulario de contacto -->
                <form @submit.prevent="handleSubmitContacto" class="mt-4 space-y-4">
                    <UInput
                        v-model="formContacto.nombre"
                        type="text"
                        placeholder="Nombre *"
                        :ui="{ base: 'bg-white text-stone-900' }"
                        required
                    />
                    
                    <UInput
                        v-model="formContacto.email"
                        type="email"
                        placeholder="Email *"
                        :ui="{ base: 'bg-white text-stone-900' }"
                        required
                    />
                    
                    <UInput
                        v-model="formContacto.asunto"
                        type="text"
                        placeholder="Asunto"
                        :ui="{ base: 'bg-white text-stone-900' }"
                    />
                    
                    <UTextarea
                        v-model="formContacto.mensaje"
                        placeholder="Mensaje *"
                        :rows="4"
                        :ui="{ base: 'bg-white text-stone-900' }"
                        required
                    />

                    <!-- Error alert -->
                    <UAlert
                        v-if="errorContacto"
                        icon="i-heroicons-exclamation-triangle"
                        color="red"
                        variant="soft"
                        description="No pudimos enviar tu mensaje. Intenta de nuevo o contacta directamente."
                    />

                    <!-- Submit button -->
                    <UButton
                        type="submit"
                        class="bg-red-600 hover:bg-red-700 text-white px-6 py-2"
                        :loading="loadingContacto"
                        :disabled="loadingContacto"
                    >
                        {{ loadingContacto ? 'Enviando...' : 'Enviar' }}
                    </UButton>
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
                <div>
                    <h6 class="text-2xl my-4">Solicita Cotización</h6>
                    <h6 class="text-2xl my-4">
                        <a href="tel:3324860054">
                            <img src="/img/whatsapp.webp" class="inline w-14 mr-2" />
                            33 2486 0054
                        </a>
                    </h6>
                    <h6 class="text-lg my-4">
                        <a href="https://www.facebook.com/profile.php?id=100082649351265" target="_blank">
                            <img src="/img/facebook.webp" class="inline w-12 mr-2" />
                            <i>Herramientas y Suministros SA de CV</i>
                        </a>
                    </h6>
                </div>			
            </div>
        </article>
    </section>
</template>

<script setup lang="ts">
    const toast = useToast()
    const { sendEmail, loading: loadingContacto, error: errorContacto } = useEmailService()

    const formContacto = reactive({
        nombre: '',
        email: '',
        asunto: '',
        mensaje: '',
    })

    async function handleSubmitContacto() {
        if (!formContacto.nombre.trim() || !formContacto.email.trim() || !formContacto.mensaje.trim()) {
            toast.add({
                title: 'Campos incompletos',
                description: 'Por favor completa los campos requeridos.',
                color: 'red',
                icon: 'i-heroicons-exclamation-triangle',
            })
            return
        }

        try {
            await sendEmail('/api/contacto', {
                nombre: formContacto.nombre.trim(),
                email: formContacto.email.trim(),
                asunto: formContacto.asunto.trim() || 'Sin asunto',
                mensaje: formContacto.mensaje.trim(),
            })

            toast.add({
                title: '¡Mensaje enviado!',
                description: 'Gracias por contactarnos. Te responderemos pronto.',
                color: 'green',
                icon: 'i-heroicons-check-circle',
            })

            // Limpiar formulario
            formContacto.nombre = ''
            formContacto.email = ''
            formContacto.asunto = ''
            formContacto.mensaje = ''
        } catch (err) {
            toast.add({
                title: 'Error',
                description: 'No pudimos enviar tu mensaje. Intenta de nuevo.',
                color: 'red',
                icon: 'i-heroicons-x-circle',
            })
        }
    }
</script>
