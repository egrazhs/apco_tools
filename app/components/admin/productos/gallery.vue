<template>
    <div class="space-y-4">
        <!-- Título -->
        <UFormField label="Galería de imágenes">
            <!-- Upload input -->
            <div class="space-y-3">
                <!-- Botón upload -->
                <div class="border-2 border-dashed border-stone-300 rounded-lg p-6 text-center hover:bg-stone-50 transition">
                    <input
                        type="file"
                        ref="fileInput"
                        @change="handleFileSelect"
                        accept="image/*"
                        class="hidden"
                    />
                    <button
                        type="button"
                        @click="$refs.fileInput.click()"
                        :disabled="uploading"
                        class="w-full"
                    >
                        <UIcon name="i-heroicons-cloud-arrow-up" class="w-8 h-8 mx-auto text-stone-400 mb-2" />
                        <p class="text-sm font-medium text-stone-700">
                            {{ uploading ? 'Subiendo...' : 'Click para subir o arrastra imagen' }}
                        </p>
                        <p class="text-xs text-stone-500 mt-1">PNG, JPG, GIF (máx. 5MB)</p>
                    </button>
                </div>

                <!-- Galería actual -->
                <div v-if="images.length > 0" class="space-y-2">
                    <p class="text-xs text-stone-500 uppercase tracking-widest font-semibold">Imágenes subidas ({{ images.length }})</p>
                    <div class="grid grid-cols-4 gap-2">
                        <div
                            v-for="(img, idx) in images"
                            :key="idx"
                            class="relative group"
                        >
                            <!-- Thumbnail -->
                            <div class="aspect-square rounded-lg overflow-hidden border-2 transition"
                                :class="img.isPrimary ? 'border-green-500' : 'border-stone-200 hover:border-stone-300'"
                            >
                                <img
                                    :src="img.url"
                                    :alt="img.altText"
                                    class="w-full h-full object-contain"
                                />
                            </div>

                            <!-- Badge primaria -->
                            <div v-if="img.isPrimary" class="absolute top-1 left-1 bg-green-500 text-white text-xs px-2 py-1 rounded">
                                Principal
                            </div>

                            <!-- Acciones (hover) -->
                            <div class="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-2 rounded-lg">
                                <button
                                    v-if="!img.isPrimary"
                                    type="button"
                                    @click="setPrimary(img.imageKey)"
                                    class="p-2 bg-green-500 hover:bg-green-600 text-white rounded"
                                    title="Marcar como principal"
                                >
                                    <UIcon name="i-heroicons-star" class="w-4 h-4" />
                                </button>
                                <button
                                    type="button"
                                    @click="deleteImage(img.imageKey)"
                                    class="p-2 bg-red-500 hover:bg-red-600 text-white rounded"
                                    title="Eliminar"
                                >
                                    <UIcon name="i-heroicons-trash" class="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Sin imágenes -->
                <div v-else class="text-center py-4 text-stone-500">
                    <p class="text-sm">No hay imágenes. Sube una para comenzar.</p>
                </div>
            </div>
        </UFormField>
    </div>
</template>

<script setup lang="ts">
    const props = defineProps({
        productId: {
            type: Number,
            required: true
        }
    })

    const { getProductImages, uploadProductImage, setPrimaryImage: setPrimaryImageApi, deleteProductImage } = useProductImages()
    const toast = useToast()

    const fileInput = ref(null)
    const uploading = ref(false)
    const images = ref([])
    const deleting = ref(false)

    // Cargar imágenes al montar
    onMounted(async () => {
        await loadImages()
    })

    // Cargar imágenes del producto
    const loadImages = async () => {
        try {
            const imgs = await getProductImages(props.productId)
            images.value = imgs
        } catch (error) {
            console.error('Error loading images:', error)
        }
    }

    // Manejar selección de archivo
    const handleFileSelect = async (event: Event) => {
        const input = event.target as HTMLInputElement
        const file = input.files?.[0]

        if (!file) return

        // Validar tamaño (5MB máx)
        if (file.size > 5 * 1024 * 1024) {
            toast.add({ title: 'Archivo muy grande (máx. 5MB)', color: 'red' })
            return
        }

        uploading.value = true

        try {
            const result = await uploadProductImage({
                productId: props.productId,
                file,
                isPrimary: images.value.length === 0, // Primera imagen es primaria
                altText: file.name
            })

            if (result.success) {
                toast.add({ title: 'Imagen subida correctamente', color: 'green' })
                await loadImages() // Recargar galería
            } else {
                toast.add({ title: result.error || 'Error al subir imagen', color: 'red' })
            }
        } catch (error) {
            console.error('Upload error:', error)
            toast.add({ title: 'Error al subir imagen', color: 'red' })
        } finally {
            uploading.value = false
            input.value = '' // Limpiar input
        }
    }

    // Marcar como primaria
    const setPrimary = async (imageKey: string) => {
        try {
            const result = await setPrimaryImageApi(props.productId, imageKey)
            if (result.success) {
                toast.add({ title: 'Imagen marcada como principal', color: 'green' })
                await loadImages()
            } else {
                toast.add({ title: result.error || 'Error', color: 'red' })
            }
        } catch (error) {
            console.error('Set primary error:', error)
            toast.add({ title: 'Error al marcar imagen', color: 'red' })
        }
    }

    const deleteImage = async (imageKey: string) => {
        if (!confirm('¿Eliminar esta imagen?')) return
        
        deleting.value = true
        try {
            
             const result = await deleteProductImage(props.productId, imageKey)
            
            if (result.success) {
                toast.add({ title: 'Imagen eliminada', color: 'green' })
                await loadImages()
            } else {
                toast.add({ title: result.error || 'Error', color: 'red' })
            }
        } catch (error) {
            toast.add({ title: 'Error al eliminar imagen', color: 'red' })
        } finally {
            deleting.value = false
        }
    }
</script>