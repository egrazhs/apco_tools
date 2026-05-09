<template>
    <div class="min-h-screen bg-stone-50 flex items-center justify-center px-4">
        <div class="bg-white border border-stone-200 p-8 md:p-12 max-w-lg w-full text-center">

            <!-- Ícono -->
            <div class="w-20 h-20 bg-red-50 border-2 border-red-400 flex items-center justify-center mx-auto mb-6">
                <UIcon name="i-heroicons-x-mark" class="w-10 h-10 text-red-500" />
            </div>

            <h1 class="text-2xl md:text-3xl font-bold text-stone-900 mb-2">
                Pago no completado
            </h1>

            <p class="text-stone-500 mb-2">
                Tu pedido no fue procesado. Puedes intentarlo de nuevo sin perder los productos en tu carrito.
            </p>

            <!-- Número de orden (si existe) -->
            <div v-if="orderId" class="bg-stone-50 border border-stone-200 p-3 mb-6 inline-block">
                <p class="text-xs text-stone-400">Referencia de orden</p>
                <p class="font-mono font-bold text-stone-700">#{{ orderId }}</p>
            </div>

            <!-- Posibles razones -->
            <div class="text-left bg-amber-50 border border-amber-200 p-4 mb-8">
                <p class="text-sm font-semibold text-amber-800 mb-2">Posibles razones:</p>
                <ul class="text-sm text-amber-700 space-y-1 list-disc list-inside">
                    <li>El pago fue cancelado manualmente</li>
                    <li>Fondos insuficientes en la cuenta</li>
                    <li>Datos de tarjeta incorrectos</li>
                    <li>El banco rechazó la transacción</li>
                </ul>
            </div>

            <!-- Acciones -->
            <div class="flex flex-col sm:flex-row gap-3">
                <UButton
                    class="flex-1 justify-center bg-red-600 text-white hover:bg-red-700"
                    @click="retryCheckout"
                    :loading="retrying"
                >
                    Intentar de nuevo
                </UButton>
                <UButton
                    to="/productos"
                    variant="outline"
                    color="gray"
                    class="flex-1 justify-center"
                >
                    Volver a la tienda
                </UButton>
            </div>

            <!-- Contacto -->
            <p class="text-xs text-stone-400 mt-8">
                ¿Necesitas ayuda? Escríbenos a
                <a href="mailto:HerramientasAltaCalidad@hotmail.com" class="text-red-600 hover:underline">
                    HerramientasAltaCalidad@hotmail.com
                </a>
                o llámanos al
                <a href="tel:3324860054" class="text-red-600 hover:underline">(33) 2486 0054</a>.
            </p>

        </div>
    </div>
</template>

<script setup lang="ts">
definePageMeta({
    middleware: 'auth',
    layout: false,
})

const route    = useRoute()
const supabase = useSupabaseClient()
const retrying = ref(false)

const orderId = computed(() => route.query.order_id as string | undefined)

onMounted(async () => {
    // Marcar la orden como failed para trazabilidad
    if (orderId.value) {
        await supabase
            .from('orders')
            .update({ status: 'failed', updated_at: new Date().toISOString() })
            .eq('id', orderId.value)
    }
})

async function retryCheckout() {
    retrying.value = true

    if (orderId.value) {
        // Intentar reutilizar la orden existente creando una nueva sesión de pago
        try {
            // Resetear la orden a pending para poder reintentarla
            await supabase
                .from('orders')
                .update({ status: 'pending', updated_at: new Date().toISOString() })
                .eq('id', orderId.value)

            const result = await $fetch<{ redirect_url: string }>(
                '/api/checkout/create-payment',
                {
                    method: 'POST',
                    body: { order_id: Number(orderId.value) },
                }
            )

            window.location.href = result.redirect_url
            return
        } catch {
            // Si falla, enviar de vuelta al checkout normal
        }
    }

    // Fallback: volver al checkout desde cero
    retrying.value = false
    navigateTo('/checkout')
}
</script>
