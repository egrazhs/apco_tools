<template>
    <div class="py-6">
        <UCard class="max-w-md mx-auto">
            <template #header>
                <div class="flex items-center gap-3 py-1">
                    <div class="w-10 h-10 rounded-xl bg-primary-500/15 text-primary-400 flex items-center justify-center text-xl shrink-0">
                        <UIcon :name="isEdit ? 'i-heroicons-pencil-square' : 'i-heroicons-plus-circle'" />
                    </div>
                    <div>
                        <h2 class="text-lg font-semibold leading-tight">
                            {{ isEdit ? 'Editar Marca' : 'Nueva Marca' }}
                        </h2>
                        <p class="text-xs text-gray-400 mt-0.5">
                            {{ isEdit ? 'Modifica los datos de la marca' : 'Ingresa los datos de la nueva marca' }}
                        </p>
                    </div>
                </div>
            </template>

            <UForm @submit="handleSubmit" class="flex flex-col">

                <!-- INFORMACIÓN GENERAL -->
                <div class="py-6 border-b border-gray-700/50">
                    <div class="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-primary-400 mb-5">
                        <UIcon name="i-heroicons-building-storefront" />
                        <span>Información de la Marca</span>
                    </div>
                    <UFormField label="Nombre de la marca" required>
                        <UInput
                            v-model="form.name"
                            placeholder="Ej: DeWalt, Bosch, Stanley..."
                            size="lg"
                            icon="i-heroicons-building-storefront"
                        />
                    </UFormField>
                </div>

                <!-- IMAGEN -->
                <div class="py-6 border-b border-gray-700/50">
                    <div class="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-primary-400 mb-5">
                        <UIcon name="i-heroicons-photo" />
                        <span>Logo de la Marca</span>
                    </div>

                    <div class="flex flex-col gap-4">
                        <!-- Preview de imagen actual -->
                        <div v-if="imagePreview" class="relative">
                            <img :src="imagePreview" alt="Preview" class="w-full h-40 object-contain rounded-lg border border-gray-700 bg-gray-800/50 p-2" />
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
                        <UFormField :label="imagePreview ? 'Cambiar logo' : 'Subir logo'">
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
                                    {{ uploadingImage ? 'Subiendo...' : 'Seleccionar logo' }}
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
                        @click="navigateTo('/admin/marcas')"
                    >
                        Cancelar
                    </UButton>
                    <UButton
                        type="submit"
                        size="lg"
                        :icon="isEdit ? 'i-heroicons-check' : 'i-heroicons-plus'"
                        :loading="submitting"
                    >
                        {{ isEdit ? 'Guardar cambios' : 'Crear marca' }}
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

    const { uploadImage, getImageUrl, deleteImage } = useStorageImage('brand-images')

    // Formulario
    const form = reactive({
        name: props.initialData?.name || '',
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

    const handleFileSelect = async (e: Event) => {
        const target = e.target as HTMLInputElement
        const file = target.files?.[0]

        if (!file) return

        uploadingImage.value = true

        try {
            const result = await uploadImage(file)

            if (result.success) {
                form.image_key = result.imageKey
                imagePreview.value = result.url

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