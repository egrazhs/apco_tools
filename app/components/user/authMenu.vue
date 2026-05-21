<template>
    <div class="flex items-center gap-2">

        <!-- Estado: cargando (evita flash de contenido incorrecto) -->
        <template v-if="pending">
            <div class="w-8 h-8 rounded-full bg-stone-200 animate-pulse" />
        </template>

        <!-- Estado: autenticado -->
        <template v-else-if="user">
            <UDropdownMenu :items="menuItems">
                <UButton
                    variant="ghost"
                    class="flex items-center gap-2 px-2"
                >
                    <UAvatar
                        :alt="displayName"
                        size="sm"
                        class="bg-red-600 text-white"
                    />
                    <span class="hidden md:block text-sm font-medium text-stone-800 max-w-[120px] truncate">
                        {{ displayName }}
                    </span>
                    <UIcon name="i-heroicons-chevron-down" class="w-4 h-4 text-stone-500" />
                </UButton>
            </UDropdownMenu>
        </template>

        <!-- Estado: no autenticado -->
        <template v-else>
            <UButton
                to="/login"
                variant="ghost"
                size="sm"
                class="text-stone-700 hover:text-red-600"
            >
                Iniciar sesión
            </UButton>
            <UButton
                to="/registro"
                size="sm"
                class="bg-red-600 text-white hover:bg-red-700"
            >
                Registrarse
            </UButton>
        </template>

    </div>
</template>

<script setup>
const client = useSupabaseClient()
const user = useSupabaseUser()

// Pequeño estado de carga inicial para evitar el "flash" de botones de login
// mientras Supabase resuelve la sesión
const pending = ref(true)
onMounted(() => {
    pending.value = false
})

// Nombre a mostrar: prioriza display_name del metadata, luego email
const displayName = computed(() => {
    return user.value?.user_metadata?.display_name
        ?? user.value?.email?.split('@')[0]
        ?? 'Mi cuenta'
})

async function handleSignOut() {
    await client.auth.signOut()
    await navigateTo('/')
}

const menuItems = computed(() => [
    [
        {
            label: displayName.value,
            slot: 'account',
            disabled: true,
        }
    ],
    [
        {
            label: 'Mi cuenta',
            icon: 'i-heroicons-user-circle',
            to: '/mi_cuenta',
        },
    ],
    [
        {
            label: 'Cerrar sesión',
            icon: 'i-heroicons-arrow-right-on-rectangle',
            class: 'text-red-600',
            onSelect: handleSignOut,
        }
    ]
])
</script>