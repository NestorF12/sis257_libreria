<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import InputText from 'primevue/inputtext'
import Password from 'primevue/password'
import Button from 'primevue/button'
import http from '@/plugins/axios'
import type { RegistroCompradorPayload } from '@/models/registro_comprador'

// Ajusta esta ruta si en Swagger usas 'auth/register' u otro endpoint
const ENDPOINT_REGISTRO = 'usuarios'

const router = useRouter()

const form = reactive({
  nombre: '',
  telefono: '',
  email: '',
  clave: '',
})

const loading = ref(false)
const errorMessage = ref<string | null>(null)
const successMessage = ref<string | null>(null)

async function handleRegistro() {
  errorMessage.value = null
  successMessage.value = null

  if (!form.nombre.trim() || !form.telefono.trim() || !form.email.trim() || !form.clave.trim()) {
    errorMessage.value = 'Completa nombre, teléfono, correo electrónico y contraseña.'
    return
  }

  loading.value = true
  try {
    const payload: RegistroCompradorPayload = {
      nombre: form.nombre.trim(),
      telefono: form.telefono.trim(),
      email: form.email.trim(),
      clave: form.clave,
      rol: 'comprador',
    }

    await http.post(ENDPOINT_REGISTRO, payload)

    successMessage.value =
      '¡Registro completado como comprador! Redirigiendo al inicio de sesión...'
    form.nombre = ''
    form.telefono = ''
    form.email = ''
    form.clave = ''

    setTimeout(() => {
      router.push('/login')
    }, 1200)
  } catch (error: any) {
    const backendMessage = error?.response?.data?.message
    if (Array.isArray(backendMessage)) {
      errorMessage.value = backendMessage.join(' | ')
    } else if (typeof backendMessage === 'string') {
      errorMessage.value = backendMessage
    } else {
      errorMessage.value = 'No se pudo registrar el usuario. Revisa los datos ingresados.'
    }
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div>
    <!-- Franja superior -->
    <section class="breadcrumb_part mb-4" style="height: auto; min-height: unset; padding: 30px 0">
      <div class="container-fluid px-4">
        <div class="breadcrumb_iner" style="height: auto; min-height: unset; padding: 0">
          <h2 class="mb-0">Registro de Comprador</h2>
        </div>
      </div>
    </section>

    <!-- Formulario -->
    <section class="pb-5">
      <div class="container" style="max-width: 520px">
        <div class="card border-0 shadow-sm p-4 bg-white rounded">
          <h4 class="fw-bold mb-1" style="color: #4b3049">Crear cuenta en MagnaBooks</h4>
          <p class="text-muted small mb-4">
            Regístrate como <strong>comprador</strong> para agregar libros al carrito y descargar tu
            comprobante.
          </p>

          <div v-if="errorMessage" class="alert alert-danger" role="alert">
            {{ errorMessage }}
          </div>

          <div v-if="successMessage" class="alert alert-success" role="alert">
            {{ successMessage }}
          </div>

          <form @submit.prevent="handleRegistro" class="d-flex flex-column gap-3">
            <div>
              <label for="nombre" class="form-label fw-semibold" style="color: #4b3049">
                Nombre completo
              </label>
              <InputText
                id="nombre"
                v-model="form.nombre"
                placeholder="Ej. Pepe Nava"
                class="w-100"
                required
              />
            </div>

            <div>
              <label for="telefono" class="form-label fw-semibold" style="color: #4b3049">
                Teléfono
              </label>
              <InputText
                id="telefono"
                v-model="form.telefono"
                placeholder="Ej. 78546214"
                class="w-100"
                required
              />
            </div>

            <div>
              <label for="email" class="form-label fw-semibold" style="color: #4b3049">
                Correo electrónico
              </label>
              <InputText
                id="email"
                v-model="form.email"
                type="email"
                placeholder="Ej. pepna@gmail.com"
                class="w-100"
                required
              />
            </div>

            <div>
              <label for="clave" class="form-label fw-semibold" style="color: #4b3049">
                Contraseña
              </label>
              <Password
                id="clave"
                v-model="form.clave"
                placeholder="Ingresa tu contraseña"
                :feedback="false"
                toggleMask
                inputClass="w-100"
                class="w-100"
                required
              />
            </div>

            <div class="d-grid gap-2 mt-2">
              <Button
                type="submit"
                label="Registrarse"
                icon="pi pi-user-plus"
                class="text-white py-2 btn-reg-primary"
                :loading="loading"
              />
              <Button
                type="button"
                label="Ya tengo cuenta — Iniciar sesión"
                icon="pi pi-sign-in"
                outlined
                class="btn-reg-outline"
                @click="router.push('/login')"
              />
            </div>
          </form>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.btn-reg-primary {
  background-color: #4b3049 !important;
  border-color: #4b3049 !important;
}

.btn-reg-primary:hover:not(:disabled) {
  background-color: #b08ead !important;
  border-color: #b08ead !important;
}

.btn-reg-outline {
  color: #4b3049 !important;
  border-color: #4b3049 !important;
}
</style>
