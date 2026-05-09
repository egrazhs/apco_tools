<template>
    <div class="min-h-screen bg-stone-50 bg-white">

        <!-- Page Header -->
        <div class="bg-white border-b border-stone-200">
            <div class="container mx-auto px-4 py-10">
                <p class="text-xs uppercase tracking-widest text-stone-400 mb-1 font-medium">
                    Portal del cliente
                </p>
                <h1 class="text-4xl md:text-5xl font-serif text-stone-900">Mi Cuenta</h1>
            </div>
        </div>

        <!-- Tab Content -->
        <div class="container mx-auto px-4 py-10">
            <UTabs
                :items="tabItems"
                :ui="{
                    list: 'bg-stone-100 border border-stone-200',
                    trigger: 'data-[state=active]:bg-white data-[state=active]:text-red-600 font-medium cursor-pointer',
                }"
            >

                <!-- ═══════════════════════════════════════════════
                     TAB 1 — PEDIDOS
                ════════════════════════════════════════════════ -->
                <template #pedidos>
                    <div class="pt-6">
                        <h2 class="text-2xl font-serif text-stone-800 mb-6">Historial de pedidos</h2>

                        <!-- Empty state -->
                        <div v-if="!orders || orders.length === 0"
                             class="bg-white border border-stone-200 p-16 text-center">
                            <UIcon name="i-heroicons-shopping-bag" class="w-12 h-12 text-stone-300 mx-auto mb-4" />
                            <p class="text-stone-500">Aún no tienes pedidos registrados.</p>
                        </div>

                        <!-- Orders list -->
                        <div v-else class="space-y-3">
                            <div
                                v-for="order in orders"
                                :key="order.id"
                                class="bg-white border border-stone-200 hover:border-red-300 transition-colors cursor-pointer"
                                @click="openOrderDetail(order)"
                            >
                                <div class="flex flex-col sm:flex-row sm:items-center justify-between px-5 py-4 gap-3">
                                    <div>
                                        <p class="text-xs text-stone-400 uppercase tracking-wider mb-0.5">
                                            Pedido #{{ shortId(order.id) }}
                                        </p>
                                        <p class="text-sm text-stone-600">
                                            {{ formatDate(order.created_at) }}
                                        </p>
                                    </div>
                                    <div class="flex items-center gap-4">
                                        <span
                                            class="text-xs font-semibold px-3 py-1 uppercase tracking-wide"
                                            :class="orderStatusConfig(order.payment_status).color"
                                        >
                                            {{ orderStatusConfig(order.payment_status).label }}
                                        </span>
                                        <p class="text-lg font-semibold text-stone-900 min-w-[90px] text-right">
                                            {{ formatCurrency(order.total) }}
                                        </p>
                                        <UIcon name="i-heroicons-chevron-right" class="w-4 h-4 text-stone-400" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- ── Order Detail Modal ── -->
                    <UModal v-model:open="orderDetailOpen" :ui="{ content: 'max-w-2xl' }">
                        <template #content>
                            <div v-if="selectedOrder" class="bg-white">
                                <div class="border-b border-stone-200 px-6 py-5 flex justify-between items-start">
                                    <div>
                                        <p class="text-xs text-stone-400 uppercase tracking-wider mb-1">Detalle del pedido</p>
                                        <h3 class="text-xl font-serif text-stone-900">#{{ shortId(selectedOrder.id) }}</h3>
                                        <p class="text-sm text-stone-500 mt-0.5">{{ formatDate(selectedOrder.created_at) }}</p>
                                    </div>
                                    <span
                                        class="text-xs font-semibold px-3 py-1 uppercase tracking-wide"
                                        :class="orderStatusConfig(selectedOrder.payment_status).color"
                                    >
                                        {{ orderStatusConfig(selectedOrder.payment_status).label }}
                                    </span>
                                </div>

                                <div class="px-6 py-5 space-y-6">
                                    <!-- Productos -->
                                    <div>
                                        <h4 class="text-xs uppercase tracking-widest text-stone-400 mb-3 font-semibold">Productos</h4>
                                        <div class="space-y-3">
                                            <div
                                                v-for="item in selectedOrder.order_items"
                                                :key="item.id"
                                                class="flex items-center gap-3"
                                            >
                                                <img
                                                    v-if="item.products?.imagen_url"
                                                    :src="item.products.imagen_url"
                                                    :alt="item.products.nombre"
                                                    class="w-12 h-12 object-cover border border-stone-100 shrink-0"
                                                />
                                                <div v-else class="w-12 h-12 bg-stone-100 shrink-0 flex items-center justify-center">
                                                    <UIcon name="i-heroicons-cube" class="w-5 h-5 text-stone-300" />
                                                </div>
                                                <div class="flex-1 min-w-0">
                                                    <p class="text-sm font-medium text-stone-800 truncate">
                                                        {{ item.products?.nombre ?? 'Producto' }}
                                                    </p>
                                                    <p class="text-xs text-stone-400">
                                                        {{ item.quantity }} × {{ formatCurrency(item.unit_price) }}
                                                        <template v-if="item.discount > 0">
                                                            · <span class="text-green-600">-{{ item.discount }}%</span>
                                                        </template>
                                                    </p>
                                                </div>
                                                <p class="text-sm font-semibold text-stone-900 shrink-0">
                                                    {{ formatCurrency(item.subtotal) }}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    <!-- Totales -->
                                    <div class="border-t border-stone-100 pt-4 space-y-1.5">
                                        <div class="flex justify-between text-sm text-stone-600">
                                            <span>Subtotal</span><span>{{ formatCurrency(selectedOrder.subtotal) }}</span>
                                        </div>
                                        <div class="flex justify-between text-sm text-stone-600">
                                            <span>Envío</span><span>{{ formatCurrency(selectedOrder.shipping_cost) }}</span>
                                        </div>
                                        <div class="flex justify-between text-sm text-stone-600">
                                            <span>IVA</span><span>{{ formatCurrency(selectedOrder.tax) }}</span>
                                        </div>
                                        <div class="flex justify-between text-base font-bold text-stone-900 pt-2 border-t border-stone-200">
                                            <span>Total</span><span>{{ formatCurrency(selectedOrder.total) }}</span>
                                        </div>
                                    </div>

                                    <!-- Dirección de envío -->
                                    <div v-if="selectedOrder.addresses" class="bg-stone-50 border border-stone-200 p-4">
                                        <h4 class="text-xs uppercase tracking-widest text-stone-400 mb-2 font-semibold">
                                            Dirección de envío
                                        </h4>
                                        <p class="text-sm text-stone-700 font-medium">
                                            {{ selectedOrder.addresses.recipient_name }}
                                        </p>
                                        <p class="text-sm text-stone-500">
                                            {{ selectedOrder.addresses.street }} {{ selectedOrder.addresses.ext_number }},
                                            {{ selectedOrder.addresses.neighborhood }},
                                            {{ selectedOrder.addresses.city }}, {{ selectedOrder.addresses.state }}
                                            CP {{ selectedOrder.addresses.zip_code }}
                                        </p>
                                    </div>
                                </div>

                                <div class="border-t border-stone-200 px-6 py-4 flex justify-end">
                                    <UButton
                                        class="bg-stone-800 text-white hover:bg-stone-700"
                                        @click="orderDetailOpen = false"
                                    >
                                        Cerrar
                                    </UButton>
                                </div>
                            </div>
                        </template>
                    </UModal>
                </template>

                <!-- ═══════════════════════════════════════════════
                     TAB 2 — DIRECCIONES
                ════════════════════════════════════════════════ -->
                <template #direcciones>
                    <div class="pt-6">
                        <div class="flex items-center justify-between mb-6">
                            <h2 class="text-2xl font-serif text-stone-800">Mis direcciones</h2>
                            <UButton class="bg-red-600 text-white hover:bg-red-700" @click="openAddAddress">
                                <UIcon name="i-heroicons-plus" class="w-4 h-4 mr-1" />
                                Agregar dirección
                            </UButton>
                        </div>

                        <!-- Empty state -->
                        <div v-if="!addresses || addresses.length === 0"
                             class="bg-white border border-stone-200 p-16 text-center">
                            <UIcon name="i-heroicons-map-pin" class="w-12 h-12 text-stone-300 mx-auto mb-4" />
                            <p class="text-stone-500 mb-4">No tienes direcciones guardadas.</p>
                            <UButton class="bg-red-600 text-white hover:bg-red-700" @click="openAddAddress">
                                Agregar mi primera dirección
                            </UButton>
                        </div>

                        <!-- Address cards -->
                        <TransitionGroup v-else name="address-list" tag="div" class="grid grid-cols-1 md:grid-cols-2 gap-4">

                            <div
                                v-for="addr in addresses"
                                :key="addr.id"
                                class="bg-white border p-5 relative"
                                :class="addr.is_default ? 'border-red-400 ring-1 ring-red-200' : 'border-stone-200'"
                            >
                                <div v-if="addr.is_default"
                                     class="absolute top-4 right-4 text-xs bg-red-600 text-white px-2 py-0.5 uppercase tracking-wide font-semibold">
                                    Predeterminada
                                </div>

                                <p class="text-xs uppercase tracking-widest text-stone-400 font-semibold mb-2">
                                    {{ addr.alias || 'Dirección' }}
                                </p>
                                <p class="text-sm font-semibold text-stone-800 mb-1">{{ addr.recipient_name }}</p>
                                <p class="text-sm text-stone-500 leading-relaxed">
                                    {{ addr.street }} {{ addr.ext_number }}
                                    <template v-if="addr.int_number">Int. {{ addr.int_number }}</template><br />
                                    {{ addr.neighborhood }}, {{ addr.city }}<br />
                                    {{ addr.state }} CP {{ addr.zip_code }}
                                </p>
                                <p v-if="addr.phone" class="text-sm text-stone-400 mt-1">Tel. {{ addr.phone }}</p>

                                <div class="flex gap-2 mt-4 pt-4 border-t border-stone-100">
                                    <UButton size="sm" color="gray" variant="outline" @click="openEditAddress(addr)">
                                        Editar
                                    </UButton>
                                    <UButton
                                        v-if="!addr.is_default"
                                        size="sm"
                                        color="gray"
                                        variant="ghost"
                                        @click="handleSetDefault(addr.id)"
                                    >
                                        Usar como predeterminada
                                    </UButton>
                                    <UButton
                                        size="sm"
                                        variant="ghost"
                                        class="text-red-500 hover:text-red-700 hover:bg-red-50 ml-auto"
                                        @click="handleRemoveAddress(addr.id)"
                                    >
                                        <UIcon name="i-heroicons-trash" class="w-4 h-4" />
                                    </UButton>
                                </div>
                            </div>
                        </TransitionGroup>
                    </div>

                    <!-- ── Address Modal ── -->
                    <UModal v-model:open="addressModalOpen" :ui="{ content: 'max-w-xl' }">
                        <template #content>
                            <div class="bg-white">
                                <div class="border-b border-stone-200 px-6 py-5">
                                    <h3 class="text-xl font-serif text-stone-900">
                                        {{ addressEditMode ? 'Editar dirección' : 'Nueva dirección' }}
                                    </h3>
                                </div>

                                <div class="px-6 py-5 space-y-4">
                                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div>
                                            <label class="block text-xs font-semibold uppercase tracking-wide text-stone-500 mb-1">
                                                Alias (ej. Casa, Oficina)
                                            </label>
                                            <UInput v-model="addressForm.alias" placeholder="Casa"
                                                :ui="{ base: 'bg-white text-stone-900' }" />
                                        </div>
                                        <div>
                                            <label class="block text-xs font-semibold uppercase tracking-wide text-stone-500 mb-1">
                                                Nombre del destinatario *
                                            </label>
                                            <UInput v-model="addressForm.recipient_name" placeholder="Juan Pérez"
                                                :ui="{ base: 'bg-white text-stone-900' }" />
                                        </div>
                                    </div>

                                    <div>
                                        <label class="block text-xs font-semibold uppercase tracking-wide text-stone-500 mb-1">
                                            Calle *
                                        </label>
                                        <UInput v-model="addressForm.street" placeholder="Av. La Paz"
                                            :ui="{ base: 'bg-white text-stone-900' }" />
                                    </div>

                                    <div class="grid grid-cols-2 gap-4">
                                        <div>
                                            <label class="block text-xs font-semibold uppercase tracking-wide text-stone-500 mb-1">
                                                Núm. exterior *
                                            </label>
                                            <UInput v-model="addressForm.ext_number" placeholder="1181"
                                                :ui="{ base: 'bg-white text-stone-900' }" />
                                        </div>
                                        <div>
                                            <label class="block text-xs font-semibold uppercase tracking-wide text-stone-500 mb-1">
                                                Núm. interior
                                            </label>
                                            <UInput v-model="addressForm.int_number" placeholder="Depto 3"
                                                :ui="{ base: 'bg-white text-stone-900' }" />
                                        </div>
                                    </div>

                                    <div class="grid grid-cols-2 gap-4">
                                        <div>
                                            <label class="block text-xs font-semibold uppercase tracking-wide text-stone-500 mb-1">
                                                Colonia *
                                            </label>
                                            <UInput v-model="addressForm.neighborhood" placeholder="Col. Centro"
                                                :ui="{ base: 'bg-white text-stone-900' }" />
                                        </div>
                                        <div>
                                            <label class="block text-xs font-semibold uppercase tracking-wide text-stone-500 mb-1">
                                                Código postal *
                                            </label>
                                            <UInput v-model="addressForm.zip_code" placeholder="44100"
                                                :ui="{ base: 'bg-white text-stone-900' }" />
                                        </div>
                                    </div>

                                    <div class="grid grid-cols-2 gap-4">
                                        <div>
                                            <label class="block text-xs font-semibold uppercase tracking-wide text-stone-500 mb-1">
                                                Ciudad *
                                            </label>
                                            <UInput v-model="addressForm.city" placeholder="Guadalajara"
                                                :ui="{ base: 'bg-white text-stone-900' }" />
                                        </div>
                                        <div>
                                            <label class="block text-xs font-semibold uppercase tracking-wide text-stone-500 mb-1">
                                                Estado *
                                            </label>
                                            <UInput v-model="addressForm.state" placeholder="Jalisco"
                                                :ui="{ base: 'bg-white text-stone-900' }" />
                                        </div>
                                    </div>

                                    <div>
                                        <label class="block text-xs font-semibold uppercase tracking-wide text-stone-500 mb-1">
                                            Teléfono de contacto
                                        </label>
                                        <UInput v-model="addressForm.phone" placeholder="33 1234 5678"
                                            :ui="{ base: 'bg-white text-stone-900' }" />
                                    </div>

                                    <div class="flex items-center gap-3 pt-1">
                                        <UCheckbox
                                            v-model="addressForm.is_default"
                                            label="Usar como dirección predeterminada"
                                        />
                                    </div>
                                </div>

                                <div class="border-t border-stone-200 px-6 py-4 flex justify-end gap-3">
                                    <UButton color="gray" variant="outline" @click="addressModalOpen = false">
                                        Cancelar
                                    </UButton>
                                    <UButton
                                        class="bg-red-600 text-white hover:bg-red-700"
                                        :loading="addressLoading"
                                        @click="handleSaveAddress"
                                    >
                                        {{ addressEditMode ? 'Guardar cambios' : 'Agregar dirección' }}
                                    </UButton>
                                </div>
                            </div>
                        </template>
                    </UModal>
                </template>

                <!-- ═══════════════════════════════════════════════
                     TAB 3 — PERFIL
                ════════════════════════════════════════════════ -->
                <template #perfil>
                    <div class="pt-6 max-w-lg">
                        <h2 class="text-2xl font-serif text-stone-800 mb-6">Mi perfil</h2>

                        <div class="bg-white border border-stone-200 p-6 mb-6">
                            <div class="flex items-center gap-5 mb-6 pb-6 border-b border-stone-100">
                                <div class="w-14 h-14 bg-stone-800 flex items-center justify-center shrink-0">
                                    <span class="text-white text-xl font-serif uppercase">{{ userInitial }}</span>
                                </div>
                                <div>
                                    <p class="text-xs uppercase tracking-widest text-stone-400 mb-0.5 font-semibold">
                                        Cliente APCO Tools
                                    </p>
                                    <p class="text-lg font-semibold text-stone-900">
                                        {{ user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Usuario' }}
                                    </p>
                                </div>
                            </div>

                            <div class="space-y-4">
                                <div>
                                    <p class="text-xs uppercase tracking-widest text-stone-400 font-semibold mb-1">
                                        Correo electrónico
                                    </p>
                                    <p class="text-stone-800 font-medium">{{ user?.email }}</p>
                                </div>
                                <div v-if="user?.user_metadata?.full_name">
                                    <p class="text-xs uppercase tracking-widest text-stone-400 font-semibold mb-1">Nombre</p>
                                    <p class="text-stone-800 font-medium">{{ user.user_metadata.full_name }}</p>
                                </div>
                                <div v-if="user?.created_at && typeof user.created_at === 'string'">
                                    <p class="text-xs uppercase tracking-widest text-stone-400 font-semibold mb-1">
                                        Miembro desde
                                    </p>
                                    <p class="text-stone-800 font-medium">{{ formatDate(user.created_at) }}</p>
                                </div>
                            </div>
                        </div>

                        <div class="bg-white border border-stone-200 p-6">
                            <p class="text-sm text-stone-500 mb-4">
                                Al cerrar sesión tendrás que volver a iniciarla para acceder a tu cuenta.
                            </p>
                            <UButton
                                class="border border-red-300 text-red-600 hover:bg-red-50 bg-white"
                                @click="handleSignOut"
                            >
                                <UIcon name="i-heroicons-arrow-right-on-rectangle" class="w-4 h-4 mr-1.5" />
                                Cerrar sesión
                            </UButton>
                        </div>
                    </div>
                </template>

            </UTabs>
        </div>
    </div>
</template>

<script setup lang="ts">
definePageMeta({
    middleware: 'auth',
})

const user = useSupabaseUser()
const { formatCurrency } = useCurrency()
const router = useRouter()
const toast = useToast()

// ─── TABS ─────────────────────────────────────────────────────────────────────
const tabItems = [
    { label: 'Mis Pedidos',  slot: 'pedidos',     icon: 'i-heroicons-shopping-bag' },
    { label: 'Direcciones',  slot: 'direcciones', icon: 'i-heroicons-map-pin' },
    { label: 'Mi Perfil',    slot: 'perfil',      icon: 'i-heroicons-user-circle' },
]

// ─── COMPOSABLES ──────────────────────────────────────────────────────────────
const { orders } = await useOrders()
const { addresses, saveAddress, removeAddress, setDefaultAddress } = await useAddresses()

// ─── HELPERS ──────────────────────────────────────────────────────────────────
function formatDate(dateStr: string | null | undefined) {
    if (!dateStr) return '—'
    return new Date(dateStr).toLocaleDateString('es-MX', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    })
}

function shortId(id: string) {
    return id.slice(0, 8).toUpperCase()
}

function orderStatusConfig(status: string) {
    const map: Record<string, { label: string; color: string }> = {
        pending:    { label: 'Pendiente',   color: 'bg-amber-100 text-amber-700' },
        paid:       { label: 'Pagado',      color: 'bg-green-100 text-green-700' },
        failed:     { label: 'Fallido',     color: 'bg-red-100 text-red-700' },
        cancelled:  { label: 'Cancelado',   color: 'bg-stone-100 text-stone-500' },
        processing: { label: 'Procesando',  color: 'bg-blue-100 text-blue-700' },
    }
    return map[status] ?? { label: status, color: 'bg-stone-100 text-stone-500' }
}

const userInitial = computed(() => {
    const name = user.value?.user_metadata?.full_name || user.value?.email || '?'
    return name.charAt(0).toUpperCase()
})

// ─── ORDERS — estado UI ───────────────────────────────────────────────────────
const selectedOrder = ref<any>(null)
const orderDetailOpen = ref(false)

function openOrderDetail(order: any) {
    selectedOrder.value = order
    orderDetailOpen.value = true
}

// ─── ADDRESSES — estado UI ────────────────────────────────────────────────────
const addressModalOpen = ref(false)
const addressEditMode = ref(false)
const addressLoading = ref(false)

const blankAddress = {
    id:             null as string | null,
    alias:          '',
    recipient_name: '',
    street:         '',
    ext_number:     '',
    int_number:     '',
    neighborhood:   '',
    city:           '',
    state:          '',
    zip_code:       '',
    phone:          '',
    is_default:     false,
}

const addressForm = reactive({ ...blankAddress })

function openAddAddress() {
    addressEditMode.value = false
    Object.assign(addressForm, blankAddress)
    addressModalOpen.value = true
}

function openEditAddress(addr: any) {
    addressEditMode.value = true
    Object.assign(addressForm, {
        id:             addr.id,
        alias:          addr.alias          ?? '',
        recipient_name: addr.recipient_name ?? '',
        street:         addr.street         ?? '',
        ext_number:     addr.ext_number     ?? '',
        int_number:     addr.int_number     ?? '',
        neighborhood:   addr.neighborhood   ?? '',
        city:           addr.city           ?? '',
        state:          addr.state          ?? '',
        zip_code:       addr.zip_code       ?? '',
        phone:          addr.phone          ?? '',
        is_default:     addr.is_default     ?? false,
    })
    addressModalOpen.value = true
}

async function handleSaveAddress() {
    addressLoading.value = true
    try {
        await saveAddress(addressForm, addressEditMode.value ? addressForm.id : null)
        addressModalOpen.value = false
        toast.add({
            title: addressEditMode.value ? 'Dirección actualizada' : 'Dirección agregada',
            icon: 'i-heroicons-check-circle',
            color: 'green',
        })
    } catch (e) {
        toast.add({
            title: 'Ocurrió un error',
            description: 'No se pudo guardar la dirección.',
            icon: 'i-heroicons-x-circle',
            color: 'red',
        })
    } finally {
        addressLoading.value = false
    }
}

async function handleSetDefault(id: string) {
    await setDefaultAddress(id)
    toast.add({
        title: 'Dirección predeterminada actualizada',
        icon: 'i-heroicons-check-circle',
        color: 'green',
    })
}

async function handleRemoveAddress(id: string) {
    await removeAddress(id)
    toast.add({
        title: 'Dirección eliminada',
        icon: 'i-heroicons-trash',
        color: 'gray',
    })
}

// ─── AUTH ─────────────────────────────────────────────────────────────────────
async function handleSignOut() {
    const supabase = useSupabaseClient()
    await supabase.auth.signOut()
    router.push('/')
}
</script>


<style scoped>
    .address-list-move {
        transition: transform 0.4s ease;
    }
    .address-list-enter-active,
    .address-list-leave-active {
        transition: all 0.3s ease;
    }
    .address-list-enter-from,
    .address-list-leave-to {
        opacity: 0;
        transform: translateY(8px);
    }
</style>