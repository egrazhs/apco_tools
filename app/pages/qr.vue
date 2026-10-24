<script setup lang="ts">
import { ref, reactive, watch, onMounted } from 'vue'

const container = ref<HTMLElement | null>(null)
const logoName = ref('')
const aviso = ref('')
let qr: any = null

const form = reactive({
  data: 'https://ejemplo.com',
  size: 320,
  dotsType: 'rounded',
  dotsColor: '#14213d',
  cornersType: 'extra-rounded',
  cornersColor: '#14213d',
  bgColor: '#ffffff',
  logo: '',
  logoSize: 0.3,
  logoMargin: 6,
})

const dotsTypes = [
  { value: 'square', label: 'Cuadrados' },
  { value: 'dots', label: 'Puntos' },
  { value: 'rounded', label: 'Redondeados' },
  { value: 'extra-rounded', label: 'Muy redondeados' },
  { value: 'classy', label: 'Elegante' },
  { value: 'classy-rounded', label: 'Elegante redondeado' },
]

const cornerTypes = [
  { value: 'square', label: 'Cuadradas' },
  { value: 'dot', label: 'Circulares' },
  { value: 'extra-rounded', label: 'Redondeadas' },
]

function buildOptions() {
  return {
    width: form.size,
    height: form.size,
    type: 'canvas',
    margin: 8,
    // Con texto vacío la librería falla, así que usamos un espacio
    data: form.data.trim() || ' ',
    image: form.logo || undefined,
    // Nivel H (30%) cuando hay logo, porque el logo tapa parte de los datos
    qrOptions: { errorCorrectionLevel: form.logo ? 'H' : 'M' },
    dotsOptions: { color: form.dotsColor, type: form.dotsType },
    cornersSquareOptions: { color: form.cornersColor, type: form.cornersType },
    cornersDotOptions: { color: form.cornersColor },
    backgroundOptions: { color: form.bgColor },
    imageOptions: {
      crossOrigin: 'anonymous',
      margin: form.logoMargin,
      imageSize: form.logoSize,
      hideBackgroundDots: true,
    },
  }
}

onMounted(async () => {
  // Import dinámico: la librería usa el DOM, así que solo corre en el cliente
  const { default: QRCodeStyling } = await import('qr-code-styling')
  qr = new QRCodeStyling(buildOptions())
  qr.append(container.value)
})

watch(form, () => {
  qr?.update(buildOptions())
  aviso.value =
    form.logo && form.logoSize > 0.35
      ? 'El logo es muy grande: puede que el QR no se pueda escanear.'
      : ''
})

function cargarLogo(e: Event) {
  const file = (e.target as HTMLInputElement).files?.[0]
  if (!file) return
  logoName.value = file.name
  const reader = new FileReader()
  // Data URL: evita problemas de CORS al exportar el canvas
  reader.onload = () => (form.logo = reader.result as string)
  reader.readAsDataURL(file)
}

function quitarLogo() {
  form.logo = ''
  logoName.value = ''
}

function descargar(extension: 'png' | 'svg' | 'jpeg') {
  qr?.download({ name: 'qr', extension })
}
</script>

<template>
  <main class="app">
    <section class="panel">
      <h1>Generador de QR</h1>

      <label class="campo">
        <span>Enlace o texto</span>
        <input v-model="form.data" type="text" placeholder="https://tusitio.com" />
      </label>

      <fieldset>
        <legend>Estilo</legend>
        <label class="campo">
          <span>Forma de los puntos</span>
          <select v-model="form.dotsType">
            <option v-for="t in dotsTypes" :key="t.value" :value="t.value">{{ t.label }}</option>
          </select>
        </label>
        <label class="campo">
          <span>Forma de las esquinas</span>
          <select v-model="form.cornersType">
            <option v-for="t in cornerTypes" :key="t.value" :value="t.value">{{ t.label }}</option>
          </select>
        </label>
        <div class="fila">
          <label class="color">
            <input v-model="form.dotsColor" type="color" />
            <span>Puntos</span>
          </label>
          <label class="color">
            <input v-model="form.cornersColor" type="color" />
            <span>Esquinas</span>
          </label>
          <label class="color">
            <input v-model="form.bgColor" type="color" />
            <span>Fondo</span>
          </label>
        </div>
        <label class="campo">
          <span>Tamaño: {{ form.size }} px</span>
          <input v-model.number="form.size" type="range" min="200" max="600" step="10" />
        </label>
      </fieldset>

      <fieldset>
        <legend>Logo o imagen</legend>
        <input type="file" accept="image/png,image/jpeg,image/svg+xml,image/webp" @change="cargarLogo" />
        <template v-if="form.logo">
          <p class="nombre">{{ logoName }}</p>
          <label class="campo">
            <span>Tamaño del logo: {{ Math.round(form.logoSize * 100) }}%</span>
            <input v-model.number="form.logoSize" type="range" min="0.1" max="0.5" step="0.01" />
          </label>
          <label class="campo">
            <span>Margen alrededor: {{ form.logoMargin }} px</span>
            <input v-model.number="form.logoMargin" type="range" min="0" max="20" step="1" />
          </label>
          <button type="button" class="secundario" @click="quitarLogo">Quitar logo</button>
        </template>
        <p v-if="aviso" class="aviso" role="alert">{{ aviso }}</p>
      </fieldset>
    </section>

    <section class="vista">
      <div ref="container" class="qr" />
      <div class="descargas">
        <button type="button" @click="descargar('png')">Descargar PNG</button>
        <button type="button" @click="descargar('svg')">Descargar SVG</button>
        <button type="button" class="secundario" @click="descargar('jpeg')">JPEG</button>
      </div>
      <p class="nota">Antes de imprimir, pruébalo con al menos dos celulares distintos.</p>
    </section>
  </main>
</template>

<style>
:root {
  --tinta: #14213d;
  --papel: #f7f7f5;
  --linea: #d9d9d4;
  --acento: #1d4ed8;
  --alerta: #b45309;
}
* { box-sizing: border-box; }
body {
  margin: 0;
  background: var(--papel);
  color: var(--tinta);
  font-family: system-ui, -apple-system, 'Segoe UI', sans-serif;
  line-height: 1.5;
}
</style>

<style scoped>
.app {
  display: grid;
  grid-template-columns: minmax(280px, 400px) 1fr;
  gap: 2rem;
  max-width: 1000px;
  margin: 0 auto;
  padding: 2rem 1rem;
}
h1 { margin: 0 0 1.25rem; font-size: 1.6rem; }

.panel { display: flex; flex-direction: column; gap: 1.25rem; }
fieldset {
  border: 1px solid var(--linea);
  border-radius: 10px;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.9rem;
  margin: 0;
}
legend { padding: 0 0.4rem; font-weight: 600; }

.campo { display: flex; flex-direction: column; gap: 0.3rem; font-size: 0.95rem; }
input[type='text'], select {
  padding: 0.55rem 0.7rem;
  border: 1px solid var(--linea);
  border-radius: 8px;
  font: inherit;
  background: #fff;
}
input:focus-visible, select:focus-visible, button:focus-visible {
  outline: 2px solid var(--acento);
  outline-offset: 2px;
}

.fila { display: flex; gap: 1rem; flex-wrap: wrap; }
.color { display: flex; align-items: center; gap: 0.4rem; font-size: 0.95rem; }
.color input { width: 2.2rem; height: 2.2rem; padding: 0; border: 1px solid var(--linea); border-radius: 6px; background: none; }

.nombre { margin: 0; font-size: 0.85rem; opacity: 0.7; word-break: break-all; }
.aviso { margin: 0; color: var(--alerta); font-size: 0.9rem; }

.vista {
  position: sticky;
  top: 1.5rem;
  align-self: start;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}
.qr {
  background: #fff;
  border: 1px solid var(--linea);
  border-radius: 12px;
  padding: 1rem;
  max-width: 100%;
  overflow: auto;
}
.descargas { display: flex; gap: 0.6rem; flex-wrap: wrap; justify-content: center; }
.nota { margin: 0; font-size: 0.85rem; opacity: 0.7; text-align: center; }

button {
  font: inherit;
  padding: 0.6rem 1rem;
  border: 1px solid var(--acento);
  background: var(--acento);
  color: #fff;
  border-radius: 8px;
  cursor: pointer;
}
button.secundario { background: transparent; color: var(--acento); }

@media (max-width: 760px) {
  .app { grid-template-columns: 1fr; }
  .vista { position: static; order: -1; }
}
</style>