<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import Button from 'primevue/button'
import { useCarritoStore } from '@/stores/carrito'

const router = useRouter()
const carritoStore = useCarritoStore()
const compraExitosa = ref<string | null>(null)

function incrementar(libroId: number, cantidadActual: number, stockMax?: number) {
  compraExitosa.value = null
  const limite = stockMax ?? cantidadActual + 1
  if (cantidadActual < limite) {
    carritoStore.actualizarCantidad(libroId, cantidadActual + 1)
  }
}

function decrementar(libroId: number, cantidadActual: number) {
  compraExitosa.value = null
  carritoStore.actualizarCantidad(libroId, cantidadActual - 1)
}

function quitarItem(libroId: number) {
  compraExitosa.value = null
  carritoStore.quitarLibro(libroId)
}

function vaciarCarrito() {
  compraExitosa.value = null
  carritoStore.limpiarCarrito()
}

async function procesarCompra() {
  compraExitosa.value = null
  try {
    await carritoStore.confirmarCompra()
    compraExitosa.value = '¡Compra realizada con éxito!'
  } catch {
    // carritoStore.errorMessage ya queda poblado desde el store
  }
}

function volverAlCatalogo() {
  router.push('/libros')
}
</script>

<template>
  <div>
    <!-- 1. Franja de título compacta -->
    <section class="breadcrumb_part mb-4" style="height: auto; min-height: unset; padding: 30px 0">
      <div class="container-fluid px-0">
        <div class="row">
          <div class="col-lg-12">
            <div class="breadcrumb_iner" style="height: auto; min-height: unset; padding: 0">
              <h2 class="mb-0">Carrito de Compras</h2>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 2. Contenido principal -->
    <section class="product_list pb-5">
      <div class="container-fluid px-0">
        <!-- Alertas de éxito o error -->
        <div v-if="compraExitosa" class="alert alert-success mb-4" role="alert">
          {{ compraExitosa }}
        </div>

        <div v-if="carritoStore.errorMessage" class="alert alert-danger mb-4" role="alert">
          {{ carritoStore.errorMessage }}
        </div>

        <!-- Carrito vacío -->
        <div
          v-if="carritoStore.items.length === 0"
          class="card border-0 shadow-sm p-5 bg-white rounded text-center"
        >
          <i class="pi pi-shopping-cart mb-3" style="font-size: 2.5rem; color: #b08ead"></i>
          <h5 class="fw-bold mb-2" style="color: #4b3049">Tu carrito está vacío</h5>
          <p class="text-muted mb-4">Explora el catálogo y agrega los libros que deseas comprar.</p>
          <div>
            <Button
              label="Ir al catálogo de libros"
              icon="pi pi-book"
              class="text-white px-4 py-2 btn-custom-pillomart"
              @click="volverAlCatalogo"
            />
          </div>
        </div>

        <!-- Carrito con ítems -->
        <div v-else class="row g-4">
          <!-- Tabla de ítems -->
          <div class="col-lg-8">
            <div class="card border-0 shadow-sm bg-white rounded">
              <div
                class="card-header text-white d-flex justify-content-between align-items-center py-3 px-4 custom-card-header"
              >
                <span class="fw-bold">Libros seleccionados</span>
                <Button
                  label="Seguir comprando"
                  icon="pi pi-arrow-left"
                  size="small"
                  class="text-white btn-refresh-pillomart"
                  @click="volverAlCatalogo"
                />
              </div>

              <div class="card-body px-0 pb-0">
                <div class="table-responsive">
                  <table class="table table-hover align-middle mb-0 custom-table">
                    <thead>
                      <tr>
                        <th>Libro</th>
                        <th>Precio unit.</th>
                        <th class="text-center">Cantidad</th>
                        <th>Subtotal</th>
                        <th class="text-center">Quitar</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="item in carritoStore.items" :key="item.libro.id">
                        <td class="fw-bold" style="color: #4b3049">
                          {{ item.libro.titulo }}
                        </td>
                        <td>Bs. {{ Number(item.libro.precio ?? 0).toFixed(2) }}</td>
                        <td class="text-center text-nowrap">
                          <div class="d-inline-flex align-items-center gap-2">
                            <Button
                              icon="pi pi-minus"
                              size="small"
                              text
                              rounded
                              aria-label="Disminuir cantidad"
                              @click="item.libro.id && decrementar(item.libro.id, item.cantidad)"
                            />
                            <span class="fw-bold px-2">{{ item.cantidad }}</span>
                            <Button
                              icon="pi pi-plus"
                              size="small"
                              text
                              rounded
                              aria-label="Aumentar cantidad"
                              :disabled="
                                item.libro.stock !== undefined && item.cantidad >= item.libro.stock
                              "
                              @click="
                                item.libro.id &&
                                incrementar(item.libro.id, item.cantidad, item.libro.stock)
                              "
                            />
                          </div>
                        </td>
                        <td class="fw-bold">
                          Bs. {{ (Number(item.libro.precio ?? 0) * item.cantidad).toFixed(2) }}
                        </td>
                        <td class="text-center">
                          <Button
                            icon="pi pi-trash"
                            text
                            severity="danger"
                            aria-label="Quitar libro"
                            @click="item.libro.id && quitarItem(item.libro.id)"
                          />
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>

          <!-- Resumen de compra -->
          <div class="col-lg-4">
            <div class="card border-0 shadow-sm p-4 bg-white rounded">
              <h5 class="fw-bold mb-3 pb-2 border-bottom" style="color: #4b3049">
                Resumen de Compra
              </h5>

              <div class="d-flex justify-content-between mb-2">
                <span class="text-muted">Total de unidades:</span>
                <span class="fw-bold">{{ carritoStore.cantidadTotal }}</span>
              </div>

              <div class="d-flex justify-content-between align-items-center mb-4 pt-2 border-top">
                <span class="fw-bold fs-6" style="color: #4b3049">Total a pagar:</span>
                <span class="fw-bold fs-5" style="color: #4b3049">
                  Bs. {{ carritoStore.totalPagar.toFixed(2) }}
                </span>
              </div>

              <div class="d-grid gap-2">
                <Button
                  label="Confirmar compra"
                  icon="pi pi-check"
                  class="text-white py-2 btn-custom-pillomart"
                  :loading="carritoStore.loading"
                  :disabled="carritoStore.loading || carritoStore.items.length === 0"
                  @click="procesarCompra"
                />

                <Button
                  label="Vaciar carrito"
                  icon="pi pi-times"
                  severity="secondary"
                  outlined
                  :disabled="carritoStore.loading"
                  @click="vaciarCarrito"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.card {
  border-radius: 8px;
}

.custom-card-header {
  background-color: #4b3049;
  border-radius: 8px 8px 0 0;
}

.btn-refresh-pillomart {
  background-color: #b08ead !important;
  border-color: #b08ead !important;
  transition: opacity 0.2s ease;
}

.btn-refresh-pillomart:hover {
  opacity: 0.85;
}

.btn-custom-pillomart {
  background-color: #b08ead !important;
  border-color: #b08ead !important;
  transition: background-color 0.3s ease;
}

.btn-custom-pillomart:hover:not(:disabled) {
  background-color: #4b3049 !important;
  border-color: #4b3049 !important;
}

.custom-table thead th {
  background-color: #f4edf3;
  color: #4b3049;
  border-bottom: 2px solid #b08ead;
  font-weight: 700;
}

.custom-table tbody tr:hover {
  background-color: #faf7fa;
}
</style>
