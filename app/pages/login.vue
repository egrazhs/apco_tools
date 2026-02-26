<template>
	<div class="min-h-screen flex items-center justify-center">
		<div class="w-full max-w-md p-6 border rounded-lg shadow">
			<h1 class="text-2xl font-bold mb-6 text-center">Iniciar sesión</h1>

			<form @submit.prevent="handleLogin" class="space-y-4">
				<div>
					<label class="block mb-1">Email</label>
					<input v-model="email" type="email" class="w-full border p-2 rounded" required />
				</div>

				<div>
					<label class="block mb-1">Password</label>
					<input v-model="password" type="password" class="w-full border p-2 rounded" required/>
				</div>

				<button type="submit" :disabled="loading" class="w-full bg-black text-white py-2 rounded disabled:opacity-50">{{ loading ? 'Entrando...' : 'Entrar' }}</button>

				<p v-if="errorMsg" class="text-red-500 text-sm">{{ errorMsg }}</p>
			</form>
		</div>
	</div>
</template>

<script setup lang="ts">
const { login } = useAuth()
const user = useSupabaseUser()

const email = ref('')
const password = ref('')
const errorMsg = ref('')
const loading = ref(false)

const handleLogin = async () => {
  errorMsg.value = ''
  loading.value = true

  try {
    await login(email.value, password.value)
  } catch (err: any) {
    errorMsg.value = err.message
  } finally {
    loading.value = false
  }
}

// Redirigir automáticamente cuando haya sesión
watch(user, (val) => {
  if (val) {
    navigateTo('/admin')
  }
}, { immediate: true })
</script>