<template>
    <div
        class="group relative bg-white rounded-2xl overflow-hidden border border-stone-100
               shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col"
    >
        <!-- Imagen -->
        <div class="relative overflow-hidden bg-stone-100 aspect-square">
            <img
                v-if="product.imagen_principal"
                :src="product.imagen_principal"
                :alt="product.nombre"
                class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div v-else class="w-full h-full flex items-center justify-center text-stone-300">
                <UIcon name="i-heroicons-photo" class="text-5xl" />
            </div>

            <!-- Badge sin stock -->
            <div
                v-if="product.stock === 0"
                class="absolute inset-0 bg-white/70 backdrop-blur-sm flex items-center justify-center"
            >
                <span class="text-xs font-semibold tracking-[0.15em] uppercase text-stone-500 bg-white px-3 py-1.5 rounded-full border border-stone-200">
                    Sin stock
                </span>
            </div>

            <!-- Badge marca -->
            <div
                v-if="product.marcas?.nombre"
                class="absolute top-3 left-3 bg-white/90 backdrop-blur-sm text-stone-600
                       text-[10px] font-semibold tracking-wider uppercase px-2.5 py-1 rounded-full border border-stone-100"
            >
                {{ product.marcas.nombre }}
            </div>
        </div>

        <!-- Info -->
        <div class="flex flex-col flex-1 p-4 gap-3">
            <div class="flex-1 space-y-1">
                <h3 class="font-semibold text-stone-900 leading-snug line-clamp-2">
                    {{ product.nombre }}
                </h3>
                <p class="text-xs text-stone-400 line-clamp-2 leading-relaxed">
                    {{ product.descripcion_corta }}
                </p>
            </div>

            <!-- Precio -->
            <div class="flex items-baseline gap-2">
                <span class="text-xl font-black text-stone-900">
                    ${{ product.precioOferta || product.precio_venta }}
                </span>
                <span
                    v-if="product.precioOferta"
                    class="text-xs text-stone-400 line-through"
                >
                    ${{ product.precio }}
                </span>
                <UBadge
                    v-if="product.precioOferta"
                    color="amber"
                    variant="soft"
                    size="xs"
                    class="ml-auto"
                >
                    Oferta
                </UBadge>
            </div>

            <!-- Acciones -->
            <div class="flex flex-col gap-2 pt-1">
                <UButton
                    :to="`/productos/${product.slug}`"
                    variant="outline"
                    block
                    size="sm"
                    color="gray"
                    :ui="{ rounded: 'rounded-xl' }"
                >
                    Ver detalles
                </UButton>
                <UButton
                    block
                    size="sm"
                    :disabled="product.stock === 0"
                    color="amber"
                    :ui="{ rounded: 'rounded-xl', font: 'font-semibold' }"
                    icon="i-heroicons-shopping-cart"
                >
                    Agregar al carrito
                </UButton>
            </div>
        </div>
    </div>
</template>

<script setup>
    defineProps({
        product: {
            type: Object,
            required: true
        }
    })
</script>
