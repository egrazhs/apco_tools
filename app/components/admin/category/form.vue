<template>
    <UCard class="max-w-2xl mx-auto">
        <template #header>
            <h2 class="text-xl font-semibold">{{ isEdit ? 'Editar Categoría' : 'Crear Categoría' }}</h2>
        </template>

        <UForm @submit="handleSubmit">
            <div class="space-y-4">
                <UFormField label="Nombre">
                    <UInput v-model="form.nombre" />
                </UFormField>

                <UFormField label="Slug">
                    <UInput v-model="form.slug" />
                </UFormField>

                <UFormField>
                    <USwitch v-model="form.activo" label="Activo" />
                </UFormField>
            </div>

            <div class="flex justify-end gap-2 mt-6">
                <UButton color="gray" @click="navigateTo('/admin/categorias')">Cancelar</UButton>

                <UButton type="submit">Guardar</UButton>
            </div>
        </UForm>
    </UCard>
</template>

<script setup lang="ts">
    const props = defineProps<{initialData?: any}>()

    const emit = defineEmits(['submit'])

    const isEdit = computed(() => !!props.initialData)

    const form = reactive({
        nombre: props.initialData?.nombre || '',
        slug: props.initialData?.slug || '',
        activo: props.initialData?.activo ?? true
    })

    const handleSubmit = () => {emit('submit', form)}
</script>