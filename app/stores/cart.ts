// stores/cart.ts
import { defineStore } from 'pinia'

export interface CartItem {
    product_id: number
    quantity: number
    // Snapshot del producto al momento de agregar
    name: string
    price: number
    slug: string
    image_url: string | null
    stock: number
}

export const useCartStore = defineStore('cart', () => {
    const items = ref<CartItem[]>([])
    const loading = ref(false)
    const error = ref<string | null>(null)

    // ─── Computadas ──────────────────────────────────────────────────────────

    const totalItems = computed(() =>
        items.value.reduce((sum, i) => sum + i.quantity, 0)
    )

    const subtotal = computed(() =>
        items.value.reduce((sum, i) => sum + i.price * i.quantity, 0)
    )

    const isEmpty = computed(() => items.value.length === 0)

    // ─── Helpers internos ─────────────────────────────────────────────────────

    function _findIndex(product_id: number) {
        return items.value.findIndex(i => i.product_id === product_id)
    }

    // ─── Mutaciones (solo estado local, sin efectos secundarios) ─────────────

    function setItems(newItems: CartItem[]) {
        items.value = newItems
    }

    /**
     * Agrega o incrementa un ítem. Respeta el stock máximo.
     * No llama a Supabase: eso lo hace useSupabaseCart.
     */
    function _addItem(
        product: Omit<CartItem, 'quantity'>,
        quantity: number
    ) {
        const idx = _findIndex(product.product_id)
        if (idx >= 0) {
            const newQty = items.value[idx].quantity + quantity
            items.value[idx].quantity = Math.min(newQty, product.stock)
        } else {
            items.value.push({
                ...product,
                quantity: Math.min(quantity, product.stock),
            })
        }
    }

    function _removeItem(product_id: number) {
        const idx = _findIndex(product_id)
        if (idx >= 0) items.value.splice(idx, 1)
    }

    function _updateQuantity(product_id: number, quantity: number) {
        const idx = _findIndex(product_id)
        if (idx < 0) return
        if (quantity <= 0) {
            items.value.splice(idx, 1)
        } else {
            items.value[idx].quantity = Math.min(
                quantity,
                items.value[idx].stock
            )
        }
    }

    function clearCart() {
        items.value = []
    }

    return {
        // state
        items,
        loading,
        error,
        // computed
        totalItems,
        subtotal,
        isEmpty,
        // mutations
        setItems,
        _addItem,
        _removeItem,
        _updateQuantity,
        clearCart,
    }
})