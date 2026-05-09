<template>
    <div>
        <div id="stripe-payment-element" class="mb-6" />
        <UButton
            block
            color="red"
            size="xl"
            :loading="loading"
            :disabled="!ready || loading"
            @click="handlePay"
        >
            {{ loading ? 'Procesando...' : 'Pagar ahora' }}
        </UButton>
        <p v-if="errorMsg" class="mt-3 text-sm text-red-600">{{ errorMsg }}</p>
    </div>
</template>

<script setup lang="ts">
const props = defineProps<{
    clientSecret: string
}>()

const emit = defineEmits<{
    (e: 'success'): void
    (e: 'error', msg: string): void
}>()

const config   = useRuntimeConfig()
const loading  = ref(false)
const ready    = ref(false)
const errorMsg = ref('')

let stripe:   any = null
let elements: any = null

onMounted(async () => {
    // Import dinámico — solo carga en el cliente, evita errores de SSR
    const { loadStripe } = await import('@stripe/stripe-js')

    stripe = await loadStripe(config.public.stripePublicKey)
    if (!stripe) return

    elements = stripe.elements({
        clientSecret: props.clientSecret,
        appearance: { theme: 'stripe' },
    })

    const paymentEl = elements.create('payment')
    paymentEl.mount('#stripe-payment-element')
    paymentEl.on('ready', () => (ready.value = true))
})

async function handlePay() {
    if (!stripe || !elements) return

    loading.value  = true
    errorMsg.value = ''

    const { error } = await stripe.confirmPayment({
        elements,
        confirmParams: {
            return_url: `${config.public.siteUrl}/checkout/success`,
        },
    })

    if (error) {
        errorMsg.value = error.message ?? 'Error al procesar el pago'
        emit('error', errorMsg.value)
        loading.value = false
    }
}
</script>