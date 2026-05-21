<template>
    <div class="min-h-screen bg-stone-50 flex items-center justify-center py-16 px-4">
        <div class="w-full max-w-md">

            <!-- Header -->
            <div class="mb-8">
                <NuxtLink to="/" class="inline-flex items-center gap-2 text-stone-500 hover:text-red-600 transition-colors text-sm mb-6">
                    <UIcon name="i-heroicons-arrow-left" class="w-4 h-4" />
                    Volver al inicio
                </NuxtLink>

                <h1 class="uppercase text-4xl md:text-5xl text-stone-400 font-light tracking-wide">
                    Crear cuenta
                </h1>

                <hr class="border-red-600 border-y-4 w-[180px] mt-2" />
                
                <p class="text-stone-500 mt-4 text-sm">
                    ¿Ya tienes cuenta?
                    <NuxtLink to="/login" class="text-red-600 hover:underline font-medium">
                        Inicia sesión aquí
                    </NuxtLink>
                </p>
            </div>

            <!-- Card del formulario -->
            <div class="bg-white border border-stone-200 shadow-sm p-8">

                <!-- Alerta de éxito -->
                <UAlert
                    v-if="successMessage"
                    icon="i-heroicons-envelope"
                    color="success"
                    variant="soft"
                    title="¡Registro exitoso!"
                    :description="successMessage"
                    class="mb-6"
                />

                <!-- Alerta de error -->
                <UAlert
                    v-if="errorMessage"
                    icon="i-heroicons-exclamation-triangle"
                    color="error"
                    variant="soft"
                    title="Error al registrarse"
                    :description="errorMessage"
                    class="mb-6"
                />

                <div v-if="!successMessage" class="flex flex-col gap-5">

                    <!-- Nombre -->
                    <UFormField label="NOMBRE COMPLETO" required>
                        <template #label>
                            <span class="text-xs uppercase tracking-widest text-stone-500 font-medium">
                                Nombre completo
                            </span>
                        </template>
                        <UInput
                            v-model="form.name"
                            placeholder="Juan Pérez"
                            size="lg"
                            :ui="{
                                base: 'bg-white text-stone-900',
                            }"
                        />
                    </UFormField>

                    <!-- Email -->
                    <UFormField label="Correo electrónico" required>
                        <template #label>
                            <span class="text-xs uppercase tracking-widest text-stone-500 font-medium">
                                Correo electrónico
                            </span>
                        </template>
                        <UInput
                            v-model="form.email"
                            type="email"
                            placeholder="correo@ejemplo.com"
                            size="lg"
                            :ui="{
                                base: 'bg-white text-stone-900',
                            }"
                        />
                    </UFormField>

                    <!-- Contraseña -->
                    <UFormField required>
                        <template #label>
                            <span class="text-xs uppercase tracking-widest text-stone-500 font-medium">
                                Contraseña
                            </span>
                        </template>
                        <UInput
                            v-model="form.password"
                            :type="showPassword ? 'text' : 'password'"
                            placeholder="Mínimo 6 caracteres"
                            size="lg"
                            :ui="{
                                base: 'bg-white text-stone-900',
                            }"
                        >
                            <template #trailing>
                                <UButton
                                    variant="ghost"
                                    size="xs"
                                    :icon="showPassword ? 'i-heroicons-eye-slash' : 'i-heroicons-eye'"
                                    class="text-stone-400"
                                    @click="showPassword = !showPassword"
                                />
                            </template>
                        </UInput>
                    </UFormField>

                    <!-- Confirmar contraseña -->
                    <UFormField required>
                        <template #label>
                            <span class="text-xs uppercase tracking-widest text-stone-500 font-medium">
                                Confirmar contraseña
                            </span>
                        </template>
                        <UInput
                            v-model="form.confirmPassword"
                            :type="showPassword ? 'text' : 'password'"
                            placeholder="Repite tu contraseña"
                            size="lg"
                            :ui="{
                                base: 'bg-white text-stone-900',
                                ...(passwordMismatch && {
                                    base: 'bg-white text-stone-900 ring-red-500'
                                })
                            }"
                        />
                        <p v-if="passwordMismatch" class="text-red-500 text-xs mt-1">
                            Las contraseñas no coinciden.
                        </p>
                    </UFormField>

                    <!-- Botón submit -->
                    <UButton
                        size="lg"
                        :loading="loading"
                        :disabled="loading || !isFormValid"
                        class="w-full justify-center bg-red-600 hover:bg-red-700 text-white mt-2"
                        @click="handleRegister"
                    >
                        Crear cuenta
                    </UButton>

                </div>
            </div>

            <!-- Footer de la card -->
            <p class="text-center text-xs text-stone-400 mt-6">
                Al registrarte aceptas nuestros términos de uso y política de privacidad.
            </p>

        </div>
    </div>
</template>

<script setup>
definePageMeta({
    layout: false,
    middleware: 'guest',
})

const client = useSupabaseClient()

const form = reactive({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
})

const loading = ref(false)
const showPassword = ref(false)
const errorMessage = ref('')
const successMessage = ref('')

const passwordMismatch = computed(() =>
    form.confirmPassword.length > 0 && form.password !== form.confirmPassword
)

const isFormValid = computed(() =>
    form.name.trim().length > 0 &&
    form.email.trim().length > 0 &&
    form.password.length >= 6 &&
    form.password === form.confirmPassword
)

// Mapeo de errores de Supabase a mensajes en español
const errorMap = {
    'User already registered': 'Ya existe una cuenta con ese correo electrónico.',
    'Password should be at least 6 characters': 'La contraseña debe tener al menos 6 caracteres.',
    'Unable to validate email address: invalid format': 'El formato del correo electrónico no es válido.',
    'Email rate limit exceeded': 'Demasiados intentos. Por favor espera unos minutos.',
}

async function handleRegister() {
    if (!isFormValid.value) return
    loading.value = true
    errorMessage.value = ''

    // 1. Verificar qué se está enviando antes del llamado
    console.log('📤 Enviando a Supabase:', {
        email: form.email.trim(),
        password: form.password,
        name: form.name.trim(),
    })

    const { data, error } = await client.auth.signUp({
        email: form.email.trim(),
        password: form.password,
        options: {
            data: {
                name: form.name.trim(),
            },
        },
    })

    // 2. Ver exactamente qué respondió Supabase
    console.log('📥 Respuesta de Supabase:', { data, error })

    loading.value = false

    if (error) {
        errorMessage.value = errorMap[error.message] ?? 'Ocurrió un error inesperado. Intenta de nuevo.'
        return
    }

    if (data.user?.identities?.length === 0) {
        errorMessage.value = 'Ya existe una cuenta con ese correo electrónico.'
        return
    }

    if (!data.user) {
        errorMessage.value = 'Ya existe una cuenta con ese correo electrónico.'
        return
    }

    successMessage.value = `Te enviamos un correo a ${form.email} para confirmar tu cuenta. Revisa tu bandeja de entrada (y spam).`
}
</script>