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
        <CartBadge />
      </div>
    </div>
  </header>
</template>


<script setup lang="ts">
</script>
