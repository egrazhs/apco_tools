#!/usr/bin/env node

/**
 * Script de Migración: Imágenes de Productos
 * 
 * Uso: cd C:\xampp\htdocs\apco_tools && node app/scripts/migrateImages.mjs
 * 
 * IMPORTANTE: Ejecutar desde la RAÍZ del proyecto
 */

import dotenv from 'dotenv'
import path from 'path'
import fs from 'fs'
import { fileURLToPath } from 'url'
import { createClient } from '@supabase/supabase-js'
import fetch from 'node-fetch'
import sharp from 'sharp'
import { createHash } from 'crypto'

// ============================================
// Cargar .env desde raíz del proyecto
// ============================================

const envPath = path.join(process.cwd(), '.env')

console.log(`📁 Working directory: ${process.cwd()}`)
console.log(`📄 Buscando .env en: ${envPath}`)

if (!fs.existsSync(envPath)) {
    console.error(`\n❌ ERROR: .env no encontrado en: ${envPath}`)
    console.error(`\n📋 Solución: Ejecuta desde la raíz del proyecto:`)
    console.error(`   cd C:\\xampp\\htdocs\\apco_tools`)
    console.error(`   node app/scripts/migrateImages.mjs\n`)
    process.exit(1)
}

// Cargar variables
dotenv.config({ path: envPath })

console.log(`✅ .env cargado correctamente\n`)

// ============================================
// Validar variables de entorno
// ============================================

const SUPABASE_URL = process.env.NUXT_PUBLIC_SUPABASE_URL
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
    console.error('❌ ERROR: Variables de entorno faltantes')
    console.error(`   NUXT_PUBLIC_SUPABASE_URL: ${SUPABASE_URL ? '✅' : '❌ FALTA'}`)
    console.error(`   SUPABASE_SERVICE_KEY: ${SUPABASE_SERVICE_KEY ? '✅' : '❌ FALTA'}`)
    console.error(`\n📋 Verifica que tu .env tiene estas variables\n`)
    process.exit(1)
}

console.log('✅ Variables de entorno OK\n')

// ============================================
// Configuración
// ============================================

const TIMEOUT = 15000 // ms para descargas
const WEBP_QUALITY = 80 // Buena relación tamaño/calidad
const MAX_RETRIES = 3

// Log file
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const LOG_FILE = path.join(__dirname, 'migration-log.txt')

// ============================================
// Logger
// ============================================

const log = (message, type = 'info') => {
    const timestamp = new Date().toISOString()
    const logMessage = `[${timestamp}] [${type.toUpperCase()}] ${message}`
    console.log(logMessage)
    fs.appendFileSync(LOG_FILE, logMessage + '\n')
}

// ============================================
// Supabase Client
// ============================================

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY, {
    auth: {
        autoRefreshToken: false,
        persistSession: false
    }
})

// ============================================
// Helpers
// ============================================

/**
 * Descargar imagen desde URL con retry y timeout
 */
const downloadImage = async (url, retries = MAX_RETRIES) => {
    for (let attempt = 1; attempt <= retries; attempt++) {
        try {
            const controller = new AbortController()
            const timeoutId = setTimeout(() => controller.abort(), TIMEOUT)

            const response = await fetch(url, {
                signal: controller.signal,
                headers: {
                    'User-Agent': 'APCO-Tools-Migration/1.0'
                }
            })

            clearTimeout(timeoutId)

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}`)
            }

            const buffer = await response.buffer()
            return buffer
        } catch (error) {
            if (attempt === retries) {
                throw new Error(`Fallo descargar tras ${retries} intentos: ${error.message}`)
            }
            await new Promise(resolve => setTimeout(resolve, 1000 * attempt))
        }
    }
}

/**
 * Generar SHA-256 hash de un buffer
 */
const generateHash = (buffer) => {
    return createHash('sha256').update(buffer).digest('hex')
}

/**
 * Convertir imagen a WebP
 */
const convertToWebP = async (buffer) => {
    return await sharp(buffer)
        .webp({ quality: WEBP_QUALITY })
        .toBuffer()
}

/**
 * Procesar una imagen (descargar → convertir → hash → subir → insertar)
 */
const processImage = async (product) => {
    const { id: productId, name, image_url } = product

    try {
        if (!image_url || image_url.trim() === '') {
            return {
                productId,
                status: 'skipped',
                reason: 'image_url vacío'
            }
        }

        // 1. Descargar
        const imageBuffer = await downloadImage(image_url)

        // 2. Generar hash
        const imageKey = generateHash(imageBuffer)

        // 3. Convertir a WebP
        const webpBuffer = await convertToWebP(imageBuffer)

        // 4. Subir a Storage
        const filename = `${imageKey}.webp`

        const { error: uploadError } = await supabase.storage
            .from('product-images')
            .upload(filename, webpBuffer, {
                contentType: 'image/webp',
                upsert: false
            })

        // Si el archivo ya existe en Storage, no es error crítico
        // (significa que fue subido en una ejecución anterior)
        if (uploadError) {
            const isAlreadyExists = 
                uploadError.message === 'Duplicate' || 
                uploadError.message?.includes('already exists') ||
                uploadError.message?.includes('The resource already exists')
            
            if (!isAlreadyExists) {
                throw uploadError
            }
            // Si ya existe, continuamos (intentaremos insertar en BD)
        }

        // 5. Insertar en BD
        const { data, error: insertError } = await supabase
            .from('product_images')
            .insert({
                product_id: productId,
                image_key: imageKey,
                is_primary: true,
                alt_text: name,
                display_order: 0
            })
            .select()

        // Distinguir entre success, duplicate y error
        if (insertError) {
            if (insertError.code === '23505') {
                // Duplicate: El producto ya tiene este image_key
                // Esto es OK (idempotencia), solo loguear como duplicate
                return {
                    productId,
                    name,
                    imageKey,
                    status: 'duplicate',
                    reason: 'Ya tiene este image_key'
                }
            } else {
                // Otro error: No es esperado
                throw insertError
            }
        }

        return {
            productId,
            name,
            imageKey,
            status: 'success',
            fileSize: Math.round(webpBuffer.length / 1024)
        }

    } catch (error) {
        return {
            productId,
            name,
            status: 'error',
            error: error.message
        }
    }
}

/**
 * Ejecutar tareas SECUENCIALMENTE (uno por uno)
 * Para evitar race conditions cuando múltiples productos comparten imagen
 */
const processSequential = async (items, processor) => {
    const results = []

    for (const item of items) {
        const result = await processor(item)
        results.push(result)
    }

    return results
}

// ============================================
// Main
// ============================================

const main = async () => {
    log('=== INICIO DE MIGRACIÓN ===')
    log(`Descargando productos con image_url...`)

    try {
        const { data: products, error } = await supabase
            .from('products')
            .select('id, name, image_url')
            .not('image_url', 'is', null)

        if (error) throw error

        if (!products || products.length === 0) {
            log('No hay productos con image_url. Nada que migrar.', 'warning')
            return
        }

        log(`Encontrados ${products.length} productos con image_url`)
        log(`Iniciando migración SECUENCIAL (uno por uno)...`)

        const results = await processSequential(products, processImage)

        // Estadísticas
        const stats = {
            success: results.filter(r => r.status === 'success').length,
            duplicate: results.filter(r => r.status === 'duplicate').length,
            error: results.filter(r => r.status === 'error').length,
            skipped: results.filter(r => r.status === 'skipped').length,
            total: results.length
        }

        log('')
        log('=== RESUMEN ===')
        log(`Total procesados: ${stats.total}`)
        log(`Exitosos (nuevos): ${stats.success}`)
        log(`Duplicados (ya existían): ${stats.duplicate}`)
        log(`Errores: ${stats.error}`)
        log(`Saltados (sin image_url): ${stats.skipped}`)

        // Logs de duplicates
        const duplicates = results.filter(r => r.status === 'duplicate')
        if (duplicates.length > 0) {
            log('')
            log('=== DUPLICADOS (YA EXISTÍAN) ===')
            duplicates.forEach(d => {
                log(`[${d.productId}] ${d.name}: Image ${d.imageKey.substring(0, 8)}...`)
            })
        }

        // Logs de errores
        const errors = results.filter(r => r.status === 'error')
        if (errors.length > 0) {
            log('')
            log('=== ERRORES ===')
            errors.forEach(e => {
                log(`[${e.productId}] ${e.name}: ${e.error}`, 'error')
            })
        }

        log('')
        log('=== MIGRACIÓN COMPLETADA ===')
        log(`Log guardado en: ${LOG_FILE}`)

    } catch (error) {
        log(`Error crítico: ${error.message}`, 'error')
        process.exit(1)
    }
}

// Ejecutar
main().catch(error => {
    log(`Error no capturado: ${error.message}`, 'error')
    process.exit(1)
})
