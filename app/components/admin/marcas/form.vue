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
                            {{ isEdit ? 'Modifica el nombre de la marca' : 'Ingresa el nombre de la nueva marca' }}
                        </p>
                    </div>
                </div>
            </template>

            <UForm @submit="handleSubmit" class="flex flex-col">

                <div class="py-6 border-b border-gray-700/50">
                    <div class="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-primary-400 mb-5">
                        <UIcon name="i-heroicons-building-storefront" />
                        <span>Información de la Marca</span>
                    </div>

                    <UFormField label="Nombre de la marca" required>
                        <UInput
                            v-model="form.nombre"
                            placeholder="Ej: DeWalt, Bosch, Stanley..."
                            size="lg"
                            icon="i-heroicons-building-storefront"
                        />
                    </UFormField>
                </div>

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

    const form = reactive({
        nombre: props.initialData?.nombre || '',
    })

    const handleSubmit = () => { emit('submit', form) }
</script>