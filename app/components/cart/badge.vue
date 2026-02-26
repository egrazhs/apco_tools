<template>
	<div class="relative cursor-pointer hover:scale-105">
		<UIcon name="i-heroicons-shopping-cart" class="w-6 h-6 transition-transform duration-300" :class="{ 'animate-bounce-cart': isBouncing }"/>

		<!-- Badge -->
		<Transition name="badge">
			<span v-if="cart.totalItems > 0" class="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">{{ cart.totalItems > 9 ? '9+' : cart.totalItems }}</span>
		</Transition>
	</div>
</template>

<script setup>
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
	.badge-enter-active,.badge-leave-active {
		transition: all 0.2s ease;
	}

	.badge-enter-from, .badge-leave-to {
		transform: scale(0);
		opacity: 0;
	}

	.badge-enter-to, .badge-leave-from {
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
