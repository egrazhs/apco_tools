<template>
    <div class="max-w-5xl mx-auto px-4 py-10">

        <div v-if="pending">Cargando producto...</div>

        <UCard v-else-if="producto">
            <div class="grid md:grid-cols-2 gap-8">
                <img :src="producto.imagen_principal" class="w-full rounded-lg"/>

                <div>
                    <h1 class="text-3xl font-bold mb-4">{{ producto.nombre }}</h1>

                    <p class="mb-4">{{ producto.descripcion_larga }}</p>

                    <p class="text-2xl font-bold text-primary mb-6">${{ producto.precio_venta }}</p>

                    <UButton size="lg" class="cursor-pointer" :disabled="producto.stock === 0" @click="addToCart">{{ producto.stock === 0 ? 'Sin stock' : 'Agregar al carrito' }}</UButton>
                </div>
            </div>
        </UCard>

    </div>
</template>

<script setup lang="ts">
    import { useCartStore } from '~/stores/cart'

    const route = useRoute()
    const supabase = useSupabaseClient()
    const cart = useCartStore()
    const toast = useToast()

    const { data: producto, pending, error } = await useAsyncData(`producto-${route.params.slug}`,async () => {
        const { data, error } = await supabase.from('productos').select('*, marcas(nombre)').eq('slug', route.params.slug).single()

        if (error) {
            throw createError({ statusCode: 404, statusMessage: 'Producto no encontrado'})
        }

        return data
    })

    function addToCart() {
        if (!producto.value) return

        cart.addItem({
            id: producto.value.id,
            nombre: producto.value.nombre,
            slug: producto.value.slug,
            precio_venta: producto.value.precio_venta,
            imagen_principal: producto.value.imagen_principal,
            marca: producto.value.marcas?.nombre || '',
            stock: producto.value.stock
        })

        toast.add({
            title: 'Agregado al carrito 🛒',
            description: `${producto.value.nombre} - $${producto.value.precio_venta}`,
            action: {
                label: 'Ver carrito',
                onClick: () => navigateTo('/cart')
            }
        })
    }
</script>
