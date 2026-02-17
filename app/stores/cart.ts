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
    items: [] as CartItem[],
    isLoaded: false
  }),

  getters: {
    totalItems: (state) =>
      state.items.reduce((acc, item) => acc + item.cantidad, 0),

    subtotal: (state) =>
      state.items.reduce((acc, item) => acc + item.precio_venta * item.cantidad, 0),

    tax: (state) => state.items.reduce((acc, item) => acc + item.precio_venta * item.cantidad, 0) * 0.16,

    total(): number {
      return this.subtotal + this.tax
    }
  },

  actions: {
    addItem(product: Omit<CartItem, 'cantidad'>) {
      console.log("Add Item", product);
      console.log('ANTES:', this.items)
      const existing = this.items.find(item => item.id === product.id)

      if (existing) {
        if (existing.cantidad < existing.stock) {
          existing.cantidad++
        }
      } else {
        this.items.push({
          ...product,
          cantidad: 1
        })
      }

      this.saveToLocalStorage()

      console.log('DESPUÉS:', this.items)
    },

    removeItem(id: string) {
      this.items = this.items.filter(item => item.id !== id)
      this.saveToLocalStorage()
    },

    updateQuantity(id: string, cantidad: number) {
      const item = this.items.find(item => item.id === id)
      if (!item) return

      if (cantidad <= 0) {
        this.removeItem(id)
      } else if (cantidad <= item.stock) {
        item.cantidad = cantidad
      }

      this.saveToLocalStorage()
    },

    clearCart() {
      this.items = []
      this.saveToLocalStorage()
    },

    saveToLocalStorage() {
      if (process.client) {
        localStorage.setItem('cart', JSON.stringify(this.items))
      }
    },

    loadFromLocalStorage() {
  if (process.client) {
      const data = localStorage.getItem('cart');
      if (data) {
        this.items = JSON.parse(data)
      }
        this.isLoaded = true
      }
    }
  }
})
