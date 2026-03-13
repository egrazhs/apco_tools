<template>
    <header class="sticky top-0 z-50 bg-white border-b border-stone-200 shadow-sm">
        <UContainer>
            <div class="flex items-center justify-between h-16">

                <!-- Logo -->
                <NuxtLink to="/" class="flex items-center">
                    <img
                        src="/img/APCO_PNG.webp"
                        alt="APCO Tools"
                        class="h-9 object-contain"
                        draggable="false"
                    />
                </NuxtLink>

                <!-- Nav desktop -->
                <nav class="hidden md:flex items-center gap-1">
                    <NuxtLink
                        v-for="link in navLinks"
                        :key="link.label"
                        :to="link.to"
                        class="px-4 py-2 text-xs font-bold uppercase tracking-widest text-stone-600 hover:text-red-600 hover:bg-stone-50 transition-colors duration-150"
                        active-class="text-red-600"
                    >
                        {{ link.label }}
                    </NuxtLink>
                </nav>

                <!-- Derecha: carrito + hamburger mobile -->
                <div class="flex items-center gap-3">
                    <div class="text-stone-700">
                        <CartMiniSlide />
                    </div>

                    <!-- Hamburger mobile -->
                    <button
                        @click="menuAbierto = !menuAbierto"
                        class="md:hidden p-2 text-stone-700 hover:text-red-600 transition-colors"
                        aria-label="Menú"
                    >
                        <UIcon
                            :name="menuAbierto ? 'i-heroicons-x-mark' : 'i-heroicons-bars-3'"
                            class="text-2xl"
                        />
                    </button>
                </div>

            </div>
        </UContainer>

        <!-- Nav mobile -->
        <Transition
            enter-active-class="transition-all duration-200 ease-out"
            enter-from-class="opacity-0 -translate-y-2"
            enter-to-class="opacity-100 translate-y-0"
            leave-active-class="transition-all duration-150 ease-in"
            leave-from-class="opacity-100 translate-y-0"
            leave-to-class="opacity-0 -translate-y-2"
        >
            <nav v-if="menuAbierto" class="md:hidden bg-white border-t border-stone-100">
                <NuxtLink
                    v-for="link in navLinks"
                    :key="link.label"
                    :to="link.to"
                    class="block w-full px-6 py-3 text-sm font-bold uppercase tracking-widest text-stone-600 hover:text-red-600 hover:bg-stone-50 border-b border-stone-100 transition-colors"
                    active-class="text-red-600 bg-stone-50"
                    @click="menuAbierto = false"
                >
                    {{ link.label }}
                </NuxtLink>
            </nav>
        </Transition>
    </header>
</template>

<script setup>
    const menuAbierto = ref(false)

    const navLinks = [
        { label: 'Inicio',    to: '/' },
        { label: 'Productos', to: '/productos' },
        { label: 'Marcas',    to: '/#marcas' },
        { label: 'Contacto',  to: '/#contacto' },
    ]
</script>