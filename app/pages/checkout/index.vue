<template>
    <div class="min-h-screen bg-stone-50">

        <!-- Header mínimo -->
        <header class="bg-white border-b border-stone-200 py-4">
            <div class="container mx-auto px-4 flex items-center gap-4">
                <NuxtLink to="/" class="text-stone-400 hover:text-stone-700 transition-colors">
                    <UIcon name="i-heroicons-arrow-left" class="w-5 h-5" />
                </NuxtLink>
                <span class="text-lg font-semibold text-stone-800 tracking-tight">Finalizar compra</span>
            </div>
        </header>

        <div class="container mx-auto px-4 py-10">

            <!-- Carrito vacío -->
            <div v-if="!cartItems.length" class="text-center py-24">
                <UIcon name="i-heroicons-shopping-cart" class="w-16 h-16 text-stone-300 mx-auto mb-4" />
                <p class="text-stone-500 text-lg">Tu carrito está vacío.</p>
                <UButton to="/productos" class="mt-6 bg-red-600 text-white hover:bg-red-700">
                    Ver productos
                </UButton>
            </div>

            <!-- Layout principal -->
            <div v-else class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

                <!-- ══ COLUMNA IZQUIERDA: Dirección de envío ══════════════════ -->
                <div class="lg:col-span-7 space-y-6">

                    <div class="bg-white border border-stone-200 p-6">
                        <h2 class="text-xl font-semibold text-stone-800 mb-6 flex items-center gap-2">
                            <UIcon name="i-heroicons-map-pin" class="w-5 h-5 text-red-600" />
                            Dirección de envío
                        </h2>

                        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <!-- Nombre del destinatario -->
                            <div class="sm:col-span-2">
                                <label class="block text-sm font-medium text-stone-700 mb-1">
                                    Nombre completo del destinatario *
                                </label>
                                <UInput
                                    v-model="address.nombre"
                                    placeholder="Ej. Juan García López"
                                    :ui="inputUI"
                                    :class="{ 'ring-1 ring-red-500': errors.nombre }"
                                />
                                <p v-if="errors.nombre" class="text-xs text-red-500 mt-1">{{ errors.nombre }}</p>
                            </div>

                            <!-- Calle -->
                            <div class="sm:col-span-2">
                                <label class="block text-sm font-medium text-stone-700 mb-1">Calle *</label>
                                <UInput
                                    v-model="address.calle"
                                    placeholder="Ej. Av. La Paz"
                                    :ui="inputUI"
                                    :class="{ 'ring-1 ring-red-500': errors.calle }"
                                />
                                <p v-if="errors.calle" class="text-xs text-red-500 mt-1">{{ errors.calle }}</p>
                            </div>

                            <!-- Número exterior -->
                            <div>
                                <label class="block text-sm font-medium text-stone-700 mb-1">No. Exterior *</label>
                                <UInput
                                    v-model="address.numero_ext"
                                    placeholder="1181"
                                    :ui="inputUI"
                                    :class="{ 'ring-1 ring-red-500': errors.numero_ext }"
                                />
                                <p v-if="errors.numero_ext" class="text-xs text-red-500 mt-1">{{ errors.numero_ext }}</p>
                            </div>

                            <!-- Número interior (opcional) -->
                            <div>
                                <label class="block text-sm font-medium text-stone-700 mb-1">
                                    No. Interior <span class="text-stone-400 font-normal">(opcional)</span>
                                </label>
                                <UInput
                                    v-model="address.numero_int"
                                    placeholder="Depto. 3B"
                                    :ui="inputUI"
                                />
                            </div>

                            <!-- Colonia -->
                            <div>
                                <label class="block text-sm font-medium text-stone-700 mb-1">Colonia *</label>
                                <UInput
                                    v-model="address.colonia"
                                    placeholder="Col. Centro"
                                    :ui="inputUI"
                                    :class="{ 'ring-1 ring-red-500': errors.colonia }"
                                />
                                <p v-if="errors.colonia" class="text-xs text-red-500 mt-1">{{ errors.colonia }}</p>
                            </div>

                            <!-- Ciudad -->
                            <div>
                                <label class="block text-sm font-medium text-stone-700 mb-1">Ciudad *</label>
                                <UInput
                                    v-model="address.ciudad"
                                    placeholder="Guadalajara"
                                    :ui="inputUI"
                                    :class="{ 'ring-1 ring-red-500': errors.ciudad }"
                                />
                                <p v-if="errors.ciudad" class="text-xs text-red-500 mt-1">{{ errors.ciudad }}</p>
                            </div>

                            <!-- Estado -->
                            <div>
                                <label class="block text-sm font-medium text-stone-700 mb-1">Estado *</label>
                                <UInput
                                    v-model="address.estado"
                                    placeholder="Jalisco"
                                    :ui="inputUI"
                                    :class="{ 'ring-1 ring-red-500': errors.estado }"
                                />
                                <p v-if="errors.estado" class="text-xs text-red-500 mt-1">{{ errors.estado }}</p>
                            </div>

                            <!-- Código postal -->
                            <div>
                                <label class="block text-sm font-medium text-stone-700 mb-1">Código postal *</label>
                                <UInput
                                    v-model="address.cp"
                                    placeholder="44100"
                                    maxlength="5"
                                    :ui="inputUI"
                                    :class="{ 'ring-1 ring-red-500': errors.cp }"
                                />
                                <p v-if="errors.cp" class="text-xs text-red-500 mt-1">{{ errors.cp }}</p>
                            </div>

                            <!-- Teléfono de contacto -->
                            <div>
                                <label class="block text-sm font-medium text-stone-700 mb-1">Teléfono de contacto *</label>
                                <UInput
                                    v-model="address.telefono"
                                    placeholder="33 1234 5678"
                                    :ui="inputUI"
                                    :class="{ 'ring-1 ring-red-500': errors.telefono }"
                                />
                                <p v-if="errors.telefono" class="text-xs text-red-500 mt-1">{{ errors.telefono }}</p>
                            </div>
                        </div>
                    </div>

                    <!-- Nota de seguridad -->
                    <div class="flex items-start gap-3 text-sm text-stone-500 px-1">
                        <UIcon name="i-heroicons-lock-closed" class="w-4 h-4 mt-0.5 shrink-0 text-stone-400" />
                        <p>Tu información está protegida con cifrado SSL. No almacenamos datos de tarjetas.</p>
                    </div>
                </div>

                <!-- ══ COLUMNA DERECHA: Resumen del pedido ════════════════════ -->
                <div class="lg:col-span-5 space-y-4 lg:sticky lg:top-6">

                    <div class="bg-white border border-stone-200 p-6">
                        <h2 class="text-xl font-semibold text-stone-800 mb-5 flex items-center gap-2">
                            <UIcon name="i-heroicons-shopping-bag" class="w-5 h-5 text-red-600" />
                            Resumen del pedido
                            <span class="ml-auto text-sm font-normal text-stone-400">
                                {{ cartItems.length }} {{ cartItems.length === 1 ? 'producto' : 'productos' }}
                            </span>
                        </h2>

                        <!-- Lista de productos -->
                        <ul class="divide-y divide-stone-100 mb-5">
                            <li
                                v-for="item in cartItems"
                                :key="item.product_id"
                                class="flex gap-3 py-3"
                            >
                                <!-- Imagen thumbnail -->
                                <div class="w-14 h-14 bg-stone-100 border border-stone-200 shrink-0 overflow-hidden">
                                    <img
                                        v-if="item.image_url"
                                        :src="item.image_url"
                                        :alt="item.name"
                                        class="w-full h-full object-contain p-1"
                                    />
                                    <UIcon
                                        v-else
                                        name="i-heroicons-photo"
                                        class="w-full h-full text-stone-300 p-3"
                                    />
                                </div>

                                <!-- Info -->
                                <div class="flex-1 min-w-0">
                                    <p class="text-sm font-medium text-stone-800 truncate">
                                        {{ item.name }}
                                    </p>
                                    <p class="text-xs text-stone-400 mt-0.5">
                                        Cant. {{ item.quantity }} × {{ formatCurrency(itemUnitPrice(item)) }}
                                    </p>
                                </div>

                                <!-- Subtotal -->
                                <span class="text-sm font-semibold text-stone-800 shrink-0">
                                    {{ formatCurrency(itemUnitPrice(item) * item.quantity) }}
                                </span>
                            </li>
                        </ul>

                        <!-- Separador -->
                        <USeparator class="mb-4" />

                        <!-- Totales -->
                        <div class="space-y-2 text-sm">
                            <div class="flex justify-between text-stone-600">
                                <span>Subtotal</span>
                                <span>{{ formatCurrency(cartSubtotal) }}</span>
                            </div>
                            <div class="flex justify-between text-stone-600">
                                <span>Envío</span>
                                <span class="text-green-600 font-medium">Gratis</span>
                            </div>
                            <USeparator class="my-2" />
                            <div class="flex justify-between text-base font-bold text-stone-900">
                                <span>Total</span>
                                <span class="text-red-600">{{ formatCurrency(cartSubtotal) }}</span>
                            </div>
                        </div>

                        <!-- Botón de pago -->
                        <UButton
                            v-if="!stripeSecret"
                            class="w-full mt-6 bg-red-600 text-white hover:bg-red-700 justify-center font-semibold text-base py-3"
                            :loading="loading"
                            :disabled="loading"
                            @click="handleCheckout"
                        >
                            <UIcon v-if="!loading" name="i-heroicons-lock-closed" class="w-4 h-4 mr-2" />
                            {{ loading ? 'Procesando…' : 'Proceder al pago' }}
                        </UButton>

                        <!-- Stripe Payment Element — solo aparece cuando ya hay clientSecret -->
                        <div v-if="stripeSecret" class="mt-6">
                            <USeparator class="mb-4" />
                            <p class="text-sm font-medium text-stone-700 mb-4 flex items-center gap-2">
                                <UIcon name="i-heroicons-credit-card" class="w-4 h-4 text-red-600" />
                                Ingresa los datos de tu tarjeta
                            </p>
                            <StripePaymentForm
                                :client-secret="stripeSecret"
                                @success="navigateTo('/checkout/success')"
                                @error="globalError = $event"
                            />
                        </div>

                        <!-- Error global -->
                        <UAlert
                            v-if="globalError"
                            color="red"
                            variant="soft"
                            class="mt-4"
                            :description="globalError"
                            icon="i-heroicons-exclamation-triangle"
                        />
                    </div>

                    <!-- Métodos de pago aceptados -->
                    <div class="bg-white border border-stone-200 p-4">
                        <p class="text-xs text-stone-400 text-center mb-3 uppercase tracking-wider">Métodos de pago aceptados</p>
                        <div class="flex justify-center gap-3 flex-wrap">
                            <span
                                v-for="card in ['VISA', 'MC', 'AMEX', 'OXXO']"
                                :key="card"
                                class="text-xs font-bold text-stone-500 border border-stone-200 px-2 py-1"
                            >
                                {{ card }}
                            </span>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
definePageMeta({
    middleware: 'auth',
    layout: false,
})

const { formatCurrency } = useCurrency()
const cartStore = useCartStore()

// ─── Estado del formulario ───────────────────────────────────────────────────

const address = reactive({
    nombre:     '',
    calle:      '',
    numero_ext: '',
    numero_int: '',
    colonia:    '',
    ciudad:     '',
    estado:     '',
    cp:         '',
    telefono:   '',
})

const errors = reactive<Record<string, string>>({})
const loading = ref(false)
const globalError = ref('')

const { initPayment } = usePayment()
const stripeSecret = ref('')
const orderId = ref<string | null>(null)

// ─── UI compartido para inputs ───────────────────────────────────────────────

const inputUI = {
    base: 'bg-white text-stone-900 border border-stone-300 focus:border-red-500 focus:ring-red-500',
}

// ─── Datos del carrito ───────────────────────────────────────────────────────

const cartItems = computed(() => cartStore.items ?? [])

const cartSubtotal = computed(() =>
    cartItems.value.reduce((sum, item) => sum + itemUnitPrice(item) * item.quantity, 0)
)

function itemUnitPrice(item: any): number {
    return item.precio_descuento ?? item.price ?? 0
}

// ─── Validación ──────────────────────────────────────────────────────────────

function validate(): boolean {
    // Limpiar errores anteriores
    Object.keys(errors).forEach(k => delete errors[k])

    const required: Array<[keyof typeof address, string]> = [
        ['nombre',     'El nombre es requerido'],
        ['calle',      'La calle es requerida'],
        ['numero_ext', 'El número exterior es requerido'],
        ['colonia',    'La colonia es requerida'],
        ['ciudad',     'La ciudad es requerida'],
        ['estado',     'El estado es requerido'],
        ['cp',         'El código postal es requerido'],
        ['telefono',   'El teléfono es requerido'],
    ]

    for (const [field, message] of required) {
        if (!address[field]?.trim()) {
            errors[field] = message
        }
    }

    if (address.cp && !/^\d{5}$/.test(address.cp)) {
        errors.cp = 'El CP debe tener 5 dígitos'
    }

    return Object.keys(errors).length === 0
}

// ─── Flujo de checkout ───────────────────────────────────────────────────────

async function handleCheckout() {
    globalError.value = ''

    if (!validate()) {
        await nextTick()
        const firstError = document.querySelector('.ring-red-500')
        firstError?.scrollIntoView({ behavior: 'smooth', block: 'center' })
        return
    }

    loading.value = true

    try {
        // 1. Preparar items
        const items = cartItems.value.map(item => ({
            product_id: item.product_id,
            name:       item.name ?? item.productos?.nombre ?? 'Producto',
            quantity:   item.quantity,
            unit_price: itemUnitPrice(item),
        }))

        // 2. Crear orden en Supabase
        const orderResult = await $fetch<{ order_id: number; total: number }>(
            '/api/checkout/create-order',
            {
                method:      'POST',
                credentials: 'include',
                body:        { items, address },
            }
        )

        orderId.value = orderResult.order_id

        // 3. Iniciar pago según proveedor activo
        const result = await initPayment(
            String(orderResult.order_id),
            orderResult.total,
            items,
        )

        if (result.type === 'redirect') {
            // Mercado Pago → salir del SPA
            await navigateTo(result.url, { external: true })
        } else {
            // Stripe → mostrar Payment Element en la misma página
            stripeSecret.value = result.clientSecret
            loading.value = false
        }

    } catch (err: any) {
        globalError.value = err?.data?.statusMessage
            ?? err?.message
            ?? 'Ocurrió un error. Por favor intenta de nuevo.'
        loading.value = false
    }
}
</script>
