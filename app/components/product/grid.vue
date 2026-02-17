<template>
	<div class="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
		<ProductCard
			v-for="product in products"
			:key="product.id"
			:product="product"
			class="flex flex-col justify-between"
		/>
	</div>
</template>

<script setup>
	defineProps({
		products:{
			type: Array,
			required: true
		}
	})
</script>