<template>
    <header class="sticky top-0 bg-white z-50 border-b border-stone-200 shadow-sm">
        <UContainer>
            <div class="flex justify-between items-center py-3">

                <!-- Logo -->
                <NuxtLink to="/" class="flex items-center">
                    <img
                        src="/img/APCO_PNG.webp"
                        alt="APCO Tools"
                        class="h-10 object-contain"
                        draggable="false"
                    />
                </NuxtLink>

                <!-- Nav desktop -->
                <nav class="hidden lg:flex items-center gap-1">
                    <a
                        v-for="link in navLinks"
                        :key="link.label"
                        :href="link.href"
                        class="px-4 py-2 text-xs font-bold uppercase tracking-widest text-stone-600 hover:text-red-600 hover:bg-stone-50 transition-colors duration-150"
                    >
                        {{ link.label }}
                    </a>

                    <!-- CTA cotización -->
                    <a
                        href="#contacto"
                        class="ml-4 px-5 py-2 text-xs font-black uppercase tracking-widest bg-red-600 text-white hover:bg-stone-900 transition-colors duration-150"
                    >
                        Cotizar
                    </a>

                    <!-- Carrito -->
                    <div class="ml-2 relative">
                        <CartMiniSlide />
                    </div>
                </nav>

                <!-- Mobile: carrito + hamburger -->
                <div class="flex items-center gap-3 lg:hidden">
                    <CartMiniSlide />
                    <button
                        @click="menuAbierto = !menuAbierto"
                        class="p-2 text-stone-700 hover:text-red-600 transition-colors"
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
            <nav v-if="menuAbierto" class="lg:hidden bg-white border-t border-stone-100">
                <a
                    v-for="link in navLinks"
                    :key="link.label"
                    :href="link.href"
                    class="block w-full px-6 py-3 text-sm font-bold uppercase tracking-widest text-stone-600 hover:text-red-600 hover:bg-stone-50 border-b border-stone-100 transition-colors"
                    @click="menuAbierto = false"
                >
                    {{ link.label }}
                </a>
                <a
                
                    href="#contacto"
                    class="block w-full px-6 py-3 text-sm font-black uppercase tracking-widest bg-red-600 text-white hover:bg-stone-900 transition-colors text-center"
                    @click="menuAbierto = false"
                >
                    Cotizar Ahora
                </a>
            </nav>
        </Transition>
    </header>
</template>

<script setup>
    const menuAbierto = ref(false)

    const navLinks = [
        { label: 'Inicio',    href: '#inicio' },
        { label: 'Nosotros',  href: '#nosotros' },
        { label: 'Productos', href: '#productos' },
        { label: 'Marcas',    href: '#marcas' },
        { label: 'Contacto',  href: '#contacto' },
    ]
</script>