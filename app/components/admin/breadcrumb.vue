<template>
    <div class="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-1">
        <NuxtLink to="/admin" class="hover:text-blue-600">
            <UIcon name="i-heroicons-home" class="w-4 h-4" />
            <span class="pl-2">Admin</span>
        </NuxtLink>

        <UIcon name="i-heroicons-chevron-right" class="w-3 h-3" />
        <span class="text-gray-900 dark:text-white font-medium">{{ actual_page }}</span>
    </div>
</template>

<script setup>
    const props = defineProps({
        actual_page: {
            required: true,
            type: String,
            default: '',
        }
    })
</script>