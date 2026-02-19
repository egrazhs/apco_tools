<template>
  <header class="sticky top-0 z-50 bg-white border-b shadow-sm">
    <div class="max-w-7xl mx-auto px-4">
      <div class="flex items-center justify-between h-16">

        <!-- Logo -->
        <NuxtLink to="/" class="text-xl font-bold">ApcoTools</NuxtLink>

        <!-- Navigation -->
        <nav class="hidden md:flex gap-6">
          <NuxtLink to="/productos" class="hover:text-primary">Productos</NuxtLink>

          <NuxtLink to="/cart" class="hover:text-primary">Carrito</NuxtLink>
        </nav>

        <!-- Cart Icon -->
        <NuxtLink to="/cart" class="relative">
         <UIcon name="i-heroicons-shopping-cart" class="w-6 h-6 transition-transform duration-300" :class="{ 'animate-bounce-cart': isBouncing }"/>

          <!-- Badge -->
          <Transition name="badge">
            <span v-if="cart.totalItems > 0" class="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">{{ cart.totalItems > 9 ? '9+' : cart.totalItems }}</span>
          </Transition>
        </NuxtLink>

      </div>
    </div>
  </header>
</template>


<script setup lang="ts">
	const cart = useCartStore()

  const isBouncing = ref(false)

  watch( () => cart.totalItems, (newVal, oldVal) => {
    if (newVal > oldVal) {
      triggerBounce()
    }
  })

  function triggerBounce() {
    isBouncing.value = true
    setTimeout(() => { isBouncing.value = false}, 300)
  }
</script>

<style scoped>
  .badge-enter-active,
  .badge-leave-active {
    transition: all 0.2s ease;
  }

  .badge-enter-from,
  .badge-leave-to {
    transform: scale(0);
    opacity: 0;
  }

  .badge-enter-to,
  .badge-leave-from {
    transform: scale(1);
    opacity: 1;
  }

  @keyframes cart-bounce {
    0%   { transform: scale(1); }
    30%  { transform: scale(1.25); }
    50%  { transform: scale(0.95); }
    70%  { transform: scale(1.1); }
    100% { transform: scale(1); }
  }

  .animate-bounce-cart {
    animation: cart-bounce 0.3s ease;
  }
</style>
