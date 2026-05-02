<template>
    <div class="max-w-7xl mx-auto px-4 py-8">

        <!-- Header -->
        <div class="mb-8">
            <h1 class="text-3xl font-bold text-stone-900">Carrito de compras</h1>
        </div>

        <ClientOnly>
            <p class="text-stone-500 mt-1 mb-6">{{ cart.totalItems }} producto(s)</p>

            <!-- Estado vacío -->
            <div v-if="cart.isEmpty" class="text-center py-20">
                <UIcon name="i-heroicons-shopping-cart" class="size-20 text-stone-200 mx-auto mb-6" />
                <h2 class="text-xl font-semibold mb-2 text-stone-900">Tu carrito está vacío</h2>
                <p class="text-stone-500 mb-6">Explora nuestros productos y encuentra lo que necesitas</p>
                <UButton to="/productos" size="lg" color="red">Ver productos</UButton>
            </div>

            <!-- Contenido carrito -->
            <div v-else class="grid grid-cols-1 lg:grid-cols-3 gap-8">

                <!-- Lista de productos -->
                <div class="lg:col-span-2 space-y-4">
                    <div
                        v-for="item in cart.items"
                        :key="item.product_id"
                        class="flex flex-col md:flex-row gap-6 border border-stone-200 rounded-xl p-6 bg-white"
                    >
                        <!-- Imagen -->
                        <div class="size-32 bg-stone-100 shrink-0 overflow-hidden rounded-lg">
                            <img
                                v-if="item.image_url"
                                :src="item.image_url"
                                :alt="item.name"
                                class="w-full h-full object-contain p-2"
                            />
                            <UIcon
                                v-else
                                name="i-heroicons-wrench-screwdriver"
                                class="w-full h-full p-6 text-stone-300"
                            />
                        </div>

                        <!-- Info -->
                        <div class="flex-1 space-y-2">
                            <NuxtLink
                                :to="`/productos/${item.slug}`"
                                class="text-base font-semibold text-stone-900 hover:text-red-600 transition-colors line-clamp-2"
                            >
                                {{ item.name }}
                            </NuxtLink>

                            <p class="text-lg font-bold text-stone-900">
                                {{ formatCurrency(item.price) }}
                            </p>

                            <!-- Controles cantidad -->
                            <div class="flex items-center gap-3 pt-1">
                                <div class="flex items-center rounded-lg border border-stone-200 overflow-hidden">
                                    <button
                                        @click="handleUpdateQty(item.product_id, item.quantity - 1)"
                                        :disabled="item.quantity <= 1"
                                        class="px-3 py-2 text-stone-500 hover:bg-stone-100 transition-colors disabled:opacity-30 disabled:cursor-not-allowed font-bold"
                                    >−</button>
                                    <span class="px-4 py-2 text-stone-900 font-semibold text-sm min-w-[2.5rem] text-center">
                                        {{ item.quantity }}
                                    </span>
                                    <button
                                        @click="handleUpdateQty(item.product_id, item.quantity + 1)"
                                        :disabled="item.quantity >= item.stock"
                                        class="px-3 py-2 text-stone-500 hover:bg-stone-100 transition-colors disabled:opacity-30 disabled:cursor-not-allowed font-bold"
                                    >+</button>
                                </div>

                                <button
                                    @click="handleRemove(item.product_id)"
                                    class="text-stone-300 hover:text-red-500 transition-colors"
                                >
                                    <UIcon name="i-heroicons-trash" class="size-5" />
                                </button>
                            </div>
                        </div>

                        <!-- Subtotal -->
                        <div class="text-right shrink-0">
                            <p class="text-xs text-stone-400 mb-1">Subtotal</p>
                            <p class="text-lg font-bold text-stone-900">
                                {{ formatCurrency(item.price * item.quantity) }}
                            </p>
                        </div>
                    </div>
                </div>

                <!-- Resumen -->
                <div class="border border-stone-200 rounded-xl p-6 h-fit sticky top-24 space-y-4 bg-white">
                    <h2 class="text-lg font-bold text-stone-900">Resumen de compra</h2>

                    <div class="flex justify-between text-sm text-stone-600">
                        <span>Subtotal (sin IVA)</span>
                        <span>{{ formatCurrency(subtotalSinIva) }}</span>
                    </div>
                    <div class="flex justify-between text-sm text-stone-600">
                        <span>IVA (16%)</span>
                        <span>{{ formatCurrency(iva) }}</span>
                    </div>

                    <USeparator />

                    <div class="flex justify-between text-lg font-bold text-stone-900">
                        <span>Total</span>
                        <span>{{ formatCurrency(total) }}</span>
                    </div>

                    <UButton
                        block
                        size="lg"
                        class="bg-red-600 hover:bg-red-700 text-white font-bold justify-center mt-2"
                    >
                        Proceder al pago
                    </UButton>
                    <UButton to="/productos" variant="ghost" color="gray" block class="justify-center">
                        Seguir comprando
                    </UButton>
                </div>
            </div>

            <!-- Skeleton fallback SSR -->
            <template #fallback>
                <div class="space-y-4">
                    <USkeleton class="h-5 w-32" />
                    <USkeleton class="h-36 w-full rounded-xl" />
                    <USkeleton class="h-36 w-full rounded-xl" />
                </div>
            </template>
        </ClientOnly>
    </div>
</template>

<script setup lang="ts">
    const cart = useCartStore()
    const { formatCurrency } = useCurrency()
    const { removeItem, updateQuantity } = useSupabaseCart()

    // ── IVA y total ───────────────────────────────────────────────────
    // cart.subtotal ya incluye IVA si tus precios son con IVA.
    // Ajusta esta lógica según si tus precios son con o sin IVA.
    const subtotalSinIva = computed(() =>
        cart.subtotal / 1.16
    )
    const iva = computed(() =>
        cart.subtotal - subtotalSinIva.value
    )
    const total = computed(() => cart.subtotal)

    // ── Handlers ──────────────────────────────────────────────────────
    async function handleUpdateQty(product_id: number, quantity: number) {
        await updateQuantity(product_id, quantity)
    }

    async function handleRemove(product_id: number) {
        await removeItem(product_id)
    }
</script>