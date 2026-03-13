<template>
    <div class="min-h-screen bg-gray-950 text-white">

        <!-- BREADCRUMB -->
        <div class="border-b border-white/5 bg-gray-900/60 backdrop-blur-sm sticky top-0 z-10">
            <div class="mx-auto max-w-7xl px-4 py-3 sm:px-6 lg:px-8">
                <UBreadcrumb :links="breadcrumbs" />
            </div>
        </div>

        <!-- LOADING -->
        <div v-if="pending" class="flex items-center justify-center min-h-[60vh]">
            <div class="flex flex-col items-center gap-4 text-gray-400">
                <UIcon name="i-heroicons-arrow-path" class="w-8 h-8 animate-spin text-green-400" />
                <p class="text-sm">Cargando producto...</p>
            </div>
        </div>

        <!-- ERROR -->
        <div v-else-if="error" class="flex items-center justify-center min-h-[60vh]">
            <UCard class="max-w-md w-full text-center space-y-4">
                <UIcon name="i-heroicons-exclamation-triangle" class="w-12 h-12 text-red-400 mx-auto" />
                <p class="text-white font-semibold text-lg">Producto no encontrado</p>
                <UButton to="/productos" variant="soft" color="green">Ver todos los productos</UButton>
            </UCard>
        </div>

        <!-- CONTENIDO -->
        <div v-else-if="producto" class="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 space-y-16">

            <!-- SECCIÓN PRINCIPAL -->
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-10 xl:gap-16">

                <!-- Imagen -->
                <div class="space-y-4">
                    <div class="relative overflow-hidden rounded-2xl bg-gray-800/60 border border-white/5 aspect-[4/3] flex items-center justify-center">
                        <img
                            :src="producto.imagen_principal"
                            :alt="producto.nombre"
                            class="w-full h-full object-contain"
                        />
                        <div class="absolute top-4 left-4">
                            <UBadge v-if="producto.stock > 0" color="green" variant="soft" class="font-semibold">
                                En stock · {{ producto.stock }} disponibles
                            </UBadge>
                            <UBadge v-else color="red" variant="soft" class="font-semibold">
                                Agotado
                            </UBadge>
                        </div>
                    </div>
                </div>

                <!-- Info -->
                <div class="flex flex-col gap-5">

                    <!-- Marca + nombre -->
                    <div>
                        <p v-if="producto.marcas?.nombre" class="text-green-400 text-sm font-semibold tracking-widest uppercase mb-1">
                            {{ producto.marcas.nombre }}
                        </p>
                        <h1 class="text-3xl xl:text-4xl font-bold text-white leading-tight">
                            {{ producto.nombre }}
                        </h1>
                        <p v-if="producto.slug" class="text-gray-500 text-xs mt-1">
                            SKU: {{ producto.slug }}
                        </p>
                    </div>

                    <!-- Precio -->
                    <div class="flex items-end gap-3">
                        <span class="text-4xl font-extrabold text-green-400 tracking-tight">
                            ${{ producto.precio_venta?.toLocaleString('es-MX') }}
                        </span>
                        <span
                            v-if="producto.precio_comparacion && producto.precio_comparacion > producto.precio_venta"
                            class="text-xl text-gray-500 line-through mb-1"
                        >
                            ${{ producto.precio_comparacion.toLocaleString('es-MX') }}
                        </span>
                        <UBadge
                            v-if="descuentoPorcentaje"
                            color="orange"
                            variant="soft"
                            class="mb-1 text-sm font-bold"
                        >
                            -{{ descuentoPorcentaje }}%
                        </UBadge>
                    </div>

                    <USeparator />

                    <!-- Descripción corta -->
                    <p class="text-gray-300 leading-relaxed line-clamp-4">
                        {{ producto.descripcion_larga }}
                    </p>

                    <!-- Cantidad + CTA -->
                    <div class="space-y-3">
                        <p class="text-sm text-gray-400 font-medium">Cantidad</p>
                        <div class="flex items-center gap-3">

                            <!-- Selector cantidad -->
                            <div class="flex items-center rounded-xl border border-white/10 bg-gray-800 overflow-hidden select-none">
                                <button
                                    @click="decrementar"
                                    :disabled="cantidad <= 1"
                                    class="px-4 py-2.5 text-gray-300 hover:bg-white/10 hover:text-white transition-colors text-lg font-bold disabled:opacity-30 disabled:cursor-not-allowed"
                                >−</button>
                                <span class="px-5 py-2.5 text-white font-semibold text-base min-w-[3rem] text-center">
                                    {{ cantidad }}
                                </span>
                                <button
                                    @click="incrementar"
                                    :disabled="cantidad >= producto.stock"
                                    class="px-4 py-2.5 text-gray-300 hover:bg-white/10 hover:text-white transition-colors text-lg font-bold disabled:opacity-30 disabled:cursor-not-allowed"
                                >+</button>
                            </div>

                            <!-- Botón agregar -->
                            <UButton
                                @click="addToCart"
                                color="green"
                                size="lg"
                                class="flex-1 justify-center font-bold tracking-wide cursor-pointer"
                                :disabled="producto.stock === 0"
                                icon="i-heroicons-shopping-cart"
                            >
                                {{ producto.stock === 0 ? 'Sin stock' : 'Agregar al carrito' }}
                            </UButton>
                        </div>

                        <!-- Cotización -->
                        <UButton
                            to="/cotizacion"
                            variant="ghost"
                            color="gray"
                            size="lg"
                            class="w-full justify-center border border-white/10 hover:border-white/20 font-medium"
                            icon="i-heroicons-document-text"
                        >
                            Solicitar cotización
                        </UButton>
                    </div>

                    <!-- Beneficios -->
                    <div class="grid grid-cols-2 gap-3 pt-1">
                        <div
                            v-for="item in beneficios"
                            :key="item.text"
                            class="flex items-center gap-2 rounded-xl bg-gray-800/50 border border-white/5 px-3 py-2.5"
                        >
                            <UIcon :name="item.icon" class="text-green-400 flex-shrink-0 w-4 h-4" />
                            <span class="text-xs text-gray-300 leading-snug">{{ item.text }}</span>
                        </div>
                    </div>
                </div>
            </div>

            <!-- TABS: DESCRIPCIÓN / ESPECIFICACIONES / ENVÍO -->
            <UTabs :items="tabItems" class="w-full">
                <template #descripcion>
                    <div class="py-6 max-w-3xl">
                        <p class="text-gray-300 leading-relaxed text-base">
                            {{ producto.descripcion_larga ?? 'Sin descripción detallada.' }}
                        </p>
                    </div>
                </template>

                <template #especificaciones>
                    <div class="py-6 max-w-2xl">
                        <div v-if="producto.especificaciones && Object.keys(producto.especificaciones).length" class="divide-y divide-white/5 rounded-xl overflow-hidden border border-white/5">
                            <div
                                v-for="(valor, clave) in producto.especificaciones"
                                :key="clave"
                                class="grid grid-cols-2 bg-gray-800/40 hover:bg-gray-800/70 transition-colors"
                            >
                                <span class="px-5 py-3 text-sm text-gray-400 font-medium capitalize">{{ clave }}</span>
                                <span class="px-5 py-3 text-sm text-white">{{ valor }}</span>
                            </div>
                        </div>
                        <p v-else class="text-gray-500 text-sm">No hay especificaciones registradas.</p>
                    </div>
                </template>

                <template #envio>
                    <div class="py-6 max-w-2xl space-y-3">
                        <div v-for="item in opcionesEnvio" :key="item.titulo" class="flex items-start gap-3 rounded-xl bg-gray-800/40 border border-white/5 p-4">
                            <UIcon :name="item.icon" class="text-green-400 mt-0.5 w-5 h-5 flex-shrink-0" />
                            <div>
                                <p class="text-white font-semibold text-sm">{{ item.titulo }}</p>
                                <p class="text-gray-400 text-sm">{{ item.desc }}</p>
                            </div>
                        </div>
                    </div>
                </template>
            </UTabs>

            <!-- PRODUCTOS RELACIONADOS -->
            <section v-if="relacionados?.length">
                <div class="flex items-center justify-between mb-6">
                    <h2 class="text-xl font-bold text-white">Productos relacionados</h2>
                    <UButton variant="ghost" color="gray" to="/productos" trailing-icon="i-heroicons-arrow-right" size="sm">
                        Ver todos
                    </UButton>
                </div>
                <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    <NuxtLink
                        v-for="rel in relacionados"
                        :key="rel.id"
                        :to="`/productos/${rel.slug}`"
                        class="group rounded-2xl bg-gray-800/50 border border-white/5 hover:border-green-400/30 hover:bg-gray-800 transition-all duration-200 overflow-hidden"
                    >
                        <div class="aspect-square overflow-hidden bg-gray-700/50">
                            <img
                                :src="rel.imagen_principal"
                                :alt="rel.nombre"
                                class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                        </div>
                        <div class="p-4 space-y-1">
                            <p class="text-xs text-gray-500">{{ rel.marcas?.nombre }}</p>
                            <p class="text-white text-sm font-medium line-clamp-2 group-hover:text-green-400 transition-colors">
                                {{ rel.nombre }}
                            </p>
                            <p class="text-green-400 font-bold">${{ rel.precio_venta?.toLocaleString('es-MX') }}</p>
                        </div>
                    </NuxtLink>
                </div>
            </section>

        </div>
    </div>
</template>

<script setup lang="ts">
    import { useCartStore } from '~/stores/cart'

    const route = useRoute()
    const supabase = useSupabaseClient()
    const cart = useCartStore()
    const toast = useToast()

    // ── Fetch producto principal ──────────────────────────────────────
    const { data: producto, pending, error } = await useAsyncData(
        `producto-${route.params.slug}`,
        async () => {
            const { data, error } = await supabase
                .from('productos')
                .select('*, marcas(nombre)')
                .eq('slug', route.params.slug)
                .single()
            if (error) throw createError({ statusCode: 404, statusMessage: 'Producto no encontrado' })
            return data
        }
    )

    // ── Fetch relacionados (misma marca, excluye el actual) ───────────
    const { data: relacionados } = await useAsyncData(
        `relacionados-${route.params.slug}`,
        async () => {
            const idMarca = producto.value?.id_marca
            if (!idMarca) return []
            const { data } = await supabase
                .from('productos')
                .select('id, nombre, slug, precio_venta, imagen_principal, marcas(nombre)')
                .eq('id_marca', idMarca)
                .neq('slug', route.params.slug)
                .limit(4)
            return data ?? []
        }
    )

    // ── Cantidad ──────────────────────────────────────────────────────
    const cantidad = ref(1)
    const incrementar = () => { if (cantidad.value < (producto.value?.stock ?? 1)) cantidad.value++ }
    const decrementar = () => { if (cantidad.value > 1) cantidad.value-- }

    // ── Descuento calculado ───────────────────────────────────────────
    const descuentoPorcentaje = computed(() => {
        const p = producto.value
        if (!p?.precio_comparacion || p.precio_comparacion <= p.precio_venta) return null
        return Math.round((1 - p.precio_venta / p.precio_comparacion) * 100)
    })

    // ── Breadcrumbs ───────────────────────────────────────────────────
    const breadcrumbs = computed(() => [
        { label: 'Inicio', to: '/' },
        { label: 'Productos', to: '/productos' },
        { label: producto.value?.nombre ?? (route.params.slug as string) },
    ])

    // ── Agregar al carrito ────────────────────────────────────────────
    function addToCart() {
        if (!producto.value) return
        cart.addItem({
            id: producto.value.id,
            nombre: producto.value.nombre,
            slug: producto.value.slug,
            precio_venta: producto.value.precio_venta,
            imagen_principal: producto.value.imagen_principal,
            marca: producto.value.marcas?.nombre || '',
            stock: producto.value.stock,
        })
        toast.add({
            title: 'Agregado al carrito 🛒',
            description: `${producto.value.nombre} — $${producto.value.precio_venta}`,
            icon: 'i-heroicons-shopping-cart',
            color: 'green',
            action: {
                label: 'Ver carrito',
                onClick: () => navigateTo('/cart'),
            },
        })
    }

    // ── Estáticos ─────────────────────────────────────────────────────
    const tabItems = [
        { label: 'Descripción', slot: 'descripcion' },
        { label: 'Especificaciones', slot: 'especificaciones' },
        { label: 'Envío', slot: 'envio' },
    ]

    const beneficios = [
        { icon: 'i-heroicons-truck', text: 'Envío a todo México' },
        { icon: 'i-heroicons-shield-check', text: 'Garantía incluida' },
        { icon: 'i-heroicons-arrow-path', text: 'Devoluciones fáciles' },
        { icon: 'i-heroicons-lock-closed', text: 'Pago seguro' },
    ]

    const opcionesEnvio = [
        {
            icon: 'i-heroicons-truck',
            titulo: 'Envío estándar',
            desc: '3–5 días hábiles a todo México. Costo calculado al finalizar compra.',
        },
        {
            icon: 'i-heroicons-map-pin',
            titulo: 'Recoger en tienda',
            desc: 'Disponible sin costo. Listo en 24 horas hábiles.',
        },
    ]
</script>