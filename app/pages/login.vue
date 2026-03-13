<template>
    <div class="min-h-screen bg-stone-100 flex items-center justify-center relative overflow-hidden">

        <!-- Fondo decorativo con patrón geométrico sutil -->
        <div class="absolute inset-0 pointer-events-none" aria-hidden="true">
            <svg class="absolute top-0 right-0 w-96 h-96 opacity-5" viewBox="0 0 400 400" fill="none">
                <circle cx="350" cy="50" r="200" stroke="#292524" stroke-width="1"/>
                <circle cx="350" cy="50" r="140" stroke="#292524" stroke-width="1"/>
                <circle cx="350" cy="50" r="80" stroke="#292524" stroke-width="1"/>
            </svg>
            <svg class="absolute bottom-0 left-0 w-80 h-80 opacity-5" viewBox="0 0 400 400" fill="none">
                <rect x="20" y="20" width="360" height="360" stroke="#292524" stroke-width="1" rx="2"/>
                <rect x="60" y="60" width="280" height="280" stroke="#292524" stroke-width="1" rx="2"/>
                <rect x="100" y="100" width="200" height="200" stroke="#292524" stroke-width="1" rx="2"/>
            </svg>
        </div>

        <!-- Tarjeta principal -->
        <div class="relative w-full max-w-sm mx-4 animate-rise">

            <!-- Acento superior amber -->
            <div class="h-1 w-full bg-gradient-to-r from-amber-500 via-amber-400 to-amber-600 rounded-t-xl"/>

            <div class="bg-white border border-stone-200 shadow-2xl shadow-stone-200/80 rounded-b-xl px-8 py-9">

                <!-- Logo / Header -->
                <div class="mb-8 text-center">
                    <div class="inline-flex items-center justify-center w-12 h-12 bg-stone-900 rounded-lg mb-4">
                        <UIcon name="i-heroicons-wrench-screwdriver" class="text-amber-400 text-xl w-6 h-6"/>
                    </div>
                    <h1 class="font-serif text-2xl font-bold text-stone-900 tracking-tight">
                        Panel de Administración
                    </h1>
                    <p class="text-stone-400 text-sm mt-1 tracking-wide">Ferretería en línea</p>
                </div>

                <USeparator class="mb-7" />

                <!-- Formulario -->
                <form @submit.prevent="handleLogin" class="space-y-5">

                    <!-- Email -->
<UInput
    v-model="email"
    type="email"
    placeholder="admin@ferreteria.com"
    icon="i-heroicons-envelope"
    size="md"
    required
    :ui="{
        base: 'text-stone-900 placeholder-stone-400 bg-white',
        icon: { leading: { wrapper: 'text-stone-400' } },
        rounded: 'rounded-lg',
    }"
    class="w-full"
/>

<!-- Password -->
<UInput
    v-model="password"
    :type="showPassword ? 'text' : 'password'"
    placeholder="••••••••"
    icon="i-heroicons-lock-closed"
    :trailing-icon="showPassword ? 'i-heroicons-eye-slash' : 'i-heroicons-eye'"
    size="md"
    required
    :ui="{
        base: 'text-stone-900 placeholder-stone-400 bg-white',
        icon: { leading: { wrapper: 'text-stone-400' }, trailing: { wrapper: 'text-stone-400 cursor-pointer hover:text-stone-600 transition-colors' } },
        rounded: 'rounded-lg',
    }"
    class="w-full"
    @click:trailing="showPassword = !showPassword"
/>

                    <!-- Error -->
                    <Transition name="slide-error">
                        <div
                            v-if="errorMsg"
                            class="flex items-start gap-2 bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg px-3 py-2.5"
                        >
                            <UIcon name="i-heroicons-exclamation-circle" class="w-4 h-4 mt-0.5 flex-shrink-0"/>
                            <span>{{ errorMsg }}</span>
                        </div>
                    </Transition>

                    <!-- Botón -->
                    <UButton
                        type="submit"
                        :loading="loading"
                        :disabled="loading"
                        block
                        size="md"
                        class="bg-stone-900 hover:bg-stone-800 active:bg-stone-950 text-white font-semibold tracking-wide rounded-lg transition-all duration-150 mt-2"
                        :ui="{ rounded: 'rounded-lg' }"
                    >
                        {{ loading ? 'Verificando...' : 'Iniciar sesión' }}
                    </UButton>

                </form>

            </div>

            <!-- Pie de página -->
            <p class="text-center text-xs text-stone-400 mt-4">
                © {{ new Date().getFullYear() }} Ferretería — Acceso restringido
            </p>
        </div>

    </div>
</template>

<script setup lang="ts">
const { login } = useAuth()
const user = useSupabaseUser()

const email = ref('')
const password = ref('')
const errorMsg = ref('')
const loading = ref(false)
const showPassword = ref(false)

const handleLogin = async () => {
    errorMsg.value = ''
    loading.value = true
    try {
        await login(email.value, password.value)
    } catch (err: any) {
        errorMsg.value = err.message
    } finally {
        loading.value = false
    }
}

watch(user, (val) => {
    if (val) navigateTo('/admin')
}, { immediate: true })
</script>

<style scoped>
@keyframes rise {
    from {
        opacity: 0;
        transform: translateY(16px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.animate-rise {
    animation: rise 0.45s cubic-bezier(0.16, 1, 0.3, 1) both;
}

.slide-error-enter-active,
.slide-error-leave-active {
    transition: all 0.2s ease;
}
.slide-error-enter-from,
.slide-error-leave-to {
    opacity: 0;
    transform: translateY(-4px);
}
</style>