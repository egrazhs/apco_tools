<template>
    <UButton
        v-if="isValidLink"
        :to="link"
        target="_blank"
        rel="noopener noreferrer"
        size="lg"
        class="bg-[#000000] hover:bg-[#e47911] text-white font-semibold gap-2"
    >
        <img
            src="/img/amazon.png"
            alt="Mercado Pago"
            class="w-5 h-5"
        />
        Comprar en Amazon
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