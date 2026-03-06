<template>
    <div class="py-6">
        <UCard class="max-w-3xl mx-auto">
            <template #header>
                <div class="flex items-center gap-3 py-1">
                    <div class="w-10 h-10 rounded-xl bg-primary-500/15 text-primary-400 flex items-center justify-center text-xl shrink-0">
                        <UIcon :name="isEdit ? 'i-heroicons-pencil-square' : 'i-heroicons-plus-circle'" />
                    </div>
                    <div>
                        <h2 class="text-lg font-semibold leading-tight">
                            {{ isEdit ? 'Editar Producto' : 'Nuevo Producto' }}
                        </h2>
                        <p class="text-xs text-gray-400 mt-0.5">
                            {{ isEdit ? 'Modifica los datos del producto' : 'Completa los campos para crear un producto' }}
                        </p>
                    </div>
                </div>
            </template>

            <UForm @submit="handleSubmit" class="flex flex-col">

                <!-- SECCIÓN: Información General -->
                <div class="py-6 border-b border-gray-700/50">
                    <div class="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-primary-400 mb-5">
                        <UIcon name="i-heroicons-information-circle" />
                        <span>Información General</span>
                    </div>

                    <div class="grid grid-cols-2 gap-x-5 gap-y-4">
                        <UFormField label="Nombre del producto" required class="col-span-2">
                            <UInput
                                v-model="form.nombre"
                                placeholder="Ej: Taladro Percutor 800W"
                                size="lg"
                                icon="i-heroicons-tag"
                            />
                        </UFormField>

                        <UFormField label="Código" class="col-span-1">
                            <UInput
                                v-model="form.codigo"
                                placeholder="Ej: DW-801"
                                size="lg"
                                icon="i-heroicons-hashtag"
                            />
                        </UFormField>

                        <UFormField label="Slug" class="col-span-1">
                            <UInput
                                v-model="form.slug"
                                placeholder="ej: taladro-percutor-800w"
                                size="lg"
                                icon="i-heroicons-link"
                            />
                            <template #hint>
                                <span class="text-xs text-gray-500">Usado en la URL del producto</span>
                            </template>
                        </UFormField>

                        <UFormField label="Descripción corta" class="col-span-2">
                            <UInput
                                v-model="form.descripcion_corta"
                                placeholder="Resumen breve del producto (máx. 120 caracteres)"
                                size="lg"
                                icon="i-heroicons-bars-2"
                                :maxlength="120"
                            />
                            <template #hint>
                                <span class="text-xs text-gray-500">{{ form.descripcion_corta?.length || 0 }}/120 caracteres</span>
                            </template>
                        </UFormField>

                        <UFormField label="Descripción detallada" class="col-span-2">
                            <UTextarea
                                v-model="form.descripcion_larga"
                                placeholder="Describe características, especificaciones técnicas, usos recomendados..."
                                :rows="4"
                                resize
                                class="w-full"
                            />
                        </UFormField>
                    </div>
                </div>

                <!-- SECCIÓN: Precio & Inventario -->
                <div class="py-6 border-b border-gray-700/50">
                    <div class="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-primary-400 mb-5">
                        <UIcon name="i-heroicons-currency-dollar" />
                        <span>Precio & Inventario</span>
                    </div>

                    <div class="grid grid-cols-2 gap-x-5 gap-y-4">
                        <UFormField label="Precio de venta" required class="col-span-1">
                            <UInput
                                v-model.number="form.precio_venta"
                                type="number"
                                min="0"
                                step="0.01"
                                placeholder="0.00"
                                size="lg"
                                icon="i-heroicons-currency-dollar"
                            />
                        </UFormField>

                        <UFormField label="Stock disponible" class="col-span-1">
                            <div class="flex items-center gap-1.5 w-full">
                                <UButton
                                    icon="i-heroicons-minus"
                                    color="gray"
                                    variant="outline"
                                    size="lg"
                                    type="button"
                                    @click="form.stock = Math.max(0, form.stock - 1)"
                                />
                                <UInput
                                    v-model.number="form.stock"
                                    type="number"
                                    min="0"
                                    placeholder="0"
                                    size="lg"
                                    class="flex-1 min-w-0 [&_input]:text-center"
                                />
                                <UButton
                                    icon="i-heroicons-plus"
                                    color="gray"
                                    variant="outline"
                                    size="lg"
                                    type="button"
                                    @click="form.stock++"
                                />
                            </div>
                        </UFormField>

                        <UFormField label="Marca" class="col-span-1">
                            <USelect
                                v-model="form.marca_id"
                                :items="marcas"
                                placeholder="Selecciona una marca"
                                size="lg"
                                icon="i-heroicons-building-storefront"
                            />
                        </UFormField>

                        <UFormField label="Estado del producto" class="col-span-1">
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
                                            {{ form.is_active ? 'Activo' : 'Inactivo' }}
                                        </p>
                                        <p class="text-[10px] text-gray-500 leading-none mt-0.5">
                                            {{ form.is_active ? 'Visible en tienda' : 'Oculto en tienda' }}
                                        </p>
                                    </div>
                                </div>
                                <USwitch v-model="form.is_active" size="lg" />
                            </div>
                        </UFormField>
                    </div>
                </div>

                <!-- SECCIÓN: Imagen -->
                <div class="py-6">
                    <div class="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-primary-400 mb-5">
                        <UIcon name="i-heroicons-photo" />
                        <span>Imagen del Producto</span>
                    </div>

                    <div class="flex gap-5 items-start">
                        <div class="w-[120px] h-[90px] shrink-0 rounded-lg overflow-hidden border border-gray-700 bg-gray-800">
                            <img
                                v-if="form.imagen_principal"
                                :src="form.imagen_principal"
                                alt="Vista previa"
                                class="w-full h-full object-cover"
                            />
                            <div v-else class="w-full h-full flex flex-col items-center justify-center gap-1 text-gray-600 text-[11px]">
                                <UIcon name="i-heroicons-photo" class="text-2xl" />
                                <span>Sin imagen</span>
                            </div>
                        </div>

                        <div class="flex-1 min-w-0">
                            <UFormField label="URL de imagen principal">
                                <UInput
                                    v-model="form.imagen_principal"
                                    placeholder="https://ejemplo.com/imagen.jpg"
                                    size="lg"
                                    icon="i-heroicons-link"
                                    class="w-full"
                                />
                            </UFormField>
                            <p class="text-xs text-gray-500 mt-1.5">Tamaño recomendado: 300×200px.</p>
                        </div>
                    </div>
                </div>

                <!-- ACCIONES -->
                <div class="flex justify-end items-center gap-3 pt-4 border-t border-gray-700/50">
                    <UButton
                        type="button"
                        color="gray"
                        variant="outline"
                        size="lg"
                        icon="i-heroicons-arrow-left"
                        @click="navigateTo('/admin/productos')"
                    >
                        Cancelar
                    </UButton>
                    <UButton
                        type="submit"
                        size="lg"
                        :icon="isEdit ? 'i-heroicons-check' : 'i-heroicons-plus'"
                    >
                        {{ isEdit ? 'Guardar cambios' : 'Crear producto' }}
                    </UButton>
                </div>

            </UForm>
        </UCard>
    </div>
</template>

<script setup lang="ts">
    const props = defineProps<{ initialData?: any, marcas: Array<{ label: string; value: number }> }>()
    const emit = defineEmits(['submit'])
    const isEdit = computed(() => !!props.initialData)

    const form = reactive({
        marca_id: props.initialData?.marca_id || null,
        nombre: props.initialData?.nombre || '',
        descripcion_larga: props.initialData?.descripcion_larga || '',
        descripcion_corta: props.initialData?.descripcion_corta || '',
        imagen_principal: props.initialData?.imagen_principal || 'https://placehold.co/300x200',
        precio_venta: props.initialData?.precio_venta || 0,
        slug: props.initialData?.slug || '',
        codigo: props.initialData?.codigo || '',
        stock: props.initialData?.stock || 0,
        is_active: props.initialData?.is_active ?? true,
    })

    // Auto-genera slug desde nombre (solo al crear o si slug está vacío)
    watch(() => form.nombre, (val) => {
        if (!isEdit.value || !form.slug) {
            form.slug = val
                .toLowerCase()
                .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
                .replace(/[^a-z0-9\s-]/g, '')
                .trim()
                .replace(/\s+/g, '-')
        }
    })

    const handleSubmit = () => { emit('submit', { ...form, marca_id: Number(form.marca_id) }) }
</script>