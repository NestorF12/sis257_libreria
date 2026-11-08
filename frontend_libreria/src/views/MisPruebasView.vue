<script lang="ts" setup>
import { ref } from 'vue'

const titulo = ref<string>('Libreria de')
const contador = ref<number>(0)
const contenido = ref<string>('libros')

function Incrementar() {
  contador.value++
}
</script>

<template>
  <div>
    <h1>{{ titulo }} - {{ contador }} - {{ contenido }}</h1>
    <!--<button @click="contador++">Incrementar</button>-->
    <button @click="Incrementar">Incrementar</button>
  </div>
</template>

<style scoped></style>
