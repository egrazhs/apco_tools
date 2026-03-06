<template>
  <div class="flex flex-col min-h-screen">
    <NavbarMain />
    <main class="flex-1">
      <slot />
    </main>
    <!-- Teleport components van al final, fuera del flujo normal -->
    <CartMiniSlide />
  </div>
</template>