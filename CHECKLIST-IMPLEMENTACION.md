# ✅ Checklist: Implementar Sistema de Emails

## 📦 Paso 1: Verificar instalación (1 min)

```bash
# En C:\xampp\htdocs\apco_tools\app
npm list resend
```

**Esperado:** `resend@x.x.x`

Si NO está instalado:
```bash
npm install resend
```

---

## 🔐 Paso 2: Obtener API Key de Resend (5 min)

- [ ] Ve a https://resend.com
- [ ] Regístrate / Inicia sesión
- [ ] Ve a **Integrations** → **API Keys**
- [ ] Copia tu clave (empieza con `re_`)
- [ ] Abre `.env.local` en la raíz del proyecto

---

## 🔧 Paso 3: Configurar `.env.local` (2 min)

En `C:\xampp\htdocs\apco_tools\.env.local`:

```env
# Resend
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxx
NUXT_MAIL_FROM=noreply@apcotools.com
NUXT_MAIL_TO_CONTACT=HerramientasAltaCalidad@hotmail.com
NUXT_PUBLIC_SITE_URL=http://localhost:3000
```

**Nota:** `.env.local` es gitignored, es seguro tener la API key aquí.

- [ ] Guardado `.env.local`

---

## 📁 Paso 4: Copiar archivos (5 min)

### A. Composable reutilizable

**Copiar archivo:** `/home/claude/useEmailService.ts`

**Pegar en:** `C:\xampp\htdocs\apco_tools\app\composables\useEmailService.ts`

- [ ] Archivo copiado y guardado

### B. Endpoints del servidor

**Copiar archivo:** `/home/claude/cotizacion.post.ts`

**Pegar en:** `C:\xampp\htdocs\apco_tools\app\server\api\cotizacion.post.ts`

- [ ] Archivo copiado y guardado

**Copiar archivo:** `/home/claude/contacto.post.ts`

**Pegar en:** `C:\xampp\htdocs\apco_tools\app\server\api\contacto.post.ts`

- [ ] Archivo copiado y guardado

### C. Componentes actualizados

**Opción A:** Usar la página mejorada (RECOMENDADO)

```bash
# Reemplaza completamente C:\xampp\htdocs\apco_tools\app\pages\cotizacion.vue
# con el contenido de /home/claude/cotizacion-actualizado.vue
```

- [ ] `pages/cotizacion.vue` actualizada

**Opción B:** Actualizar solo el formulario (si tienes más cambios)

Basta cambiar estas líneas en tu `cotizacion.vue`:

**De:**
```vue
<form class="mt-4">
    <input type="text" name="nombre" placeholder="Nombre*">
    ...
    <button type="submit">Enviar</button>
</form>
```

**A:**
```vue
<script setup lang="ts">
    const { sendEmail, loading, error } = useEmailService()
    
    const form = reactive({
        nombre: '',
        empresa: '',
        email: '',
        telefono: '',
        mensaje: '',
    })

    async function handleSubmit() {
        try {
            await sendEmail('/api/cotizacion', form)
            // ... toast de éxito
        } catch (err) {
            // ... toast de error
        }
    }
</script>

<form @submit.prevent="handleSubmit">
    <UInput v-model="form.nombre" placeholder="Nombre *" />
    <UInput v-model="form.email" type="email" placeholder="Email *" />
    ...
    <UButton type="submit" :loading="loading">Enviar</UButton>
</form>
```

---

## 🧪 Paso 5: Probar en desarrollo (10 min)

```bash
# En PowerShell (como Administrator)
cd C:\xampp\htdocs\apco_tools\app
npm run dev
```

Espera a que diga: `Local: http://localhost:3000`

- [ ] Servidor corriendo

### Prueba el formulario:

1. Ve a http://localhost:3000/cotizacion
2. Llena todos los campos
3. Haz clic en "Enviar solicitud"
4. Revisa la consola del servidor (debe decir "Email sent")
5. Revisa tu email (bandeja de entrada o spam)

- [ ] Email de confirmación al cliente recibido ✓
- [ ] Email de admin recibido ✓

---

## 🚀 Paso 6: Implementar en más formularios (15 min)

### Formulario de contacto (contacto.vue)

1. Abre `C:\xampp\htdocs\apco_tools\app\components\contacto.vue`
2. Reemplaza con el contenido de `/home/claude/contacto-mejorado.vue`
3. El endpoint `/api/contacto` ya está listo (paso 4B)

- [ ] Formulario de contacto actualizado

### Otros formularios (newsletter, comentarios, etc.)

Sigue la guía en `GUIA-EMAILS.md`:

1. Crear `/server/api/tu-endpoint.post.ts`
2. Usar `useEmailService()` en el componente
3. Probar

- [ ] Newsletter (si tienes) ✓
- [ ] Otros formularios ✓

---

## ✨ Paso 7: Personalizar templates (opcional)

Abre `/server/api/cotizacion.post.ts`:

- Cambia colores: `#dc2626` (rojo) → tu color
- Cambia nombres: "APCO Tools" → tu empresa
- Agrega logo: `<img src="..." />`
- Agrega redes sociales

Guarda y recarga http://localhost:3000

- [ ] Templates personalizados (opcional)

---

## 📊 Paso 8: Monitorear en Resend (continuos)

Después de cada envío:

1. Ve a https://resend.com/emails
2. Verás un log de todos los emails enviados
3. Click en cada uno para ver detalles (HTML, destinatario, etc.)

- [ ] Dashboard de Resend explorado

---

## 🎯 Paso 9: Antes de producción

### Variables de entorno en Firebase

Si usas Firebase Cloud Functions, necesitas configurar:

```bash
firebase functions:config:set resend.api_key="re_xxxx"
firebase functions:config:set mail.from="noreply@apcotools.com"
firebase functions:config:set mail.to_contact="admin@apcotools.com"
```

Ver documentación: `FIREBASE-ENV-SETUP.md` (si existe)

- [ ] Variables configuradas en Firebase

### Probar en producción

1. Deploy a Firebase: `firebase deploy --only functions`
2. Envía un test desde https://tudominio.com/cotizacion
3. Verifica email recibido

- [ ] Emails funcionan en producción

---

## 🆘 Troubleshooting

### ❌ "Email service not configured"

```
✅ Solución: Verifica RESEND_API_KEY en .env.local
```

### ❌ "Module not found: resend"

```
✅ Solución: npm install resend
```

### ❌ Los emails van a SPAM

```
✅ Solución: 
1. En Resend dashboard, verifica DKIM/SPF
2. Usa un email verificado en Resend (free tier)
3. Prueba desde otro proveedor
```

### ❌ Error "Cannot read property 'sub' of null"

```
✅ Solución: Es en useSupabaseUser(), no en emails. Ignora.
```

### ❌ Formulario no envía

```
✅ Solución:
1. Abre console del navegador (F12)
2. Revisa Network tab cuando hagas submit
3. Busca POST /api/cotizacion
4. Ve el response para detalles del error
```

---

## 📝 Resumen

| Paso | Archivo | Acción |
|------|---------|--------|
| 1 | - | Verificar instalación de Resend |
| 2 | Resend.com | Obtener API key |
| 3 | `.env.local` | Configurar variables |
| 4A | `useEmailService.ts` | Copiar composable |
| 4B | `cotizacion.post.ts` | Copiar endpoint |
| 4B | `contacto.post.ts` | Copiar endpoint |
| 5 | Browser | Probar en dev |
| 6 | `contacto.vue` | Actualizar componente |
| 7 | `cotizacion.post.ts` | Personalizar emails |
| 8 | Resend dashboard | Monitorear |
| 9 | Firebase | Producción |

---

## ⏱️ Tiempo total estimado: **45 minutos**

¡Listo! Ahora tienes sistema de emails completo y reutilizable 🎉
