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
                            {{ isEdit ? 'Editar Agrupación' : 'Nueva Agrupación' }}
                        </h2>
                        <p class="text-xs text-gray-400 mt-0.5">
                            {{ isEdit ? 'Modifica los datos de la agrupación' : 'Ingresa los datos de la nueva agrupación' }}
                        </p>
                    </div>
                </div>
            </template>

            <UForm @submit="handleSubmit" class="flex flex-col">

                <!-- INFORMACIÓN GENERAL -->
                <div class="py-6 border-b border-gray-700/50">
                    <div class="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-primary-400 mb-5">
                        <UIcon name="i-heroicons-building-storefront" />
                        <span>Información de la Agrupación</span>
                    </div>
                    <UFormField label="Nombre de la Agrupación" required>
                        <UInput
                            v-model="form.name"
                            placeholder="Ej: DeWalt, Bosch, Stanley..."
                            size="lg"
                            icon="i-heroicons-building-storefront"
                        />
                    </UFormField>

                    <UFormField label="Slug" required>
                        <UInput
                            v-model="form.slug"
                            placeholder="Misma que el nombre de la marca, en minusculas y - en vez de espacio"
                            size="lg"
                            icon="i-heroicons-building-storefront"
                        />
                    </UFormField>

                    <UFormField label="Descripción">
                        <UTextarea
                            v-model="form.description"
                            placeholder="Descripcion de la marca..."
                            size="lg"
                            icon="i-heroicons-building-storefront"
                            class="w-full"
                        />
                    </UFormField>

                    <UFormField label="Orden de muestra" required class="col-span-2">
                        <UInput
                            v-model.number="form.display_order"
                            type="number"
                            min="1"
                            step="1"
                            placeholder="999"
                            size="lg"
                            icon="i-heroicons-numbered-list"
                        />
                    </UFormField>


                    <!-- Marca (FILTRO: define qué categorías se listan) -->
                    <UFormField label="Marca *" required>
                        <USelect
                            v-model="form.brand_id"
                            :items="marcas"
                            placeholder="Selecciona una marca"
                            size="lg"
                            icon="i-heroicons-building-storefront"
                            value-attribute="value"
                        />
                    </UFormField>

                    <!-- Categoría (FILTRADA por marca) -->
                    <UFormField label="Categoría *" required>
                        <USelect
                            v-model="form.category_id"
                            :items="filteredCategories"
                            placeholder="Selecciona una categoría"
                            size="lg"
                            icon="i-heroicons-folder"
                            :disabled="!form.brand_id"
                        />
                        <template v-if="!form.brand_id" #hint>
                            <span class="text-xs text-gray-500">Selecciona una marca primero</span>
                        </template>
                        <template v-else-if="filteredCategories.length === 0" #hint>
                            <span class="text-xs text-yellow-500">No hay categorías para esta marca</span>
                        </template>
                    </UFormField>
                </div>

                <!-- ESTADO -->
                <div class="py-6 border-b border-gray-700/50">
                    <div class="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-primary-400 mb-5">
                        <UIcon name="i-heroicons-cog-6-tooth" />
                        <span>Estado</span>
                    </div>

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
                </div>

                <!-- IMAGEN -->
                <div class="py-6 border-b border-gray-700/50">
                    <div class="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-primary-400 mb-5">
                        <UIcon name="i-heroicons-photo" />
                        <span>Imagen de la Agrupación</span>
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
                        <UFormField :label="imagePreview ? 'Cambiar Imagen' : 'Subir Imagen'">
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
                                    {{ uploadingImage ? 'Subiendo...' : 'Seleccionar Imagen' }}
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
                        @click="navigateTo('/admin/agrupaciones')"
                    >
                        Cancelar
                    </UButton>
                    <UButton
                        type="submit"
                        size="lg"
                        :icon="isEdit ? 'i-heroicons-check' : 'i-heroicons-plus'"
                        :loading="submitting"
                    >
                        {{ isEdit ? 'Guardar cambios' : 'Crear Agrupación' }}
                    </UButton>
                </div>

            </UForm>
        </UCard>
    </div>
</template>

<script setup lang="ts">
    const props = defineProps<{ 
    	initialData?: any
    	marcas: Array<{ label: string; value: number; slug: string }>
    	categories: Array<{ label: string; value: number; brand_id: number }>
     }>()
    const emit = defineEmits(['submit'])
    const isEdit = computed(() => !!props.initialData)

    // Marca inicial: en edición sale de la categoría actual; en create queda null
    const initialBrandId = props.categories
        .find(c => c.value === props.initialData?.category_id)?.brand_id ?? null

    const { uploadImage, getImageUrl, deleteImage } = useStorageImage('grouping-images')

    // Formulario
    const form = reactive({
        name: props.initialData?.name || '',
        image_key: props.initialData?.image_key || '',
        description: props.initialData?.description || '',
        slug: props.initialData?.slug || '',
        display_order: props.initialData?.display_order || 999,
        is_active: props.initialData?.is_active || true,
        category_id: props.initialData?.category_id || null,
        brand_id: initialBrandId as number | null,
    })

    // ── CATEGORÍAS FILTRADAS POR MARCA ─────────────────────────────────
    const filteredCategories = computed(() =>
        props.categories.filter(c => c.brand_id === form.brand_id)
    )

    // Al cambiar de marca, la categoría elegida ya no aplica.
    // No dispara en la precarga de edición (brand_id se asigna al crear el reactive).
    watch(() => form.brand_id, () => {
        form.category_id = null
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

     // ── SUBMIT ─────────────────────────────────────────────────────────
    const handleSubmit = () => {
        if (!form.brand_id) {
            alert('Selecciona una marca')
            return
        }
        if (!form.category_id) {
            alert('Selecciona una categoría')
            return
        }
        if (!form.name.trim()) {
            alert('El nombre es requerido')
            return
        }

        // brand_id es solo un filtro del form, no es columna de subcategories
        const { brand_id, ...payload } = form

        emit('submit', payload)
    }
</script>