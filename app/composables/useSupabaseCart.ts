// composables/useSupabaseCart.ts
//
// Capa de persistencia del carrito.
// Responsabilidades:
//   - Validar stock en tiempo real contra Supabase
//   - CRUD en tablas cart / cart_items para usuarios autenticados
//   - Persistencia en localStorage para invitados
//   - Merge local → Supabase al hacer login
//
// Uso:
//   const { addItem, removeItem, updateQuantity } = useSupabaseCart()

import type { Database } from '~/types/supabase'
import type { CartItem } from '~/stores/cart'

// ─── Tipos locales ────────────────────────────────────────────────────────────

type ProductSnapshot = Omit<CartItem, 'quantity'>

interface StockResult {
    ok: boolean
    available: number
}

// ─── Constante ────────────────────────────────────────────────────────────────

const LOCAL_CART_KEY = 'apco-cart'

// ─── Composable ───────────────────────────────────────────────────────────────

export function useSupabaseCart() {
    const supabase = useSupabaseClient<Database>()
    const user = useSupabaseUser()
    const cart = useCartStore()

    // ── localStorage ─────────────────────────────────────────────────────────

    function saveLocalCart() {
        if (import.meta.client) {
            localStorage.setItem(LOCAL_CART_KEY, JSON.stringify(cart.items))
        }
    }

    function loadLocalCart() {
        if (!import.meta.client) return
        const stored = localStorage.getItem(LOCAL_CART_KEY)
        if (!stored) return
        try {
            const parsed = JSON.parse(stored) as CartItem[]
            if (Array.isArray(parsed)) cart.setItems(parsed)
        } catch {
            localStorage.removeItem(LOCAL_CART_KEY)
        }
    }

    function clearLocalCart() {
        if (import.meta.client) {
            localStorage.removeItem(LOCAL_CART_KEY)
        }
    }

    function hasLocalCart(): boolean {
        if (!import.meta.client) return false
        try {
            const stored = localStorage.getItem(LOCAL_CART_KEY)
            if (!stored) return false
            const parsed = JSON.parse(stored) as CartItem[]
            return Array.isArray(parsed) && parsed.length > 0
        } catch {
            return false
        }
    }

    // ── Supabase helpers ──────────────────────────────────────────────────────

    /**
     * Devuelve el id del carrito activo del usuario.
     * Si no existe, lo crea.
     */
    async function getOrCreateCartId(): Promise<string | null> {
        // ✅ Verificar que el id exista explícitamente, no solo el objeto user
        //console.log('[getOrCreateCartId] user:', JSON.stringify(user.value))
        if (!user.value?.sub) return null
        

        const { data: existing, error } = await supabase
            .from('cart')
            .select('id')
            .eq('user_id', user.value.sub)
            .maybeSingle()

        if (error) {
            console.error('[useSupabaseCart] getOrCreateCartId:', error.message)
            return null
        }
        if (existing) return existing.id

        const { data: created, error: createError } = await supabase
            .from('cart')
            .insert({ user_id: user.value.sub })
            .select('id')
            .single()

        if (createError) {
            console.error('[useSupabaseCart] crear cart:', createError.message)
            return null
        }
        return created?.id ?? null
    }

    // ── Stock ─────────────────────────────────────────────────────────────────

    /**
     * Consulta el stock real del producto en Supabase.
     * Usar antes de cualquier mutación del carrito.
     */
    async function validateStock(
        product_id: number,
        requested: number
    ): Promise<StockResult> {
        const { data, error } = await supabase
            .from('products')
            .select('stock')
            .eq('id', product_id)
            .single()

        if (error || !data) {
            return { ok: false, available: 0 }
        }

        return {
            ok: requested <= data.stock,
            available: data.stock,
        }
    }

    // ── Carga del carrito ─────────────────────────────────────────────────────

    /**
     * Carga el carrito desde Supabase y sincroniza el store local.
     * Llamar sólo cuando el usuario está autenticado.
     */
    async function loadFromSupabase() {
        if (!user.value) return

        const { data, error } = await supabase
            .from('cart')
            .select(`
                id,
                cart_items (
                    id,
                    quantity,
                    products (
                        id,
                        name,
                        price,
                        slug,
                        image_url,
                        stock
                    )
                )
            `)
            .eq('user_id', user.value.sub)
            .maybeSingle()

        if (error) {
            console.error('[useSupabaseCart] loadFromSupabase:', error.message)
            return
        }
        if (!data?.cart_items) return

        const items: CartItem[] = (data.cart_items as any[])
            .filter(ci => ci.products !== null)
            .map(ci => ({
                product_id: ci.products.id,
                quantity:   ci.quantity,                         // ← clave: CartItem | valor: cart_items
                name:       ci.products.name,                 // ← clave: CartItem | valor: productos
                price:      ci.products.price,           // ← clave: CartItem | valor: productos
                slug:       ci.products.slug,
                image_url:  ci.products.image_url ?? null,
                stock:      ci.products.stock,
            }))

        cart.setItems(items)
    }

    // ── Agregar ítem ──────────────────────────────────────────────────────────

    /**
     * Agrega un producto al carrito validando stock.
     * Si hay sesión activa, persiste en Supabase.
     * Si es invitado, guarda en localStorage.
     *
     * @returns true si se agregó correctamente, false si no hay stock
     */
    async function addItem(
        product: ProductSnapshot,
        quantity = 1
    ): Promise<boolean> {
        cart.loading = true
        cart.error = null
        try {
            // 1. Validar stock real
            const { ok, available } = await validateStock(
                product.product_id,
                quantity
            )
            if (available === 0) {
                cart.error = 'Este producto no tiene stock disponible.'
                return false
            }
            // Si hay stock parcial, usamos lo disponible sin bloquear
            const safeQty = ok ? quantity : available

            // 2. Actualizar store local
            cart._addItem({ ...product, stock: available }, safeQty)

            // 3. Persistir
            if (user.value) {
                await _upsertItem(product.product_id, safeQty)
            } else {
                saveLocalCart()
            }

            return true
        } catch (e: any) {
            cart.error = e?.message ?? 'Error al agregar al carrito.'
            return false
        } finally {
            cart.loading = false
        }
    }

    /** Upsert de un cart_item en Supabase */
    async function _upsertItem(product_id: number, quantityDelta: number) {
        const cartId = await getOrCreateCartId()
        //console.log("_upsertItem: ", cartId);
        if (!cartId) return

        const { data: existing } = await supabase
            .from('cart_items')
            .select('id, quantity')
            .eq('cart_id', cartId)
            .eq('product_id', product_id)
            .maybeSingle()

        if (existing) {
            // Re-validamos con la cantidad total para no superar stock
            const totalQty = existing.quantity + quantityDelta
            const { available } = await validateStock(product_id, totalQty)
            const finalQty = Math.min(totalQty, available)

            await supabase
                .from('cart_items')
                .update({ quantity: finalQty })
                .eq('id', existing.id)
        } else {
            await supabase
                .from('cart_items')
                .insert({ cart_id: cartId, product_id, quantity: quantityDelta })
        }
    }

    // ── Eliminar ítem ─────────────────────────────────────────────────────────

    async function removeItem(product_id: number) {
        cart._removeItem(product_id)

        if (user.value) {
            const { data: cartData } = await supabase
                .from('cart')
                .select('id')
                .eq('user_id', user.value.sub)
                .maybeSingle()

            if (cartData) {
                await supabase
                    .from('cart_items')
                    .delete()
                    .eq('cart_id', cartData.id)
                    .eq('product_id', product_id)
            }
        } else {
            saveLocalCart()
        }
    }

    // ── Actualizar cantidad ───────────────────────────────────────────────────

    async function updateQuantity(product_id: number, quantity: number) {
        if (quantity <= 0) {
            return removeItem(product_id)
        }

        // Validar stock antes de actualizar
        const { available } = await validateStock(product_id, quantity)
        const safeQty = Math.min(quantity, available)

        cart._updateQuantity(product_id, safeQty)

        if (user.value) {
            const { data: cartData } = await supabase
                .from('cart')
                .select('id')
                .eq('user_id', user.value.sub)
                .maybeSingle()

            if (cartData) {
                await supabase
                    .from('cart_items')
                    .update({ quantity: safeQty })
                    .eq('cart_id', cartData.id)
                    .eq('product_id', product_id)
            }
        } else {
            saveLocalCart()
        }
    }

    // ── Vaciar carrito ────────────────────────────────────────────────────────

    async function clearCart() {
        cart.clearCart()

        if (user.value) {
            const { data: cartData } = await supabase
                .from('cart')
                .select('id')
                .eq('user_id', user.value.sub)
                .maybeSingle()

            if (cartData) {
                await supabase
                    .from('cart_items')
                    .delete()
                    .eq('cart_id', cartData.id)
            }
        } else {
            clearLocalCart()
        }
    }

    // ── Merge local → Supabase ────────────────────────────────────────────────

    /**
     * Al hacer login, fusiona el carrito de invitado con el de Supabase.
     * Estrategia: suma cantidades, respeta stock, prioriza Supabase en conflicto.
     * Llamar ANTES de loadFromSupabase en el flujo de login.
     */
    async function syncLocalToSupabase() {
        if (!user.value) return

        // Cargar ítems locales antes de que el store sea sobreescrito
        const localItems = [...cart.items]
        if (localItems.length === 0) {
            // No hay carrito local: solo cargar el de Supabase
            await loadFromSupabase()
            return
        }

        const cartId = await getOrCreateCartId()
        if (!cartId) return

        // Obtener ítems existentes en Supabase
        const { data: existingItems } = await supabase
            .from('cart_items')
            .select('product_id, quantity, id')
            .eq('cart_id', cartId)

        const supabaseMap = new Map(
            (existingItems ?? []).map(i => [i.product_id, i])
        )

        for (const localItem of localItems) {
            const { available } = await validateStock(
                localItem.product_id,
                localItem.quantity
            )
            if (available === 0) continue

            const existing = supabaseMap.get(localItem.product_id)
            if (existing) {
                // Fusionar: suma de ambas cantidades, capada por stock
                const merged = Math.min(
                    existing.quantity + localItem.quantity,
                    available
                )
                await supabase
                    .from('cart_items')
                    .update({ quantity: merged })
                    .eq('id', existing.id)
            } else {
                // Insertar ítem nuevo
                const safeQty = Math.min(localItem.quantity, available)
                if (safeQty > 0) {
                    await supabase
                        .from('cart_items')
                        .insert({
                            cart_id: cartId,
                            product_id: localItem.product_id,
                            quantity: safeQty,
                        })
                }
            }
        }

        // Limpiar localStorage y recargar desde Supabase como fuente de verdad
        clearLocalCart()
        await loadFromSupabase()
    }

    return {
        // Carga
        loadLocalCart,
        loadFromSupabase,
        hasLocalCart,
        // CRUD
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        // Sync
        syncLocalToSupabase,
        // Utilidades
        validateStock,
    }
}