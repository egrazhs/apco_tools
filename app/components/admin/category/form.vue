<template>
    <div class="py-6">
        <UCard class="max-w-lg mx-auto">
            <template #header>
                <div class="flex items-center gap-3 py-1">
                    <div class="w-10 h-10 rounded-xl bg-primary-500/15 text-primary-400 flex items-center justify-center text-xl shrink-0">
                        <UIcon :name="isEdit ? 'i-heroicons-pencil-square' : 'i-heroicons-plus-circle'" />
                    </div>
                    <div>
                        <h2 class="text-lg font-semibold leading-tight">
                            {{ isEdit ? 'Editar Categoría' : 'Nueva Categoría' }}
                        </h2>
                        <p class="text-xs text-gray-400 mt-0.5">
                            {{ isEdit ? 'Modifica los datos de la categoría' : 'Completa los campos para crear una categoría' }}
                        </p>
                    </div>
                </div>
            </template>

            <UForm @submit="handleSubmit" class="flex flex-col">

                <!-- INFORMACIÓN GENERAL -->
                <div class="py-6 border-b border-gray-700/50">
                    <div class="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-primary-400 mb-5">
                        <UIcon name="i-heroicons-information-circle" />
                        <span>Información General</span>
                    </div>

                    <div class="flex flex-col gap-4">
                        <UFormField label="Nombre de la categoría" required>
                            <UInput
                                v-model="form.name"
                                placeholder="Ej: Herramientas Eléctricas"
                                size="lg"
                                icon="i-heroicons-folder"
                            />
                        </UFormField>

                        <UFormField label="Slug">
                            <UInput
                                v-model="form.slug"
                                placeholder="ej: herramientas-electricas"
                                size="lg"
                                icon="i-heroicons-link"
                            />
                            <template #hint>
                                <span class="text-xs text-gray-500">Usado en la URL de la categoría</span>
                            </template>
                        </UFormField>

                        <UFormField label="Marca" required>
                            <USelect
                                v-model="form.brand_id"
                                :items="brands.map(b => ({ value: b.id, label: b.name }))"
                                placeholder="Selecciona una marca"
                            />
                        </UFormField>

                        <UFormField label="Estado">
                            <div
                                class="flex items-center justify-between px-4 rounded-lg border h-[42px] transition-all duration-200"
                                :class="form.is_active
                                    ? 'border-primary-500/40 bg-primary-500/5'
                                    : 'border-gray-700 bg-gray-800/50'"
                            >
                                <div class="flex items-center gap-2">
                                    <UIcon
                                        :name="form.is_active ? 'i-heroicons-check-circle' : 'i-heroicons-x-circle'"
                                        class="text-lg transition-colors"
                                        :class="form.is_active ? 'text-primary-400' : 'text-gray-500'"
                                    />
                                    <div>
                                        <p class="text-sm font-medium leading-tight">
                                            {{ form.is_active ? 'Activa' : 'Inactiva' }}
                                        </p>
                                        <p class="text-[10px] text-gray-500 leading-none mt-0.5">
                                            {{ form.is_active ? 'Visible en tienda' : 'Oculta en tienda' }}
                                        </p>
                                    </div>
                                </div>
                                <USwitch v-model="form.is_active" size="lg" />
                            </div>
                        </UFormField>



                        <UFormField label="Descripcion" required>
                            <UInput
                                v-model="form.description"
                                placeholder="Descripcion"
                                size="lg"
                                icon="i-heroicons-folder"
                            />
                        </UFormField>
                    </div>
                </div>

                <!-- IMAGEN -->
                <div class="py-6 border-b border-gray-700/50">
                    <div class="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-primary-400 mb-5">
                        <UIcon name="i-heroicons-photo" />
                        <span>Imagen de la Categoría</span>
                    </div>

                    <div class="flex flex-col gap-4">
                        <!-- Preview de imagen actual -->
                        <div v-if="imagePreview" class="relative">
                            <img :src="imagePreview" alt="Preview" class="w-full h-48 object-cover rounded-lg border border-gray-700" />
                            <UButton
                                type="button"
                                color="red"
                                variant="ghost"
                                size="sm"
                                icon="i-heroicons-x-mark"
                                class="absolute top-2 right-2"
                                @click="clearImage"
                            >
                                Eliminar
                            </UButton>
                        </div>

                        <!-- File input -->
                        <UFormField :label="imagePreview ? 'Cambiar imagen' : 'Subir imagen'">
                            <div class="flex flex-col gap-2">
                                <input
                                    ref="fileInput"
                                    type="file"
                                    accept="image/*"
                                    class="hidden"
                                    @change="handleFileSelect"
                                />
                                <UButton
                                    type="button"
                                    color="gray"
                                    variant="outline"
                                    icon="i-heroicons-arrow-up-tray"
                                    class="w-full"
                                    :loading="uploadingImage"
                                    @click="$refs.fileInput?.click()"
                                >
                                    {{ uploadingImage ? 'Subiendo...' : 'Seleccionar imagen' }}
                                </UButton>
                                <p class="text-xs text-gray-500">
                                    JPG, PNG o WebP. Máximo 5MB.
                                </p>
                            </div>
                        </UFormField>
                    </div>
                </div>

                <!-- ACCIONES -->
                <div class="flex justify-end items-center gap-3 pt-4">
                    <UButton
                        type="button"
                        color="gray"
                        variant="outline"
                        size="lg"
                        icon="i-heroicons-arrow-left"
                        @click="navigateTo('/admin/categorias')"
                    >
                        Cancelar
                    </UButton>
                    <UButton
                        type="submit"
                        size="lg"
                        :icon="isEdit ? 'i-heroicons-check' : 'i-heroicons-plus'"
                        :loading="submitting"
                    >
                        {{ isEdit ? 'Guardar cambios' : 'Crear categoría' }}
                    </UButton>
                </div>

            </UForm>
        </UCard>
    </div>
</template>

<script setup lang="ts">
    const props = defineProps<{ initialData?: any }>()
    const emit = defineEmits(['submit'])
    const isEdit = computed(() => !!props.initialData)

    const { getBrands } = useBrands()
    const { uploadImage, getImageUrl, deleteImage } = useStorageImage('category-images')

    // Cargar marcas
    const brands = ref([])

    onMounted(async () => {
        const { data } = await getBrands()
        brands.value = data ?? []
        console.log('🔍 Marcas cargadas:', brands.value)
    })

    // Formulario
    const form = reactive({
        name: props.initialData?.name || '',
        slug: props.initialData?.slug || '',
        is_active: props.initialData?.is_active ?? true,
        brand_id: props.initialData?.brand_id || '',
        description: props.initialData?.description || '',
        image_key: props.initialData?.image_key || ''
    })

    // Imagen
    const fileInput = ref(null)
    const uploadingImage = ref(false)
    const submitting = ref(false)
    const imagePreview = ref('')

    // Cargar preview de imagen actual
    onMounted(() => {
        if (form.image_key) {
            imagePreview.value = getImageUrl(form.image_key)
        }
    })

    // Auto-genera slug desde nombre
    watch(() => form.name, (val) => {
        if (!isEdit.value || !form.slug) {
            form.slug = val
                .toLowerCase()
                .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
                .replace(/[^a-z0-9\s-]/g, '')
                .trim()
                .replace(/\s+/g, '-')
        }
    })

    const handleFileSelect = async (e: Event) => {
        const target = e.target as HTMLInputElement
        const file = target.files?.[0]

        if (!file) return

        uploadingImage.value = true

        try {
            // Subir imagen
            const result = await uploadImage(file)

            if (result.success) {
                form.image_key = result.imageKey
                imagePreview.value = result.url

                // Limpiar input
                if (fileInput.value) {
                    (fileInput.value as HTMLInputElement).value = ''
                }
            } else {
                console.error('Error al subir imagen:', result.error)
            }
        } catch (err) {
            console.error('Error:', err)
        } finally {
            uploadingImage.value = false
        }
    }

    const clearImage = async () => {
        // Si es edición y ya tenía imagen, eliminar del storage
        if (isEdit.value && props.initialData?.image_key) {
            await deleteImage(props.initialData.image_key)
        }

        form.image_key = ''
        imagePreview.value = ''
    }

    const handleSubmit = async () => {
        submitting.value = true
        try {
            emit('submit', form)
        } finally {
            submitting.value = false
        }
    }
</script>