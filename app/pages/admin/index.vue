<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-950">
    <!-- Header / Navbar -->
    <header class="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 px-6 py-4">
      <div class="max-w-5xl mx-auto flex items-center justify-between">
        <div class="flex items-center gap-3">
          <UIcon name="i-lucide-layout-dashboard" class="text-primary-500 w-6 h-6" />
          <h1 class="text-lg font-semibold text-gray-900 dark:text-white">Panel de Administración</h1>
        </div>

        <div class="flex items-center gap-3">
          <UAvatar
            :alt="user?.email ?? 'Admin'"
            size="sm"
          />
          <span class="text-sm text-gray-600 dark:text-gray-400 hidden sm:block">{{ user?.email }}</span>
          <UButton
            color="neutral"
            variant="ghost"
            icon="i-lucide-log-out"
            size="sm"
            label="Salir"
            @click="handleLogout"
          />
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="max-w-5xl mx-auto px-6 py-10">
      <!-- Welcome -->
      <div class="mb-8">
        <h2 class="text-2xl font-bold text-gray-900 dark:text-white">Bienvenido 👋</h2>
        <p class="text-gray-500 dark:text-gray-400 mt-1">Selecciona una sección para gestionar su contenido.</p>
      </div>

      <!-- Cards Grid -->
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <NuxtLink
          v-for="section in sections"
          :key="section.to"
          :to="section.to"
          class="group"
        >
          <UCard
            class="h-full transition-all duration-200 group-hover:ring-2 group-hover:ring-primary-500 group-hover:shadow-lg cursor-pointer"
          >
            <div class="flex flex-col gap-4 p-1">
              <div
                class="w-12 h-12 rounded-xl flex items-center justify-center"
                :class="section.bgColor"
              >
                <UIcon :name="section.icon" class="w-6 h-6" :class="section.iconColor" />
              </div>
              <div>
                <p class="font-semibold text-gray-900 dark:text-white text-base">{{ section.label }}</p>
                <p class="text-sm text-gray-500 dark:text-gray-400 mt-0.5">{{ section.description }}</p>
              </div>
              <div class="flex items-center text-primary-500 text-sm font-medium gap-1 mt-auto">
                Gestionar
                <UIcon name="i-lucide-arrow-right" class="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </div>
            </div>
          </UCard>
        </NuxtLink>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
const { logout } = useAuth()
const user = useSupabaseUser()

const handleLogout = async () => {
  await logout()
  await navigateTo('/login')
}

const sections = [
  {
    to: '/admin/categorias',
    label: 'Categorías',
    description: 'Crea, edita y elimina las categorías de productos.',
    icon: 'i-lucide-folder',
    bgColor: 'bg-blue-100 dark:bg-blue-900/30',
    iconColor: 'text-blue-600 dark:text-blue-400',
  },
  {
    to: '/admin/marcas',
    label: 'Marcas',
    description: 'Administra las marcas disponibles en el catálogo.',
    icon: 'i-lucide-tag',
    bgColor: 'bg-violet-100 dark:bg-violet-900/30',
    iconColor: 'text-violet-600 dark:text-violet-400',
  },
  {
    to: '/admin/productos',
    label: 'Productos',
    description: 'Gestiona el inventario completo de productos.',
    icon: 'i-lucide-package',
    bgColor: 'bg-emerald-100 dark:bg-emerald-900/30',
    iconColor: 'text-emerald-600 dark:text-emerald-400',
  },
]
</script>