<template>
  <UCard class="flex flex-col justify-between h-full">

    <template #header>
      <img v-if="product.imagen_principal" :src="product.imagen_principal" class="w-full h-48 object-cover rounded-md"/>
    </template>

    <div class="space-y-2">
      <h3 class="font-semibold text-lg">{{ product.nombre }}</h3>

      <p class="text-sm text-gray-500">{{ product.descripcion_corta }}</p>

      <!-- Precio -->
      <div class="flex items-center gap-2">
        <span v-if="product.precioOferta" class="text-gray-400 line-through text-sm">${{ product.precio }}</span>

        <span class="text-lg font-bold text-primary"> ${{ product.precioOferta || product.precio_venta }}</span>
      </div>

      <!-- Stock -->
      <p v-if="product.stock === 0" class="text-sm text-red-500">Sin stock</p>
    </div>

    <div class="mt-4 space-y-2">
      <UButton block :to="`/productos/${product.slug}`" variant="outline">Ver detalles</UButton>

      <UButton block :disabled="product.stock === 0">Agregar al carrito</UButton>
    </div>

  </UCard>
</template>


<script setup>
	defineProps({
		product: {
			type: Object,
			required: true
		}
	})
</script>
