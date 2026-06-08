<template>
    <div class="min-h-screen bg-stone-50 flex items-center justify-center px-4">
        <div class="bg-white border border-stone-200 p-8 md:p-12 max-w-lg w-full text-center">

            <!-- Estado: cargando -->
            <div v-if="loading" class="py-8">
                <UIcon name="i-heroicons-arrow-path" class="w-12 h-12 text-stone-400 animate-spin mx-auto mb-4" />
                <p class="text-stone-500">Confirmando tu pago…</p>
            </div>

            <!-- Estado: éxito -->
            <template v-else-if="!error">
                <!-- Ícono -->
                <div class="w-20 h-20 bg-green-50 border-2 border-green-500 flex items-center justify-center mx-auto mb-6">
                    <UIcon name="i-heroicons-check" class="w-10 h-10 text-green-500" />
                </div>

                <h1 class="text-2xl md:text-3xl font-bold text-stone-900 mb-2">
                    ¡Pago recibido!
                </h1>

                <p class="text-stone-500 mb-6">
                    Tu pedido ha sido confirmado. Recibirás una notificación cuando esté en camino.
                </p>

                <!-- Número de orden -->
                <div class="bg-stone-50 border border-stone-200 p-4 mb-8">
                    <p class="text-xs uppercase tracking-widest text-stone-400 mb-1">Número de orden</p>
                    <p class="text-2xl font-bold text-stone-800 font-mono">#{{ orderId }}</p>
                    <p v-if="isPending" class="text-xs text-amber-600 mt-2">
                        ⏳ Pago en revisión. Te avisaremos cuando se confirme.
                    </p>
                </div>

                <!-- Acciones -->
                <div class="flex flex-col sm:flex-row gap-3">
                    <UButton
                        to="/mi_cuenta"
                        class="flex-1 justify-center bg-red-600 text-white hover:bg-red-700"
                    >
                        Ver mis pedidos
                    </UButton>
                    <UButton
                        to="/productos"
                        variant="outline"
                        color="gray"
                        class="flex-1 justify-center"
                    >
                        Seguir comprando
                    </UButton>
                </div>
            </template>

            <!-- Estado: error -->
            <template v-else>
                <div class="w-20 h-20 bg-red-50 border-2 border-red-400 flex items-center justify-center mx-auto mb-6">
                    <UIcon name="i-heroicons-exclamation-triangle" class="w-10 h-10 text-red-500" />
                </div>
                <h1 class="text-2xl font-bold text-stone-900 mb-2">Algo salió mal</h1>
                <p class="text-stone-500 mb-6">{{ error }}</p>
                <UButton to="/checkout" class="bg-red-600 text-white hover:bg-red-700">
                    Volver al checkout
                </UButton>
            </template>

        </div>
    </div>
</template>

<script setup lang="ts">
definePageMeta({
    middleware: 'auth',
    layout: false,
})

const route     = useRoute()
const supabase  = useSupabaseClient()

const loading   = ref(true)
const error     = ref('')
const orderId   = ref('')
const isPending = ref(false)

onMounted(async () => {
    try {
        let order: any = null

        // ── Stripe → viene con payment_intent en la URL ───────────────────────
        const paymentIntent = route.query.payment_intent as string
        if (paymentIntent) {
            isPending.value = route.query.redirect_status !== 'succeeded'

            for (let i = 0; i < 3; i++) {
                const { data } = await supabase
                    .from('orders')
                    .select('id')
                    .eq('external_payment_id', paymentIntent)
                    .single()

                if (data) { order = data; break }
                await new Promise(r => setTimeout(r, 1500))
            }
        }

        // ── Mercado Pago → viene con external_reference en la URL ────────────
        const externalReference = route.query.external_reference as string
        if (externalReference) {
            isPending.value = route.query.collection_status === 'in_process'

            // Verificar y actualizar el pago directamente con MP
            const result = await $fetch<{ status: string }>(
                '/api/payments/mp/verify-payment',
                { method: 'POST', body: { order_id: externalReference } }
            )

            if (result.status === 'approved') {
                isPending.value = false
            } else if (result.status === 'pending' || result.status === 'in_process') {
                isPending.value = true
            }

            const { data } = await supabase
                .from('orders')
                .select('id')
                .eq('id', externalReference)
                .single()

            order = data
        }

        if (!order) {
            error.value = 'No se encontró información del pedido.'
            return
        }

        orderId.value = order.id

        // Descontar stock si el pago fue confirmado
        if (!isPending.value) {
            const { error: stockError } = await supabase
                .rpc('deduct_stock_from_order', { p_order_id: order.id })
            if (stockError) console.error('Error al descontar stock:', stockError)
        }

        // Limpiar carrito
        const { clearCart } = useSupabaseCart()
        await clearCart()

    } catch (err: any) {
        console.error('Error al confirmar orden:', err)
        error.value = 'Ocurrió un error al confirmar tu pedido.'
    } finally {
        loading.value = false
    }
})
</script>
