<template>
    <UButton
        v-if="isValidLink"
        :to="link"
        target="_blank"
        rel="noopener noreferrer"
        size="lg"
        class="bg-[#009ee3] hover:bg-[#007eb5] text-white font-semibold gap-2"
    >
        <img
            src="/img/mercadopago/MP_RGB_HANDSHAKE_pluma_vertical.svg"
            alt="Mercado Pago"
            class="w-5 h-5"
        />
        Comprar en Mercado Pago
    </UButton>
</template>

<script setup lang="ts">
const props = defineProps<{
    link?: string | null
}>()

const isValidLink = computed(() =>
    typeof props.link === 'string' && props.link.trim() !== ''
)
</script>