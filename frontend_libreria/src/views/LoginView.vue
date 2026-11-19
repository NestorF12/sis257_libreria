<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores'

const router = useRouter()
const email = ref('')
const clave = ref('')
const error = ref(false)

function onSubmit() {
  error.value = false
  const authStore = useAuthStore()
  authStore.login(email.value, clave.value).catch(() => {
    error.value = true
  })
}
</script>

<template>
  <div class="my-5 pt-5">
    <h1 class="text-center">Iniciar Sesión - MagnaBooks</h1>
    <form class="form" @submit.prevent="onSubmit">
      <label class="form-label">Correo Electrónico:</label>
      <input
        v-model="email"
        type="email"
        class="form-input"
        placeholder="correo@ejemplo.com"
        autofocus
        required
      />

      <label class="form-label">Contraseña:</label>
      <input v-model="clave" type="password" class="form-input" placeholder="Contraseña" required />

      <p v-if="error" class="text-danger mt-3">Correo y/o contraseña incorrectos</p>
      <input type="submit" class="form-submit" value="Ingresar" />

      <div class="registro-box">
        <span class="registro-texto">¿Aún no tienes cuenta?</span>
        <button type="button" class="btn-registro" @click="router.push({ name: 'registro' })">
          Registrarse como comprador
        </button>
      </div>
    </form>
  </div>
</template>

<style scoped>
/* Estilos limpios y profesionales para el formulario */
.form {
  margin: 1.5rem auto;
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 400px;
  background: rgba(19, 35, 47, 0.9);
  border-radius: 8px;
  padding: 40px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
}
.form-label {
  margin-top: 1.5rem;
  color: white;
  margin-bottom: 0.5rem;
}
.form-input {
  padding: 10px 15px;
  background: transparent;
  border: 1px solid white;
  color: white;
  border-radius: 4px;
}
.form-submit {
  background: #ee5007;
  border: none;
  border-radius: 4px;
  color: white;
  margin-top: 2.5rem;
  padding: 0.75rem 0;
  cursor: pointer;
  font-weight: bold;
}
.form-submit:hover {
  opacity: 0.92;
}
.text-danger {
  color: #ff6b6b;
  font-size: 0.9rem;
}
.registro-box {
  margin-top: 1.5rem;
  padding-top: 1.25rem;
  border-top: 1px solid rgba(255, 255, 255, 0.2);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.65rem;
}
.registro-texto {
  color: rgba(255, 255, 255, 0.85);
  font-size: 0.9rem;
}
.btn-registro {
  width: 100%;
  background: transparent;
  border: 1px solid #b08ead;
  color: #ffffff;
  border-radius: 4px;
  padding: 0.65rem 0.75rem;
  cursor: pointer;
  font-weight: 600;
  transition:
    background-color 0.2s ease,
    color 0.2s ease;
}
.btn-registro:hover {
  background: #b08ead;
  color: #ffffff;
}
</style>
