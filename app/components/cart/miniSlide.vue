<template>
    <USlideover v-model:open="isOpen" side="right" :ui="{ width: 'max-w-sm' }">
        <!-- Trigger -->
        <button @click="isOpen = true" class="relative cursor-pointer hover:scale-105 transition-transform">
            <CartBadge />
        </button>

        <template #content>
            <div class="flex flex-col h-full bg-white">

                <!-- Header -->
                <div class="flex items-center justify-between px-6 py-5 border-b border-stone-200">
                    <div class="flex items-center gap-3">
                        <UIcon name="i-heroicons-shopping-cart" class="text-red-600 size-5" />
                        <h2 class="text-base font-bold text-stone-900 uppercase tracking-wide">
                            Carrito
                        </h2>
                        <span v-if="cart.totalItems > 0"
                            class="bg-red-600 text-white text-xs font-bold px-2 py-0.5 rounded-full leading-none">
                            {{ cart.totalItems }}
                        </span>
                    </div>
                    <!-- Botón cerrar — crítico en móvil -->
                    <button @click="isOpen = false"
                        class="flex items-center justify-center size-9 rounded-full hover:bg-stone-100 transition-colors text-stone-500 hover:text-stone-900">
                        <UIcon name="i-heroicons-x-mark" class="size-5" />
                    </button>
                </div>

                <!-- Items -->
                <div class="flex-1 overflow-y-auto px-6 py-4 space-y-3">

                    <!-- Carrito vacío -->
                    <div v-if="cart.items.length === 0"
                        class="flex flex-col items-center justify-center h-full py-16 text-center gap-4">
                        <UIcon name="i-heroicons-shopping-cart" class="size-16 text-stone-200" />
                        <p class="text-stone-400 text-sm">Tu carrito está vacío</p>
                        <UButton variant="outline" size="sm" color="gray" @click="isOpen = false">
                            Seguir explorando
                        </UButton>
                    </div>

                    <!-- Lista de productos -->
                    <div v-for="item in cart.items" :key="item.id"
                        class="flex gap-3 py-3 border-b border-stone-100 last:border-0">
                        <!-- Imagen placeholder o real -->
                        <div class="size-14 bg-stone-100 shrink-0 overflow-hidden">
                            <img v-if="item.imagen" :src="item.imagen" :alt="item.nombre"
                                class="w-full h-full object-contain p-1" />
                            <UIcon v-else name="i-heroicons-wrench-screwdriver"
                                class="w-full h-full p-3 text-stone-300" />
                        </div>

                        <!-- Info -->
                        <div class="flex-1 min-w-0">
                            <p class="text-sm font-semibold text-stone-900 leading-tight line-clamp-2">
                                {{ item.nombre }}
                            </p>
                            <p class="text-xs text-stone-400 mt-1">
                                {{ item.cantidad }} × {{ formatCurrency(item.precio_venta) }}
                            </p>
                        </div>

                        <!-- Subtotal -->
                        <div class="text-right shrink-0">
                            <p class="text-sm font-bold text-stone-900">
                                {{ formatCurrency(item.precio_venta * item.cantidad) }}
                            </p>
                        </div>
                    </div>
                </div>

                <!-- Footer / Totales -->
                <div v-if="cart.items.length > 0" class="px-6 py-5 border-t border-stone-200 bg-stone-50 space-y-4">
                    <div class="flex justify-between items-center">
                        <span class="text-sm text-stone-500 uppercase tracking-wide">Subtotal</span>
                        <span class="text-xl font-bold text-stone-900">
                            {{ formatCurrency(cart.subtotal) }}
                        </span>
                    </div>
                    <p class="text-xs text-stone-400">Envío e impuestos calculados al finalizar.</p>

                    <NuxtLink to="/cart" @click="isOpen = false">
                        <UButton
                            class="w-full bg-red-600 hover:bg-red-700 text-white font-bold justify-center"
                            size="lg">
                            Ir al carrito
                            <UIcon name="i-heroicons-arrow-right" class="size-4 ml-1" />
                        </UButton>
                    </NuxtLink>

                    <button @click="isOpen = false"
                        class="w-full text-center text-xs text-stone-400 hover:text-stone-600 transition-colors py-1">
                        Seguir comprando
                    </button>
                </div>

            </div>
        </template>
    </USlideover>
</template>

<script setup>
    const cart = useCartStore()
    const { formatCurrency } = useCurrency()
    const isOpen = ref(false)
</script>