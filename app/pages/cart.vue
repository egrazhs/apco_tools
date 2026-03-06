<template>
  <div class="max-w-7xl mx-auto px-4 py-8">
    <!-- Header -->
    <div class="mb-8">
      <h1 class="text-3xl font-bold">Carrito de compras</h1>
    </div>

    <ClientOnly>
      <!-- Todo lo que depende del estado del carrito va aquí -->
      <p class="text-gray-500 mt-1">{{ cart.totalItems }} productos</p>

      <!-- Estado vacío -->
      <div v-if="cart.items.length === 0" class="text-center py-20">
        <div class="mb-6 text-gray-400 text-6xl">🛒</div>
        <h2 class="text-xl font-semibold mb-2">Tu carrito está vacío</h2>
        <p class="text-gray-500 mb-6">Explora nuestros productos y encuentra lo que necesitas</p>
        <UButton to="/productos" size="lg">Ver productos</UButton>
      </div>

      <!-- Contenido carrito -->
      <div v-else class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Lista de productos -->
        <div class="lg:col-span-2 space-y-6">
          <div v-for="item in cart.items" :key="item.id" class="flex flex-col md:flex-row gap-6 border rounded-xl p-6">
            <img :src="item.imagen_principal" :alt="item.nombre" class="w-32 h-32 object-cover rounded-lg"/>
            <div class="flex-1 space-y-3">
              <NuxtLink :to="`/productos/${item.slug}`" class="text-lg font-semibold hover:underline">{{ item.nombre }}</NuxtLink>
              <p class="text-gray-500 text-sm">Marca: {{ item.marca }}</p>
              <p class="text-xl font-bold">{{ formatCurrency(item.precio_venta) }}</p>
              <div class="flex items-center gap-4">
                <UInput 
                  type="number" 
                  :model-value="item.cantidad" 
                  @update:model-value="val => cart.updateQuantity(item.id, Number(val))" 
                  min="1" 
                  :max="item.stock" 
                  class="w-24"
                />
                <UButton color="red" variant="ghost" @click="cart.removeItem(item.id)">Eliminar</UButton>
              </div>
            </div>
            <div class="text-right">
              <p class="text-gray-500 text-sm">Subtotal</p>
              <p class="text-xl font-bold">{{ formatCurrency(item.precio_venta * item.cantidad) }}</p>
            </div>
          </div>
        </div>

        <!-- Resumen -->
        <div class="border rounded-xl p-6 h-fit sticky top-24 space-y-4">
          <h2 class="text-xl font-semibold mb-4">Resumen de compra</h2>
          <div class="flex justify-between">
            <span>Subtotal</span>
            <span>{{ formatCurrency(cart.subtotal) }}</span>
          </div>
          <div class="flex justify-between">
            <span>Impuestos (16%)</span>
            <span>{{ formatCurrency(cart.tax) }}</span>
          </div>
          <div class="border-t pt-4 flex justify-between text-lg font-bold">
            <span>Total</span>
            <span>{{ formatCurrency(cart.total) }}</span>
          </div>
          <UButton block size="lg" class="mt-4">Proceder al pago</UButton>
          <UButton to="/productos" variant="ghost" block>Seguir comprando</UButton>
        </div>
      </div>

      <!-- Skeleton mientras carga el estado del cliente -->
      <template #fallback>
        <div class="space-y-4">
          <USkeleton class="h-6 w-32" />
          <USkeleton class="h-32 w-full" />
          <USkeleton class="h-32 w-full" />
        </div>
      </template>
    </ClientOnly>
  </div>
</template>

<script setup lang="ts">
  const cart = useCartStore()
  const { formatCurrency } = useCurrency()
</script>