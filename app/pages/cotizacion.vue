<script setup lang="ts">
useSeoMeta({
    title: 'Pedir Cotización',
    description: 'Solicita una cotización personalizada para nuestros productos.',
})

const route = useRoute()

const productosDisponibles = [
    'Producto A',
    'Producto B',
    'Producto C',
    'Producto D',
    'Otro / No sé cuál necesito',
]

const form = reactive({
    nombre: '',
    empresa: '',
    email: '',
    telefono: '',
    producto: route.query.producto ? String(route.query.producto) : '',
    cantidad: '',
    mensaje: '',
})

const loading = ref(false)
const enviado = ref(false)
const errorEnvio = ref(false)

const toast = useToast()

async function handleSubmit() {
    loading.value = true
    errorEnvio.value = false

    try {
        // Aquí iría la llamada al endpoint real, ej: await $fetch('/api/cotizacion', { method: 'POST', body: form })
        await new Promise(resolve => setTimeout(resolve, 1500))
        enviado.value = true
        toast.add({
            title: '¡Solicitud enviada!',
            description: 'Nos pondremos en contacto contigo a la brevedad.',
            color: 'green',
            icon: 'i-heroicons-check-circle',
        })
    } catch (e) {
        errorEnvio.value = true
        toast.add({
            title: 'Ocurrió un error',
            description: 'No pudimos enviar tu solicitud. Intenta de nuevo.',
            color: 'red',
            icon: 'i-heroicons-x-circle',
        })
    } finally {
        loading.value = false
    }
}
</script>

<template>
    <div class="min-h-screen bg-gray-50 dark:bg-gray-950">

        <!-- Hero / Header -->
        <section class="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
            <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
                <div class="flex items-center gap-3 mb-4">
                    <UButton
                        to="/productos"
                        icon="i-heroicons-arrow-left"
                        variant="ghost"
                        color="gray"
                        size="sm"
                        label="Volver a productos"
                    />
                </div>
                <div class="flex items-start gap-4">
                    <div class="p-3 rounded-xl bg-primary-50 dark:bg-primary-950 flex-shrink-0">
                        <UIcon
                            name="i-heroicons-document-text"
                            class="w-7 h-7 text-primary-500"
                        />
                    </div>
                    <div>
                        <h1 class="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white tracking-tight">
                            Pedir Cotización
                        </h1>
                        <p class="mt-2 text-gray-500 dark:text-gray-400 text-lg max-w-xl">
                            Completa el formulario y te enviamos una propuesta personalizada en menos de 24 horas.
                        </p>
                    </div>
                </div>
            </div>
        </section>

        <!-- Contenido principal -->
        <section class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
            <div class="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">

                <!-- Formulario -->
                <div class="lg:col-span-2">
                    <!-- Estado: Enviado correctamente -->
                    <template v-if="enviado">
                        <UCard class="text-center py-12">
                            <div class="flex flex-col items-center gap-4">
                                <div class="p-4 rounded-full bg-green-50 dark:bg-green-950">
                                    <UIcon
                                        name="i-heroicons-check-circle"
                                        class="w-12 h-12 text-green-500"
                                    />
                                </div>
                                <div>
                                    <h2 class="text-2xl font-bold text-gray-900 dark:text-white">
                                        ¡Solicitud enviada!
                                    </h2>
                                    <p class="mt-2 text-gray-500 dark:text-gray-400">
                                        Gracias <strong>{{ form.nombre }}</strong>, revisaremos tu solicitud y nos pondremos en contacto a través de <strong>{{ form.email }}</strong>.
                                    </p>
                                </div>
                                <UButton
                                    to="/productos"
                                    icon="i-heroicons-arrow-left"
                                    variant="soft"
                                    label="Ver más productos"
                                    class="mt-2"
                                />
                            </div>
                        </UCard>
                    </template>

                    <!-- Formulario activo -->
                    <template v-else>
                        <UCard>
                            <template #header>
                                <h2 class="text-lg font-semibold text-gray-900 dark:text-white">
                                    Datos de contacto y solicitud
                                </h2>
                            </template>

                            <UForm :state="form" @submit="handleSubmit" class="space-y-5">

                                <!-- Fila: Nombre + Empresa -->
                                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                
                                        <UInput
                                            v-model="form.nombre"
                                            placeholder="Juan Pérez"
                                            icon="i-heroicons-user"
                                            size="md"
                                        />
                                    

                                    
                                        <UInput
                                            v-model="form.empresa"
                                            placeholder="Mi Empresa S.A."
                                            icon="i-heroicons-building-office-2"
                                            size="md"
                                        />
                                    
                                </div>

                                <!-- Fila: Email + Teléfono -->
                                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    
                                        <UInput
                                            v-model="form.email"
                                            type="email"
                                            placeholder="correo@ejemplo.com"
                                            icon="i-heroicons-envelope"
                                            size="md"
                                        />
                                    

                                    
                                        <UInput
                                            v-model="form.telefono"
                                            type="tel"
                                            placeholder="+52 33 1234 5678"
                                            icon="i-heroicons-phone"
                                            size="md"
                                        />
                                    
                                </div>

                                <!-- Fila: Producto + Cantidad -->
                                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    
                                        <USelect
                                            v-model="form.producto"
                                            :options="productosDisponibles"
                                            placeholder="Selecciona un producto"
                                            size="md"
                                        />
                                

                                    
                                        <UInput
                                            v-model="form.cantidad"
                                            type="number"
                                            placeholder="Ej. 100"
                                            icon="i-heroicons-hashtag"
                                            min="1"
                                            size="md"
                                        />
                                    
                                </div>

                                <!-- Mensaje -->
                                
                                    <UTextarea
                                        v-model="form.mensaje"
                                        placeholder="Cuéntanos más sobre tu proyecto, especificaciones o cualquier duda..."
                                        :rows="5"
                                        size="md"
                                        autoresize
                                    />
                                    
                                <!-- Error general -->
                                <UAlert
                                    v-if="errorEnvio"
                                    icon="i-heroicons-exclamation-triangle"
                                    color="red"
                                    variant="soft"
                                    title="No se pudo enviar la solicitud"
                                    description="Por favor intenta de nuevo o contáctanos directamente."
                                />

                                <!-- Submit -->
                                <div class="flex justify-end pt-2">
                                    <UButton
                                        type="submit"
                                        size="lg"
                                        icon="i-heroicons-paper-airplane"
                                        :loading="loading"
                                        label="Enviar solicitud"
                                    />
                                </div>
                            </UForm>
                        </UCard>
                    </template>
                </div>

                <!-- Panel lateral informativo -->
                <aside class="space-y-4">
                    <UCard>
                        <template #header>
                            <h3 class="font-semibold text-gray-900 dark:text-white text-sm uppercase tracking-wider">
                                ¿Cómo funciona?
                            </h3>
                        </template>
                        <ul class="space-y-4">
                            <li
                                v-for="(paso, i) in [
                                    { icon: 'i-heroicons-pencil-square', texto: 'Llena el formulario con tus datos y el producto que te interesa.' },
                                    { icon: 'i-heroicons-clock', texto: 'Revisamos tu solicitud en menos de 24 horas hábiles.' },
                                    { icon: 'i-heroicons-chat-bubble-left-right', texto: 'Te contactamos con una propuesta personalizada.' },
                                ]"
                                :key="i"
                                class="flex items-start gap-3"
                            >
                                <div class="p-1.5 rounded-lg bg-primary-50 dark:bg-primary-950 flex-shrink-0">
                                    <UIcon :name="paso.icon" class="w-4 h-4 text-primary-500" />
                                </div>
                                <p class="text-sm text-gray-600 dark:text-gray-400">{{ paso.texto }}</p>
                            </li>
                        </ul>
                    </UCard>

                    <UCard>
                        <template #header>
                            <h3 class="font-semibold text-gray-900 dark:text-white text-sm uppercase tracking-wider">
                                Contacto directo
                            </h3>
                        </template>
                        <div class="space-y-3">
                            <div class="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                                <UIcon name="i-heroicons-envelope" class="w-4 h-4 text-primary-500 flex-shrink-0" />
                                <span>contacto@tuempresa.com</span>
                            </div>
                            <div class="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                                <UIcon name="i-heroicons-phone" class="w-4 h-4 text-primary-500 flex-shrink-0" />
                                <span>+52 33 1234 5678</span>
                            </div>
                            <div class="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                                <UIcon name="i-heroicons-clock" class="w-4 h-4 text-primary-500 flex-shrink-0" />
                                <span>Lun – Vie, 9:00 – 18:00</span>
                            </div>
                        </div>
                    </UCard>
                </aside>

            </div>
        </section>

    </div>
</template>