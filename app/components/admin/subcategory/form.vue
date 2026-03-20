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
                            {{ isEdit ? 'Editar Subcategoría' : 'Nueva Subcategoría' }}
                        </h2>
                        <p class="text-xs text-gray-400 mt-0.5">
                            {{ isEdit ? 'Modifica los datos de la subcategoría' : 'Completa los campos para crear una subcategoría' }}
                        </p>
                    </div>
                </div>
            </template>

            <UForm @submit="handleSubmit" class="flex flex-col">

                <div class="py-6 border-b border-gray-700/50">
                    <div class="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-primary-400 mb-5">
                        <UIcon name="i-heroicons-information-circle" />
                        <span>Información General</span>
                    </div>

                    <div class="flex flex-col gap-4">
                        <UFormField label="Nombre de la subcategoría" required>
                            <UInput
                                v-model="form.nombre"
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
                                <span class="text-xs text-gray-500">Usado en la URL de la subcategoría</span>
                            </template>
                        </UFormField>

                        <UFormField label="Estado">
                            <div
                                class="flex items-center justify-between px-4 rounded-lg border h-[42px] transition-all duration-200"
                                :class="form.activo
                                    ? 'border-primary-500/40 bg-primary-500/5'
                                    : 'border-gray-700 bg-gray-800/50'"
                            >
                                <div class="flex items-center gap-2">
                                    <UIcon
                                        :name="form.activo ? 'i-heroicons-check-circle' : 'i-heroicons-x-circle'"
                                        class="text-lg transition-colors"
                                        :class="form.activo ? 'text-primary-400' : 'text-gray-500'"
                                    />
                                    <div>
                                        <p class="text-sm font-medium leading-tight">
                                            {{ form.activo ? 'Activa' : 'Inactiva' }}
                                        </p>
                                        <p class="text-[10px] text-gray-500 leading-none mt-0.5">
                                            {{ form.activo ? 'Visible en tienda' : 'Oculta en tienda' }}
                                        </p>
                                    </div>
                                </div>
                                <USwitch v-model="form.activo" size="lg" />
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
                        @click="navigateTo('/admin/subcategorias')"
                    >
                        Cancelar
                    </UButton>
                    <UButton
                        type="submit"
                        size="lg"
                        :icon="isEdit ? 'i-heroicons-check' : 'i-heroicons-plus'"
                    >
                        {{ isEdit ? 'Guardar cambios' : 'Crear subcategoría' }}
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

    const form = reactive({
        nombre: props.initialData?.nombre || '',
        slug: props.initialData?.slug || '',
        activo: props.initialData?.activo ?? true,
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

    const handleSubmit = () => { emit('submit', form) }
</script>