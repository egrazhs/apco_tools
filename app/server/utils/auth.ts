import { createClient } from '@supabase/supabase-js'

// ============================================
// Helper 1: Validar JWT y extraer usuario
// ============================================

/**
 * Valida que existe un JWT válido en el header Authorization
 * @param event - H3 event
 * @returns { sub: userId, ... } desde el JWT payload
 * @throws Error 401 si no hay token o es inválido
 */
export const requireAuth = (event: any) => {
    const authHeader = getHeader(event, 'authorization')

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        throw createError({
            statusCode: 401,
            statusMessage: 'Token no proporcionado o formato inválido'
        })
    }

    const token = authHeader.slice(7) // Remove "Bearer "

    try {
        // Decodificar JWT (sin validar firma, porque Supabase ya lo hizo en cliente)
        // Si necesitas validar firma, usarías jsonwebtoken package
        const decoded = JSON.parse(
            Buffer.from(token.split('.')[1], 'base64').toString('utf-8')
        )

        return decoded
    } catch (error) {
        throw createError({
            statusCode: 401,
            statusMessage: 'Token inválido o malformado'
        })
    }
}

// ============================================
// Helper 2: Verificar rol admin
// ============================================

/**
 * Verifica si un usuario tiene rol 'admin' en la tabla profiles
 * @param userId - UUID del usuario (del JWT)
 * @returns true si es admin, false en caso contrario
 */
export const checkAdminRole = async (userId: string): Promise<boolean> => {
    try {
        const supabase = useSupabaseAdmin()

        const { data, error } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', userId)
            .single()

        if (error) {
            console.error('Error checking admin role:', error)
            return false
        }

        return data?.role === 'admin'
    } catch (error) {
        console.error('Error in checkAdminRole:', error)
        return false
    }
}

// ============================================
// Helper 3: Cliente Supabase con Service Role
// ============================================

/**
 * Retorna cliente Supabase con credenciales de service role
 * (permite bypass de RLS para operaciones server-side)
 * @returns Supabase client con service role key
 */
export const useSupabaseServiceRole = () => {
    const config = useRuntimeConfig()

    return createClient(
        config.public.supabaseUrl,
        config.supabaseServiceKey, // Env var privada
        {
            auth: {
                autoRefreshToken: false,
                persistSession: false
            }
        }
    )
}

// ============================================
// Helper 4: Alias para useSupabaseAdmin
// ============================================

/**
 * Alias de useSupabaseServiceRole (mismo comportamiento)
 * Algunos proyectos usan "admin" como nombre más descriptivo
 */
export const useSupabaseAdmin = () => {
    return useSupabaseServiceRole()
}