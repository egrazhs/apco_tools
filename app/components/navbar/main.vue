<template>
  <header class="sticky top-0 z-50 bg-white border-b shadow-sm">
    <div class="max-w-7xl mx-auto px-4">
      <div class="flex items-center justify-between h-16">
        <NuxtLink to="/" class="text-xl font-bold">ApcoTools</NuxtLink>
        <nav class="hidden md:flex gap-6">
          <NuxtLink to="/productos" class="hover:text-primary">Productos</NuxtLink>
          <NuxtLink to="/cart" class="hover:text-primary">Carrito</NuxtLink>
        </nav>
        <!-- Solo el badge trigger, sin el slideover -->
        <CartBadge @click="useCartStore().openMiniCart()" />
      </div>
    </div>
  </header>
</template>


<script setup>
</script>
