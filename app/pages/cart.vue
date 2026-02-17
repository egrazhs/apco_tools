<template>
  <div class="max-w-7xl mx-auto px-4 py-8">
    <!-- Header -->
    <div class="mb-8">
      <h1 class="text-3xl font-bold">Carrito de compras</h1>
      <p class="text-gray-500 mt-1">{{ cart.totalItems }} productos</p>
    </div>

    <!-- Estado vacío -->
    <div v-if="cart.isLoaded && cart.items.length === 0" class="text-center py-20">
      <div class="mb-6 text-gray-400 text-6xl">🛒</div>
      <h2 class="text-xl font-semibold mb-2">Tu carrito está vacío</h2>
      <p class="text-gray-500 mb-6">Explora nuestros productos y encuentra lo que necesitas</p>
      <UButton to="/productos" size="lg">Ver productos</UButton>
    </div>



    <!-- Contenido carrito -->
    <div v-else-if="cart.isLoaded" class="grid grid-cols-1 lg:grid-cols-3 gap-8">

      <!-- Lista de productos -->
      <div class="lg:col-span-2 space-y-6">

        <div v-for="item in cart.items" :key="item.id" class="flex flex-col md:flex-row gap-6 border rounded-xl p-6">
          <!-- Imagen -->
          <img :src="item.imagen_principal" :alt="item.nombre" class="w-32 h-32 object-cover rounded-lg"/>

          <!-- Info -->
          <div class="flex-1 space-y-3">
            <NuxtLink :to="`/productos/${item.slug}`" class="text-lg font-semibold hover:underline">{{ item.nombre }}</NuxtLink>

            <p class="text-gray-500 text-sm">Marca: {{ item.marca }}</p>

            <p class="text-xl font-bold">${{ item.precio_venta.toFixed(2) }}</p>

            <!-- Cantidad -->
            <div class="flex items-center gap-4">
              <UInput
                type="number"
                :model-value="item.cantidad"
                @update:model-value="val => cart.updateQuantity(item.id, Number(val))"
                min="1"
                :max="item.stock"
                class="w-24"
              />

              <UButton
                color="red"
                variant="ghost"
                @click="cart.removeItem(item.id)"
              >
                Eliminar
              </UButton>
            </div>
          </div>

          <!-- Subtotal -->
          <div class="text-right">
            <p class="text-gray-500 text-sm">
              Subtotal
            </p>
            <p class="text-xl font-bold">
              ${{ (item.precio_venta * item.cantidad).toFixed(2) }}
            </p>
          </div>

        </div>

      </div>

      <!-- Resumen -->
      <div class="border rounded-xl p-6 h-fit sticky top-24 space-y-4">

        <h2 class="text-xl font-semibold mb-4">Resumen de compra</h2>

        <div class="flex justify-between">
          <span>Subtotal</span>
          <span>${{ cart.subtotal.toFixed(2) }}</span>
        </div>

        <div class="flex justify-between">
          <span>Impuestos (16%)</span>
          <span>${{ cart.tax.toFixed(2) }}</span>
        </div>

        <div class="border-t pt-4 flex justify-between text-lg font-bold">
          <span>Total</span>
          <span>${{ cart.total.toFixed(2) }}</span>
        </div>

        <UButton block size="lg" class="mt-4">Proceder al pago</UButton>

        <UButton to="/productos" variant="ghost" block>Seguir comprando</UButton>
      </div>
    </div>

    <!--Cargando Carrito-->
    <div v-else class="py-20 text-center">Cargando carrito...</div>

  </div>
</template>

<script setup lang="ts">
	import { useCartStore } from '~/stores/cart'

	const cart = useCartStore()

	onMounted(() => {
  		cart.loadFromLocalStorage()
	})

</script>
