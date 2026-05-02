// composables/useCartActions.ts
// Thin wrapper sobre useCartStore que agrega feedback visual con useToast

import type { AddItemMeta } from '~/stores/cart'

export function useCartActions() {
    const cart  = useCartStore()
    const toast = useToast()

    async function addToCart(
        productId: string,
        quantity: number,
        meta: AddItemMeta
    ) {
        const result = await cart.addItem(productId, quantity, meta)

        if (result.success) {
            toast.add({
                title: 'Producto agregado',
                description: `${meta.name} × ${quantity}`,
                color: 'green',
                icon: 'i-heroicons-check-circle',
                duration: 3000,
            })
        } else {
            toast.add({
                title: 'No se pudo agregar',
                description: result.message,
                color: 'red',
                icon: 'i-heroicons-exclamation-circle',
                duration: 4000,
            })
        }

        return result
    }

    async function changeQuantity(productId: string, quantity: number) {
        const result = await cart.updateQuantity(productId, quantity)

        if (!result.success) {
            toast.add({
                title: 'Stock insuficiente',
                description: result.message,
                color: 'amber',
                icon: 'i-heroicons-exclamation-triangle',
                duration: 4000,
            })
        }

        return result
    }

    return {
        addToCart,
        changeQuantity,
        removeItem: cart.removeItem,
        clearCart:  cart.clearCart,
    }
}