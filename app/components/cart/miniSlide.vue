<template>
	<USlideover side="right" title="cart" description="cart_minislide">
		<!-- Cart Icon -->
		<CartBadge />

		<template #content>
			<div class="p-6 flex flex-col h-full">
				<h2 class="text-lg font-bold mb-4">Carrito ({{ cart.totalItems }})</h2>

				<div class="flex-1 overflow-y-auto space-y-4">
					<div v-for="item in cart.items" :key="item.id" class="flex justify-between items-center border-b pb-2">
						<div>
							<p class="font-medium">{{ item.nombre }}</p>
							<p class="text-sm text-gray-500">{{ item.cantidad }} x {{ formatCurrency(item.precio_venta) }}</p>
						</div>

						<p class="font-semibold">{{ formatCurrency(item.precio_venta * item.cantidad) }}</p>
					</div>

					<p v-if="cart.items.length === 0" class="text-gray-500">Tu carrito está vacío</p>
				</div>

				<div class="border-t pt-4 mt-4">
					<div class="flex justify-between font-bold text-lg mb-4">
						<span>Subtotal</span>
						<span>{{ formatCurrency(cart.subtotal) }}</span>
					</div>

					<NuxtLink block to="/cart">Ir al carrito</NuxtLink>
				</div>
			</div>
		</template>
	</USlideover>
</template>

<script setup>
  const cart = useCartStore();
  const { formatCurrency } = useCurrency();
</script>