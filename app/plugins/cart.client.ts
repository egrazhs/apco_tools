// plugins/cart.client.ts
//
// Plugin que corre SOLO en el cliente (SSR-safe).
// Responsabilidades al montar la app:
//   - Si hay sesión: fusionar carrito local → Supabase y cargar el resultado
//   - Si es invitado: restaurar carrito desde localStorage
//   - Escuchar cambios de auth para sincronizar en tiempo real

export default defineNuxtPlugin(async () => {
    const user = useSupabaseUser()
    const {
        loadLocalCart,
        loadFromSupabase,
        syncLocalToSupabase,
        hasLocalCart,
    } = useSupabaseCart()
    const cart = useCartStore()

    // ── Inicialización ────────────────────────────────────────────────────────

    if (user.value) {
        // Usuario autenticado: revisar si quedó un carrito de invitado
        if (hasLocalCart()) {
            // Cargar los ítems locales al store antes del merge
            loadLocalCart()
            await syncLocalToSupabase()
        } else {
            await loadFromSupabase()
        }
    } else {
        // Invitado: restaurar desde localStorage
        loadLocalCart()
    }

    // ── Watcher de auth ───────────────────────────────────────────────────────

    watch(
        user,
        async (newUser, prevUser) => {
            // Login: fusionar carrito local con el de Supabase
            if (newUser && !prevUser) {
                await syncLocalToSupabase()
            }

            // Logout: limpiar el store en memoria
            // (el localStorage de invitado se gestiona desde useSupabaseCart)
            if (!newUser && prevUser) {
                cart.clearCart()
            }
        },
        { immediate: false }
    )
})