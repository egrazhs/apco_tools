<template>
  <UApp>
    <NuxtPage />
  </UApp>
</template>

<script setup>
  const cart = useCartStore()

  onMounted(() => {
    cart.loadFromLocalStorage()
  })
</script>