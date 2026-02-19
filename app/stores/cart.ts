import { defineStore } from 'pinia'

export interface CartItem {
  id: string
  nombre: string  
  slug: string
  precio_venta: number
  imagen_principal: string
  marca: string
  cantidad: number
  stock: number
}

export const useCartStore = defineStore('cart', {
  state: () => ({
    items: [] as CartItem[]
  }),

  getters: {
    totalItems: (state) => state.items.reduce((acc, item) => acc + item.cantidad, 0),

    subtotal: (state) => state.items.reduce((acc, item) => acc + item.precio_venta * item.cantidad, 0),

    tax(): number {return this.subtotal * 0.16},

    total(): number {return this.subtotal + this.tax}
  },

  actions: {
    addItem(product: Omit<CartItem, 'cantidad'>) {
      const existing = this.items.find(item => String(item.id) === String(product.id))

      if (existing) {
        // No permitir superar stock
        existing.cantidad = Math.min(existing.cantidad + 1, existing.stock)
      } else {
        this.items.push({
          ...product,
          cantidad: 1
        })
      }
    },

    removeItem(id: string) {
      this.items = this.items.filter(item => item.id !== id)
    },

    updateQuantity(id: string, cantidad: number) {
      const item = this.items.find(item => item.id === id)
      if (!item) return

      if (cantidad <= 0) {
        this.removeItem(id)
        return
      }

      item.cantidad = Math.min(cantidad, item.stock)
    },

    clearCart() {
      this.items = []
    }
  },

  persist: {
    storage: piniaPluginPersistedstate.localStorage(),
  },
})
